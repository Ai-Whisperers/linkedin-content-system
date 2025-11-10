# Recovery Procedures

## Overview

Step-by-step procedures for recovering from failures in the AI-Whisperers Content Generator. Organized by error type with clear decision trees and commands.

---

## Quick Recovery Index

| Error | Severity | Recovery Time | Manual? | Page |
|-------|----------|---------------|---------|------|
| Race Condition | CRITICAL | 5 min | Yes | [Link](#race-condition-recovery) |
| Manifest Invalid | CRITICAL | 2 min | Yes | [Link](#manifest-validation-failure) |
| API Rate Limit | CRITICAL | Automatic | No | [Link](#api-rate-limit-recovery) |
| File Not Found | HIGH | 10 min | Yes | [Link](#missing-file-recovery) |
| Version Collision | HIGH | 5 min | Yes | [Link](#version-collision-recovery) |

---

## General Recovery Framework

```
1. Detect Error → Check error logs
2. Classify Error → Use ERROR_CATALOG.md
3. Check Retriable → See RETRY_STRATEGIES.md
4. If Retriable → Automatic recovery
5. If Not Retriable → Follow manual procedure below
6. Verify Recovery → Run verification tests
7. Document → Log incident details
```

---

## Race Condition Recovery

### Symptoms
- Multiple workflow executions shown as "running"
- Duplicate files in generated-posts/
- Version mismatches in file metadata

### Detection
```bash
# Check for concurrent executions
curl -X GET http://localhost:5678/api/v1/executions \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '[.data[] | select(.workflowId == "content-generator-v2" and .status == "running")] | length'

# If result > 1, race condition is active
```

### Recovery Steps

**Step 1: Stop All Running Executions**
```bash
# List running executions
curl -X GET "http://localhost:5678/api/v1/executions?status=running" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data[] | select(.workflowId == "content-generator-v2") | .id'

# Stop each execution
EXECUTION_IDS=$(... output from above ...)
for id in $EXECUTION_IDS; do
  curl -X DELETE "http://localhost:5678/api/v1/executions/$id" \
    -H "X-N8N-API-KEY: $N8N_API_KEY"
done
```

**Step 2: Identify Partial Writes**
```bash
# Find batch directory with partial data
cd generated-posts/
ls -ltr batch-*/

# Check file counts
for dir in batch-*/approved/; do
  echo "$dir: $(ls $dir | wc -l) files"
done

# Expected: 5 files per batch
# If < 5, batch is incomplete
```

**Step 3: Clean Up Incomplete Batch**
```bash
# Backup incomplete batch
INCOMPLETE_BATCH="batch-20251110"
mv generated-posts/$INCOMPLETE_BATCH generated-posts/$INCOMPLETE_BATCH.incomplete

# Or delete if no useful data
rm -rf generated-posts/$INCOMPLETE_BATCH
```

**Step 4: Retry Generation**
```bash
# Trigger workflow manually with new runId
curl -X POST http://localhost:5678/webhook/content-generator-linkedin \
  -H "Content-Type: application/json" \
  -d '{"manual_run_id": "'$(date +%Y%m%d-%H%M%S)'"}'
```

**Step 5: Verify**
```bash
# Check execution completed successfully
curl -X GET "http://localhost:5678/api/v1/executions?limit=1" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data[0] | {id, status, finished}'

# Verify file count
NEW_BATCH=$(ls -t generated-posts/ | head -1)
ls generated-posts/$NEW_BATCH/approved/ | wc -l
# Should be 5
```

---

## Manifest Validation Failure

### Symptoms
- Workflow fails at "Validate Manifest" or "Split Sources" node
- Error: "MANIFEST_INVALID: sources array is undefined"
- No files read despite manifest loading

### Detection
```bash
# Check workflow execution logs
cat ~/.n8n/logs/n8n.log | grep "MANIFEST_INVALID"
```

### Recovery Steps

**Step 1: Inspect Manifest**
```bash
# View current manifest code
cat workflows/content-generator-linkedin.json | \
  jq '.nodes[] | select(.name == "Load Context Manifest") | .parameters.jsCode'
```

**Step 2: Validate Manifest Structure**
```javascript
// Run this in browser console or Node.js
const manifest = {
  version: '2.0.0',
  run_id: '20251110',
  sources: [
    { path: '/context/brand/voice.md', category: 'brand', priority: 1, required: true }
    // ... etc
  ],
  created_at: new Date().toISOString()
};

// Validation
console.assert(manifest.sources !== undefined, 'sources is undefined');
console.assert(Array.isArray(manifest.sources), 'sources is not array');
console.assert(manifest.sources.length > 0, 'sources is empty');

manifest.sources.forEach((src, i) => {
  console.assert(src.path, `Source ${i} missing path`);
  console.assert(src.category, `Source ${i} missing category`);
  console.assert(src.priority, `Source ${i} missing priority`);
  console.assert(src.required !== undefined, `Source ${i} missing required`);
});

console.log('✓ Manifest valid');
```

**Step 3: Fix Manifest**
```bash
# If manifest code is broken, restore from git
cd workflows/
git diff content-generator-linkedin.json

# If changes are bad, revert
git checkout HEAD -- content-generator-linkedin.json

# If need to edit, use n8n UI:
# 1. Open n8n: http://localhost:5678
# 2. Open workflow: content-generator-v2
# 3. Edit "Load Context Manifest" node
# 4. Fix jsCode
# 5. Save workflow
```

**Step 4: Retry**
```bash
# Trigger workflow
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
```

---

## API Rate Limit Recovery

### Symptoms
- Error: "rate_limit_error" in logs
- HTTP 429 response from Claude API
- Workflow fails at "Claude Generate" node

### Detection
```bash
# Check for rate limit errors
cat ~/.n8n/logs/n8n.log | grep "rate_limit_error"
```

### Recovery Steps

**Step 1: Verify Automatic Retry**

If retry logic is implemented (FLAW-004 fix):
```
Workflow should automatically retry with exponential backoff:
- Attempt 1: Wait 2s → Retry
- Attempt 2: Wait 4s → Retry
- Attempt 3: Wait 8s → Retry

If all 3 attempts fail → Manual intervention needed
```

**Step 2: Check API Key Quota**
```bash
# Check Claude API usage (if API provides usage endpoint)
# Or check Anthropic Console: https://console.anthropic.com/settings/usage
```

**Step 3: Manual Retry After Cooldown**
```bash
# Wait 60 seconds
sleep 60

# Retry from checkpoint (if implemented)
curl -X POST http://localhost:5678/webhook/content-generator-linkedin \
  -H "Content-Type: application/json" \
  -d '{"resume_from_checkpoint": "PRE_API_CALL", "run_id": "20251110"}'

# Or fresh run
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
```

**Step 4: If Persistent Rate Limiting**
```bash
# Option A: Switch to different API key
# Edit n8n credential: Settings → Credentials → Claude API
# Update API key

# Option B: Use fallback (cached prompt)
# If fallback implemented, workflow should automatically use cached result
```

---

## Missing File Recovery

### Symptoms
- Error: "FILE_NOT_FOUND: /path/to/file.md"
- Error: "ENOENT: no such file or directory"

### Detection
```bash
# Check which file is missing
cat ~/.n8n/logs/n8n.log | grep "FILE_NOT_FOUND"
```

### Recovery Steps

**Step 1: Verify File Paths**
```bash
# Check if files exist
ls -l context/brand/voice.md
ls -l context/services/custom-ai.md
# etc.

# If file doesn't exist:
# - Was it deleted?
# - Was it renamed?
# - Is path wrong in manifest?
```

**Step 2: Restore Missing File**

**Option A: Restore from Git**
```bash
cd context/
git status
# Check if file was deleted

git log -- brand/voice.md
# Check file history

git checkout HEAD -- brand/voice.md
# Restore from latest commit
```

**Option B: Create Placeholder**
```bash
# If file is genuinely new, create placeholder
cat > context/brand/voice.md <<EOF
# Brand Voice

Placeholder content. TODO: Fill in brand voice details.

- Tone: Professional yet approachable
- Style: Technical but accessible
EOF
```

**Step 3: Update Manifest if Path Changed**
```javascript
// If file was renamed or moved, update manifest
// Edit "Load Context Manifest" node in n8n

// OLD:
{ path: '/context/brand/old-voice.md', ... }

// NEW:
{ path: '/context/brand/voice.md', ... }
```

**Step 4: Retry**
```bash
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
```

---

## Version Collision Recovery

### Symptoms
- Post files being overwritten
- Lost content from earlier runs
- Identical filenames despite different content

### Detection
```bash
# Check for duplicate filenames
cd generated-posts/
find . -name "*.md" | xargs basename | sort | uniq -d

# Check for overwrites in git
git log --all --full-history -- generated-posts/batch-*/approved/*.md
```

### Recovery Steps

**Step 1: Identify Collision**
```bash
# Find affected batch
BATCH_DIR="batch-20251110"

# Check file modification times
ls -lt generated-posts/$BATCH_DIR/approved/

# Files with same timestamp → potential collision
```

**Step 2: Recover Lost Content**

**Option A: Restore from Git**
```bash
# Check git history
git log --oneline -- generated-posts/$BATCH_DIR/

# View previous version
git show HEAD^:generated-posts/$BATCH_DIR/approved/service-showcase-v2.0.0-20251110-0.md

# Restore to different filename
git show HEAD^:generated-posts/$BATCH_DIR/approved/service-showcase-v2.0.0-20251110-0.md \
  > generated-posts/$BATCH_DIR/approved/service-showcase-v2.0.0-20251110-0-restored.md
```

**Option B: Check Checkpoints**
```bash
# If checkpoints implemented
ls -lt .checkpoints/$BATCH_DIR/

# Restore from checkpoint
cat .checkpoints/$BATCH_DIR/POST_API_CALL.json | \
  jq '.state.posts[] | select(.variation == "service-showcase")'
```

**Step 3: Prevent Future Collisions**

Implement content hashing in filenames (FLAW-006 fix):
```javascript
// In "Normalize Approved/Revision" nodes:
const contentHash = crypto.createHash('sha256')
  .update(post.full_text)
  .digest('hex')
  .substring(0, 8);

const filename = `${post.version}-${contentHash}.md`;
```

**Step 4: Verify Fix**
```bash
# Generate again
curl -X POST http://localhost:5678/webhook/content-generator-linkedin

# Check filenames include content hash
ls generated-posts/batch-*/approved/
# Should see: v2.0.0-20251110-0-a3f5c2d1.md (with hash suffix)
```

---

## Checkpoint-Based Recovery

### When to Use
- Workflow failed mid-execution
- Want to resume without re-running context loading
- API call succeeded but write failed

### Prerequisites
- Checkpoints implemented (see RETRY_STRATEGIES.md)
- Checkpoint files exist in `.checkpoints/`

### Recovery Steps

**Step 1: List Available Checkpoints**
```bash
ls -lR .checkpoints/

# Example output:
# .checkpoints/20251110/
#   PRE_API_CALL.json
#   POST_API_CALL.json
#   PRE_WRITE.json
```

**Step 2: Inspect Checkpoint**
```bash
cat .checkpoints/20251110/POST_API_CALL.json | jq '.stage, .created_at'
```

**Step 3: Resume from Checkpoint**

**Manual Method:**
```bash
# Extract checkpoint state
CHECKPOINT_STATE=$(cat .checkpoints/20251110/POST_API_CALL.json | jq '.state')

# Trigger workflow with checkpoint state
curl -X POST http://localhost:5678/webhook/content-generator-linkedin \
  -H "Content-Type: application/json" \
  -d "{\"resume\": true, \"state\": $CHECKPOINT_STATE}"
```

**Workflow Method (if implemented):**
```
1. Open n8n UI
2. Create new execution
3. Use "Resume from Checkpoint" node
4. Select checkpoint file
5. Execute workflow
```

**Step 4: Verify Recovery**
```bash
# Check execution succeeded
curl -X GET "http://localhost:5678/api/v1/executions?limit=1" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data[0].status'

# Should be "success"
```

---

## Emergency Procedures

### Complete Workflow Failure

If workflow is completely broken and cannot recover:

**Step 1: Stop All Executions**
```bash
# Stop n8n service
sudo systemctl stop n8n

# Or kill process
pkill -f n8n
```

**Step 2: Backup Current State**
```bash
# Backup workflow
cp workflows/content-generator-linkedin.json workflows/content-generator-linkedin.json.backup

# Backup generated content
tar -czf generated-posts-backup-$(date +%Y%m%d).tar.gz generated-posts/

# Backup n8n database
cp ~/.n8n/database.sqlite ~/.n8n/database.sqlite.backup
```

**Step 3: Restore from Known-Good State**
```bash
# Restore workflow from git
cd workflows/
git log --oneline content-generator-linkedin.json
# Find last known-good commit

git checkout <commit-hash> -- content-generator-linkedin.json
```

**Step 4: Restart n8n**
```bash
sudo systemctl start n8n

# Or manual start
n8n start
```

**Step 5: Import Workflow**
```
1. Open n8n UI: http://localhost:5678
2. Import workflow from workflows/content-generator-linkedin.json
3. Verify all nodes connected correctly
4. Test execution
```

---

## Recovery Checklist

After any recovery:

- [ ] Document what went wrong
- [ ] Document what was done to fix it
- [ ] Verify workflow executes successfully
- [ ] Check generated content quality
- [ ] Update incident log
- [ ] Review if fix should be permanent (code change)
- [ ] Create GitHub issue if bug found

---

## Incident Template

```markdown
# Incident Report: [Error Type]

**Date:** YYYY-MM-DD HH:MM
**Severity:** CRITICAL / HIGH / MEDIUM / LOW
**Workflow Version:** 2.0.0
**Execution ID:** [n8n execution ID]

## Symptoms
[What went wrong?]

## Root Cause
[Why did it happen?]

## Recovery Steps Taken
1. [Step 1]
2. [Step 2]
...

## Time to Recovery
[X minutes]

## Prevention
[How to prevent in future?]

## Follow-up Actions
- [ ] Create bug fix PR
- [ ] Update documentation
- [ ] Add monitoring
```

---

## Related Documentation

- [ERROR_CATALOG.md](./ERROR_CATALOG.md) - Error classification
- [FAILURE_SCENARIOS.md](./FAILURE_SCENARIOS.md) - Detailed failure flows
- [RETRY_STRATEGIES.md](./RETRY_STRATEGIES.md) - Automatic recovery
- [../operations/TROUBLESHOOTING.md](../operations/TROUBLESHOOTING.md) - Diagnostic procedures
- [../operations/RUNBOOKS.md](../operations/RUNBOOKS.md) - Operational procedures

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
**Workflow Version:** 2.0.0
