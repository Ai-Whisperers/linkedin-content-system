# Troubleshooting Guide

## Overview

Diagnostic procedures for common issues in the AI-Whisperers Content Generator.

---

## Quick Diagnostic Commands

```bash
# Check workflow status
curl -X GET http://localhost:5678/api/v1/workflows/content-generator-v2 \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | jq '.active, .updatedAt'

# Check recent executions
curl -X GET "http://localhost:5678/api/v1/executions?limit=5" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data[] | {id, status, error}'

# Check logs
tail -f ~/.n8n/logs/n8n.log | grep -i "error\|fatal\|warning"

# Check system resources
df -h
free -h
ps aux | grep n8n
```

---

## Issue: Workflow Not Executing

### Symptoms
- Webhook returns 404
- Schedule not triggering
- Manual execution button disabled

### Diagnosis

**Check 1: Is workflow active?**
```bash
curl -X GET http://localhost:5678/api/v1/workflows/content-generator-v2 \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | jq '.active'
# Should return: true
```

**Check 2: Is n8n running?**
```bash
ps aux | grep n8n
# Should show n8n process

sudo systemctl status n8n
# Should show "active (running)"
```

**Check 3: Webhook path correct?**
```bash
# Test webhook
curl -X POST http://localhost:5678/webhook/content-generator-linkedin \
  -v
# Should return 200 or execution started
```

### Resolution

**If workflow inactive:**
```bash
curl -X PATCH "http://localhost:5678/api/v1/workflows/content-generator-v2" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": true}'
```

**If n8n not running:**
```bash
sudo systemctl start n8n
# Or manual: n8n start &
```

**If webhook path wrong:**
Check workflow config in n8n UI

---

## Issue: "MANIFEST_INVALID" Error

### Symptoms
- Workflow fails at "Validate Manifest" node
- Error message: "sources array is undefined" or similar

### Diagnosis

**Check manifest structure:**
```bash
# Extract manifest code from workflow
cat workflows/content-generator-linkedin.json | \
  jq '.nodes[] | select(.name == "Load Context Manifest") | .parameters.jsCode'
```

**Validate in browser console:**
```javascript
// Copy manifest code and test
const manifest = { /* paste manifest here */ };
console.log('sources:', manifest.sources);
console.log('is array:', Array.isArray(manifest.sources));
```

### Resolution

**Fix manifest code in n8n UI:**
1. Open workflow in n8n
2. Edit "Load Context Manifest" node
3. Ensure manifest has required structure:
```javascript
{
  version: '2.0.0',
  run_id: runId,
  sources: [
    { path: '...', category: '...', priority: 1, required: true }
  ],
  created_at: new Date().toISOString()
}
```
4. Save and test

---

## Issue: "FILE_NOT_FOUND" Error

### Symptoms
- Workflow fails at "Read Context File" or "Normalize Content"
- Error: "File does not exist: /path/to/file.md"

### Diagnosis

**Check if file exists:**
```bash
# Extract file path from error
FILE_PATH="/context/brand/voice.md"

# Check if file exists
ls -l $FILE_PATH

# If relative path, check from base directory
cd /path/to/contentCreator
ls -l context/brand/voice.md
```

**Check manifest paths:**
```bash
# List all paths in manifest
cat workflows/content-generator-linkedin.json | \
  jq '.nodes[] | select(.name == "Load Context Manifest") | .parameters.jsCode' | \
  grep "path:"
```

### Resolution

**If file doesn't exist:**
```bash
# Option 1: Restore from git
cd context/
git checkout HEAD -- brand/voice.md

# Option 2: Create placeholder
mkdir -p context/brand
cat > context/brand/voice.md <<EOF
# Brand Voice
TODO: Add brand voice content
EOF
```

**If path is wrong:**
Update manifest in workflow to use correct path

---

## Issue: Rate Limit Error (429)

### Symptoms
- Error: "rate_limit_error" in logs
- Workflow fails at "Claude Generate" node
- HTTP 429 response

### Diagnosis

**Check API usage:**
```bash
# Count API calls today
cat ~/.n8n/logs/n8n.log | \
  grep "$(date +%Y-%m-%d)" | \
  grep "Claude Generate" | \
  wc -l

# Check for rate limit errors
cat ~/.n8n/logs/n8n.log | \
  grep "rate_limit_error" | \
  tail -10
```

**Check if retry logic is working:**
```bash
# Look for retry attempts
cat ~/.n8n/logs/n8n.log | \
  grep "RETRY: rate_limit_error"
```

### Resolution

**If retry logic not implemented:**
Wait 60 seconds and manually retry:
```bash
sleep 60
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
```

**If retry logic implemented but still failing:**
Check API key quota at https://console.anthropic.com/settings/usage

**If over quota:**
- Wait for quota reset (usually daily)
- Or upgrade API plan
- Or use backup API key

---

## Issue: Duplicate/Overwritten Files

### Symptoms
- Posts being overwritten
- Multiple runs produce same filename
- Lost content from earlier run

### Diagnosis

**Check for duplicate filenames:**
```bash
cd generated-posts/
find . -name "*.md" -exec basename {} \; | sort | uniq -d
```

**Check runId generation:**
```bash
# Extract runId generation code
cat workflows/content-generator-linkedin.json | \
  jq '.nodes[] | select(.name == "Load Context Manifest") | .parameters.jsCode' | \
  grep "runId"
```

**Check if content hashing is implemented:**
```bash
# Look for content hash in filenames
ls -l generated-posts/batch-*/approved/ | grep -o '[a-f0-9]\{8\}\.md'
```

### Resolution

**Implement content hashing:**
See WORKFLOW_DESIGN.md section 6 for implementation

**Recover overwritten content:**
```bash
# Check git history
git log --all --full-history -- generated-posts/batch-*/approved/*.md

# Restore previous version
git show HEAD^:generated-posts/batch-20251110/approved/post-1.md \
  > generated-posts/batch-20251110/approved/post-1-recovered.md
```

---

## Issue: Workflow Hangs/Timeout

### Symptoms
- Workflow status stuck on "running"
- No progress for >5 minutes
- Eventually times out

### Diagnosis

**Check which node is hanging:**
```bash
# Get execution details
EXECUTION_ID="12345"
curl -X GET "http://localhost:5678/api/v1/executions/$EXECUTION_ID" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data.nodes[] | {name, status, startTime, endTime}'

# Look for node with no endTime
```

**Check if it's API timeout:**
```bash
# Look for timeout in logs
cat ~/.n8n/logs/n8n.log | grep -i "timeout\|etimedout"
```

**Check system resources:**
```bash
# CPU usage
top -n 1 | grep n8n

# Memory usage
free -h

# Disk I/O
iostat -x 1 5
```

### Resolution

**If API timeout:**
- Increase timeout in "Claude Generate" node parameters
- Or implement retry logic (see RETRY_STRATEGIES.md)

**If system resources exhausted:**
```bash
# Kill hung process
pkill -f n8n

# Restart
sudo systemctl start n8n
```

**Prevent future hangs:**
Add timeout configuration to all HTTP nodes

---

## Issue: Circuit Breaker Stuck Open

### Symptoms
- All executions fail immediately
- Error: "CIRCUIT_OPEN: API is unhealthy"

### Diagnosis

**Check circuit breaker state:**
```bash
cat .circuit-breaker.json | jq '{state, failure_count, open_until}'
```

**Calculate time until reset:**
```bash
OPEN_UNTIL=$(cat .circuit-breaker.json | jq -r '.open_until')
NOW=$(date +%s)000
REMAINING=$(( ($OPEN_UNTIL - $NOW) / 1000 ))
echo "Circuit opens in $REMAINING seconds"
```

### Resolution

**Wait for automatic reset:**
```bash
# Wait for timeout
REMAINING=$(( ($(cat .circuit-breaker.json | jq '.open_until') - $(date +%s)000) / 1000 ))
sleep $REMAINING

# Test execution
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
```

**Manual reset (emergency only):**
```bash
# Reset circuit breaker state
cat > .circuit-breaker.json <<EOF
{
  "state": "CLOSED",
  "failure_count": 0,
  "last_failure_time": null,
  "open_until": null,
  "failure_threshold": 5,
  "timeout_ms": 60000,
  "half_open_max_attempts": 1
}
EOF
```

---

## Issue: Content Quality Issues

### Symptoms
- Posts contain forbidden words
- Word count outside range
- Missing required fields

### Diagnosis

**Check validation contract:**
```bash
# Extract validation code
cat workflows/content-generator-linkedin.json | \
  jq '.nodes[] | select(.name == "Hard Validator") | .parameters.jsCode' | \
  grep -A5 "forbidden"
```

**Check generated posts:**
```bash
# Find posts with forbidden words
grep -r "revolutionary\|game-changing\|disruptive" \
  generated-posts/batch-*/approved/

# Check word counts
grep -r "word_count:" generated-posts/batch-*/approved/ | \
  awk '{print $2}' | sort -n
```

### Resolution

**Update validation contract:**
Edit "Hard Validator" node in n8n UI to add/remove validation rules

**Regenerate with stricter rules:**
```bash
# Trigger new generation
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
```

---

## Diagnostic Decision Tree

```
Workflow not working?
│
├─ Can't trigger at all?
│  ├─ Webhook 404? → Check workflow active, check webhook path
│  ├─ n8n down? → Restart n8n
│  └─ Schedule not firing? → Check cron expression
│
├─ Starts but fails quickly?
│  ├─ MANIFEST_INVALID? → Fix manifest structure
│  ├─ FILE_NOT_FOUND? → Restore missing files
│  └─ VALIDATION_FAILED? → Check file content
│
├─ Fails at API call?
│  ├─ Rate limit (429)? → Wait or implement retry
│  ├─ Timeout? → Increase timeout, check network
│  ├─ Circuit breaker open? → Wait for reset
│  └─ Invalid response? → Check API key, check Claude API status
│
├─ Fails at write?
│  ├─ Permission denied? → Check file permissions
│  ├─ Disk full? → Clean up old files
│  └─ Collision? → Implement content hashing
│
└─ Completes but quality issues?
   ├─ Forbidden words? → Update validation contract
   ├─ Wrong format? → Check prompt template
   └─ Inconsistent? → Review brand voice files
```

---

## Getting Help

### Internal Resources
- [ERROR_CATALOG.md](../error-handling/ERROR_CATALOG.md) - All known errors
- [RECOVERY_PROCEDURES.md](../error-handling/RECOVERY_PROCEDURES.md) - Recovery steps
- [RUNBOOKS.md](./RUNBOOKS.md) - Operational procedures

### External Resources
- n8n Community: https://community.n8n.io
- Claude API Status: https://status.anthropic.com
- n8n Documentation: https://docs.n8n.io

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
