# Operational Runbooks

## Overview

Step-by-step operational procedures for running and maintaining the AI-Whisperers Content Generator.

---

## Daily Operations

### Morning Checklist

```bash
# 1. Check workflow health
curl -X GET http://localhost:5678/api/v1/executions?limit=5 \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data[] | {id, status, startedAt, stoppedAt}'

# 2. Check for failed executions
cat ~/.n8n/logs/n8n.log | grep "ERROR" | tail -20

# 3. Verify last batch generated
ls -lt generated-posts/ | head -5

# 4. Check circuit breaker state
cat .circuit-breaker.json | jq '.state, .failure_count'

# 5. Clean up old checkpoints (keep last 10)
cd .checkpoints && ls -t | tail -n +11 | xargs rm -rf
```

---

## Manual Workflow Trigger

### Via Webhook

```bash
# Trigger content generation
curl -X POST http://localhost:5678/webhook/content-generator-linkedin \
  -H "Content-Type: application/json" \
  -d '{}'

# Trigger with custom runId
curl -X POST http://localhost:5678/webhook/content-generator-linkedin \
  -H "Content-Type: application/json" \
  -d '{"manual_run_id": "'$(date +%Y%m%d-%H%M%S)'"}'
```

### Via n8n UI

1. Navigate to http://localhost:5678
2. Open workflow: "AI-Whisperers Content Generator v2"
3. Click "Execute Workflow"
4. Monitor execution in realtime
5. Review output in "Executions" tab

---

## Monitoring

### Check Execution Status

```bash
# Get recent executions
curl -X GET "http://localhost:5678/api/v1/executions?limit=10" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data[] | select(.workflowId == "content-generator-v2") | {id, status, finished}'

# Check specific execution
EXECUTION_ID="12345"
curl -X GET "http://localhost:5678/api/v1/executions/$EXECUTION_ID" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data | {status, startedAt, stoppedAt, nodes}'
```

### Monitor API Usage

```bash
# Count Claude API calls today
cat ~/.n8n/logs/n8n.log | \
  grep "$(date +%Y-%m-%d)" | \
  grep "Claude Generate" | \
  wc -l

# Check for rate limits
cat ~/.n8n/logs/n8n.log | \
  grep "rate_limit_error" | \
  tail -10
```

### Monitor File System

```bash
# Check batch counts
for dir in generated-posts/batch-*/approved/; do
  echo "$dir: $(ls $dir 2>/dev/null | wc -l) files"
done

# Check disk usage
du -sh generated-posts/ .checkpoints/ .cache/
```

---

## Maintenance Tasks

### Weekly Maintenance

```bash
# 1. Archive old generated posts
ARCHIVE_DIR="generated-posts/archive/$(date +%Y-%m)"
mkdir -p $ARCHIVE_DIR

find generated-posts/batch-* -type d -mtime +30 | \
  xargs -I {} mv {} $ARCHIVE_DIR/

# 2. Clean up cache
find .cache/results/ -type f -mtime +7 -delete

# 3. Backup workflow
cp workflows/content-generator-linkedin.json \
   workflows/backups/content-generator-$(date +%Y%m%d).json

# 4. Review error logs
cat ~/.n8n/logs/n8n.log | \
  grep "ERROR\|FATAL" | \
  grep "$(date +%Y-%m)" > logs/monthly-errors-$(date +%Y-%m).log
```

### Monthly Maintenance

```bash
# 1. Update context files
cd context/
git pull origin main

# 2. Review API costs
# Check Anthropic Console: https://console.anthropic.com/settings/usage

# 3. Performance review
# Analyze execution times
cat ~/.n8n/logs/n8n.log | \
  grep "Execution completed" | \
  awk '{print $NF}' | \
  sort -n | \
  tail -20

# 4. Rotate logs
logrotate /etc/logrotate.d/n8n
```

---

## Deployment Procedures

### Deploy Workflow Update

```bash
# 1. Backup current workflow
n8n export:workflow --id=content-generator-v2 \
  --output=workflows/backups/pre-deploy-$(date +%Y%m%d).json

# 2. Stop workflow (if active)
curl -X PATCH "http://localhost:5678/api/v1/workflows/content-generator-v2" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'

# 3. Deploy new workflow
n8n import:workflow --input=workflows/content-generator-linkedin.json

# 4. Test execution
curl -X POST http://localhost:5678/webhook/content-generator-linkedin

# 5. Verify success
curl -X GET "http://localhost:5678/api/v1/executions?limit=1" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '.data[0].status'

# If status == "success", activate workflow
curl -X PATCH "http://localhost:5678/api/v1/workflows/content-generator-v2" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": true}'
```

### Rollback Procedure

```bash
# 1. Stop current workflow
curl -X PATCH "http://localhost:5678/api/v1/workflows/content-generator-v2" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -d '{"active": false}'

# 2. Import backup
BACKUP_FILE="workflows/backups/pre-deploy-20251110.json"
n8n import:workflow --input=$BACKUP_FILE

# 3. Test and activate
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
# (verify success, then activate)
```

---

## Emergency Procedures

### Workflow Not Responding

```bash
# 1. Check n8n process
ps aux | grep n8n

# 2. Check logs
tail -f ~/.n8n/logs/n8n.log

# 3. If hung, restart n8n
sudo systemctl restart n8n

# Or manual restart
pkill -f n8n
n8n start &
```

### API Key Exhausted

```bash
# 1. Check usage
# Visit: https://console.anthropic.com/settings/usage

# 2. Switch to backup API key
# In n8n UI: Settings → Credentials → Claude API → Update key

# 3. Or implement key rotation in workflow
# (See WORKFLOW_DESIGN.md for implementation)
```

### Disk Space Full

```bash
# 1. Check disk usage
df -h

# 2. Clean up immediately
rm -rf generated-posts/batch-*/needs-revision/*
rm -rf .checkpoints/batch-*
rm -rf .cache/results/*

# 3. Archive to external storage
tar -czf generated-posts-archive-$(date +%Y%m%d).tar.gz generated-posts/
mv generated-posts-archive-*.tar.gz /backup/location/
```

---

## Quality Assurance

### Review Generated Content

```bash
# 1. Get latest batch
LATEST_BATCH=$(ls -t generated-posts/ | grep batch- | head -1)

# 2. Review approved posts
cat generated-posts/$LATEST_BATCH/approved/*.md

# 3. Check quality scores
grep -r "quality_score:" generated-posts/$LATEST_BATCH/approved/ | \
  awk '{print $2}' | \
  sort -n

# 4. Check for common issues
grep -r "revolutionary\|game-changing\|disruptive" \
  generated-posts/$LATEST_BATCH/approved/
```

### Manual Approval Process

```bash
# 1. Review posts needing revision
ls generated-posts/$LATEST_BATCH/needs-revision/

# 2. Edit and move to approved
vim generated-posts/$LATEST_BATCH/needs-revision/post-1.md

# 3. After editing, move to approved
mv generated-posts/$LATEST_BATCH/needs-revision/post-1.md \
   generated-posts/$LATEST_BATCH/approved/post-1-edited.md
```

---

## Incident Response

### Step 1: Assess Severity

| Indicator | Severity | Response Time |
|-----------|----------|---------------|
| Workflow failed once | Low | Next business day |
| Workflow failed 3+ times | Medium | Within 4 hours |
| Data loss/corruption | High | Within 1 hour |
| System down | Critical | Immediate |

### Step 2: Gather Information

```bash
# Collect diagnostic data
mkdir -p incidents/$(date +%Y%m%d-%H%M%S)
cd incidents/$(date +%Y%m%d-%H%M%S)

# Execution logs
curl -X GET "http://localhost:5678/api/v1/executions?limit=20" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" > executions.json

# System logs
tail -1000 ~/.n8n/logs/n8n.log > n8n.log

# Workflow state
cat .circuit-breaker.json > circuit-breaker.json
ls -lR .checkpoints/ > checkpoints.txt
df -h > disk-usage.txt
```

### Step 3: Follow Recovery Procedure

See [RECOVERY_PROCEDURES.md](../error-handling/RECOVERY_PROCEDURES.md)

### Step 4: Document Incident

Create incident report in `incidents/YYYY-MM-DD-description.md`

---

## Related Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Diagnostic procedures
- [RECOVERY_PROCEDURES.md](../error-handling/RECOVERY_PROCEDURES.md) - Recovery steps
- [WORKFLOW_DESIGN.md](../implementation/WORKFLOW_DESIGN.md) - Architecture details

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
