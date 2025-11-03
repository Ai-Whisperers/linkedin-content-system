# Terry User Manual

Complete guide for daily operations and interactions with Terry AI IT Agent.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Daily Operations](#daily-operations)
4. [Interacting with Terry](#interacting-with-terry)
5. [Approval Workflows](#approval-workflows)
6. [Reading Reports](#reading-reports)
7. [Emergency Procedures](#emergency-procedures)
8. [Customization](#customization)

---

## Introduction

### What is Terry?

Terry is AI-Whisperers' AI IT employee - an automated system that monitors infrastructure, detects problems, and fixes issues 24/7.

### What Terry Does

- **Monitors** 6 GitHub repositories every 6 hours
- **Checks** website uptime every 15 minutes
- **Inspects** Docker containers every 30 minutes
- **Analyzes** problems using AI (GPT-4)
- **Fixes** simple issues automatically
- **Asks permission** for risky operations
- **Reports** daily and monthly statistics

### What Terry Doesn't Do

- Make decisions about business logic
- Access production databases directly
- Modify code without review
- Make irreversible changes without approval
- Replace human judgment

---

## Getting Started

### Accessing Terry

#### Option 1: Web Interface (n8n UI)

```
1. Open browser
2. Navigate to: http://localhost:5678
   (or your configured URL)
3. Login:
   Username: aiwhisperers
   Password: (from .env file)
```

**What you can do**:
- View workflow executions
- See recent alerts
- Manually trigger workflows
- Check system status

#### Option 2: Email Alerts

Terry sends emails to: `alerts@ai-whisperers.com`

**Types of emails**:
- Problem detected
- Approval required
- Action completed
- Daily/weekly summaries

#### Option 3: WhatsApp Messages

For critical alerts, Terry sends WhatsApp messages.

**Phone**: (configured in .env)

**Message types**:
- 🚨 Critical alerts
- ⚠️ Approval requests
- ✅ Resolution confirmations

### Understanding Alert Priorities

| Symbol | Priority | Meaning | Response Time | Channels |
|--------|----------|---------|---------------|----------|
| 🔴 | Critical | Service down, data at risk | Immediate | WhatsApp + Email |
| 🟠 | High | Degraded service | Within 1 hour | Email |
| 🟡 | Medium | Warning, potential issue | Within 4 hours | Email |
| 🟢 | Low | Info, no action needed | Daily digest | Email |

---

## Daily Operations

### Morning Routine (5 minutes)

```
☐ Check email for overnight alerts
☐ Review Terry's daily summary (if configured)
☐ Check n8n UI for any failed workflows
☐ Verify all systems green in dashboard
```

### Weekly Review (15 minutes)

```
☐ Review weekly summary report
☐ Check auto-fix success rate
☐ Look for recurring issues
☐ Update workflows if needed
☐ Review approval patterns
```

### Monthly Tasks (30 minutes)

```
☐ Read monthly performance report
☐ Review cost metrics (API usage)
☐ Rotate API keys (every 90 days)
☐ Archive old execution logs
☐ Update documentation
```

---

## Interacting with Terry

### Viewing Active Workflows

**Via n8n UI:**

1. Open n8n at `http://localhost:5678`
2. Click "Workflows" in sidebar
3. See list of all workflows
4. Green dot = active, Gray = inactive

**Active workflows you'll see:**
- GitHub Health Check (every 6 hours)
- Website Uptime Monitor (every 15 minutes)
- Docker Container Health (every 30 minutes)
- Problem Analysis (triggered by detection)
- Auto-Fix Executor (triggered by approval)

### Checking Recent Executions

**Via n8n UI:**

1. Open workflow
2. Click "Executions" tab
3. See list of past runs

**Execution statuses:**
- ✅ **Success**: Completed normally
- ❌ **Error**: Failed (click to see details)
- ⏸️ **Waiting**: Paused for approval
- ▶️ **Running**: Currently executing

### Manually Triggering a Check

**When to do this:**
- After deploying new code
- When investigating an issue
- To test Terry's response
- Before critical operations

**How to trigger:**

1. Open workflow in n8n
2. Click "Execute Workflow" button (top right)
3. Wait for completion
4. Review results

**Example: Manual website check**
```
1. Open "Website Uptime Monitor" workflow
2. Click "Execute Workflow"
3. Check output:
   - Status code: 200 ✓
   - Response time: 850ms ✓
   - Content check: Passed ✓
```

---

## Approval Workflows

### When Terry Asks for Approval

Terry requests approval when:
- Risk level is Medium or High
- Solution involves system changes
- Container restart is needed multiple times
- Configuration changes required

### Receiving Approval Requests

#### Email Approval

You'll receive an email like this:

```
Subject: ⚠️ Terry Approval Required

Problem: Docker container "work-hours-api" stopped
Risk: Medium
Proposed Fix: Restart container

[APPROVE] [DENY] [MORE INFO]

Expires in 30 minutes
```

### Approving via Email

**Option 1: Click button in email**
- Click "APPROVE" to execute fix
- Click "DENY" to escalate to manual handling
- Click "MORE INFO" for detailed analysis

**Option 2: Reply to email**
```
Subject: Re: Terry Approval Required

APPROVE

(Terry will detect this and proceed)
```

### Approving via WhatsApp

**You'll receive:**
```
⚠️ TERRY APPROVAL REQUIRED

Problem: Container stopped
Risk: Medium
Proposed Fix: docker restart abc123

Reply:
• YES - Approve and execute
• NO - Deny and escalate
• INFO - Get more details

⏱️ Expires in 30 minutes
```

**How to respond:**
Just reply with: `YES`, `NO`, or `INFO`

### Approval Decision Guide

#### When to APPROVE:

✅ **You should approve if:**
- Problem is clearly described
- Solution makes sense
- Risk is acceptable
- You're available to monitor
- It's during business hours (for non-critical)

#### When to DENY:

❌ **You should deny if:**
- Solution seems wrong
- Problem description unclear
- Risk too high
- Need more investigation
- Prefer manual handling

#### When to get MORE INFO:

ℹ️ **Request more info if:**
- Need to understand root cause
- Want to see logs
- Unclear about impact
- Need second opinion

### What Happens After Approval

**If you APPROVE:**
```
1. Terry executes the fix
2. Verifies success
3. Sends confirmation email
4. Logs outcome to database
```

**If you DENY:**
```
1. Terry cancels execution
2. Escalates to manual handling
3. Sends details to team
4. Waits for human intervention
```

**If you don't respond (timeout):**
```
1. After 30 minutes, request expires
2. Terry sends timeout alert
3. No action is taken
4. Manual intervention required
```

---

## Reading Reports

### Daily Summary Email

Sent every morning at 8 AM (configurable).

**Contents:**
```
TERRY DAILY SUMMARY - Nov 3, 2025

Yesterday's Activity:
✓ 4 monitoring checks completed
✓ 2 issues detected
✓ 1 auto-fixed
✓ 1 required your approval

System Health:
✓ GitHub: All repos healthy
✓ Website: 99.8% uptime (14.7 hours)
⚠️ Docker: 1 container restarted

Details:
- work-hours-api container stopped at 2:30 AM
  → Auto-restarted successfully
- Website slow response (4.2s) at 10:15 AM
  → Performance alert sent

No action needed.
```

### Weekly Report

Sent every Monday.

**Contents:**
- Total issues detected
- Auto-fix success rate
- Top 3 recurring issues
- System uptime summary
- Time saved estimation

### Monthly Report

Comprehensive report on 1st of each month.

**Contents:**
- Executive summary
- Detailed metrics (uptime, MTTR, etc.)
- Service health breakdown
- Top issues and resolutions
- AI analysis performance
- Cost analysis
- Recommendations for improvements

**Example metrics:**
```
Month: October 2025

Reliability:
• Uptime: 99.6%
• MTTR: 8 minutes
• Zero production incidents

Automation:
• Issues detected: 52
• Auto-fixed: 43 (83%)
• Manual interventions: 9

Efficiency:
• Developer time saved: 38 hours
• False positive rate: 3.8%
• Approval response time: 12 min avg

Costs:
• GPT-4 API: $45.20
• Infrastructure: $15.00
• Total: $60.20

ROI: $1,840 saved in developer time
```

### Understanding Metrics

#### Uptime
```
Uptime = (Total time - Downtime) / Total time × 100%

Example: 99.6% = 2.9 hours downtime per month
```

#### MTTR (Mean Time To Resolution)
```
MTTR = Total resolution time / Number of incidents

Example: 8 minutes average to fix issues
```

#### Auto-Fix Success Rate
```
Success Rate = Auto-fixed issues / Total issues × 100%

Example: 43/52 = 83%
```

#### False Positive Rate
```
FP Rate = False alerts / Total alerts × 100%

Example: 2/52 = 3.8%

Lower is better (< 5% is excellent)
```

---

## Emergency Procedures

### Terry is Down

**Symptoms:**
- No alerts received for > 6 hours
- n8n UI not accessible
- Workflows not executing

**Steps to resolve:**

1. **Check Docker container**
```bash
docker ps -a | grep terry
```

2. **If container stopped, restart:**
```bash
docker-compose restart n8n
```

3. **Check logs:**
```bash
docker-compose logs -f n8n
```

4. **If still down, check disk space:**
```bash
df -h
```

5. **Contact DevOps if unresolved**

### Website Down (Terry Didn't Alert)

**If website is down but Terry didn't alert:**

1. **Check Terry status** (see above)
2. **Manually trigger website check:**
   - Open "Website Uptime Monitor" workflow
   - Click "Execute Workflow"
   - Review results

3. **If Terry detects issue:**
   - Problem is real, follow alert
4. **If Terry shows healthy:**
   - False negative, investigate separately
   - Check your network connection
   - Verify website from different location

### Too Many False Alerts

**If receiving excessive false positives:**

1. **Review recent alerts** in n8n execution history
2. **Identify pattern** (same service? time of day?)
3. **Adjust thresholds** in workflow settings

**Example: Website response time alerts**
```javascript
// Current threshold
const ALERT_THRESHOLD = 3000; // 3 seconds

// If too sensitive, increase:
const ALERT_THRESHOLD = 5000; // 5 seconds
```

4. **Test adjusted workflow**
5. **Monitor for 24 hours**
6. **Document changes**

### Missing Approvals

**If you approved but Terry didn't execute:**

1. **Check approval webhook** in n8n:
   - Workflows → "Approval Handler"
   - Executions → Find your approval

2. **Verify approval status:**
   - Look for "approved" in execution data
   - Check for errors in webhook processing

3. **Manually execute if needed:**
   - Open "Execute Fix" workflow
   - Add problem ID
   - Click "Execute Workflow"

### Critical Issue During Off-Hours

**If critical alert received at night/weekend:**

1. **Read alert carefully** (don't rush)
2. **Assess actual severity:**
   - Users affected?
   - Data at risk?
   - Can wait until morning?

3. **If truly critical:**
   - Approve fix if low risk
   - Investigate manually if high risk
   - Contact team if unsure

4. **If can wait:**
   - Reply "DENY" to approval
   - Add note: "Will handle in morning"
   - Set reminder for morning

---

## Customization

### Changing Alert Email

**Edit .env file:**
```bash
EMAIL_TO=new-email@domain.com
```

**Restart Terry:**
```bash
docker-compose restart n8n
```

### Adjusting Check Frequencies

**Edit workflow schedule triggers:**

1. Open workflow in n8n
2. Click on "Schedule Trigger" node
3. Modify interval:
   - GitHub: Every 6 hours (default)
   - Website: Every 15 minutes (default)
   - Docker: Every 30 minutes (default)
4. Save workflow

**Recommended frequencies:**
- Critical services: 5-15 minutes
- Important services: 30-60 minutes
- Routine checks: 6-24 hours

### Adding Custom Checks

**Example: Monitor new API endpoint**

1. **Open "Website Uptime Monitor" workflow**
2. **Duplicate the workflow:**
   - Click "..." menu → "Duplicate"
3. **Rename:** "API Health Check"
4. **Modify HTTP Request node:**
```json
{
  "method": "GET",
  "url": "https://your-api.com/health"
}
```
5. **Adjust alert logic if needed**
6. **Activate workflow**

### Customizing Alert Thresholds

**Common thresholds to adjust:**

```javascript
// Website response time
RESPONSE_TIME_WARNING: 3000,  // ms
RESPONSE_TIME_CRITICAL: 5000, // ms

// Container resource usage
CPU_WARNING: 80,    // percent
CPU_CRITICAL: 95,   // percent
MEMORY_WARNING: 80, // percent
MEMORY_CRITICAL: 90,// percent

// GitHub
STALE_DAYS_WARNING: 7,  // days since last commit
STALE_DAYS_CRITICAL: 30,// days

// Error rates
ERROR_RATE_WARNING: 0.01,   // 1%
ERROR_RATE_CRITICAL: 0.05,  // 5%
```

### Creating Custom Notifications

**Example: Slack integration**

1. **Create Slack app** and get webhook URL
2. **Add to n8n:**
   - Credentials → Add Credential → Slack API
   - Enter webhook URL
3. **Add Slack node to workflows:**
   - After "Send Email" node
   - Add "Slack" node
   - Configure message format
4. **Save and test**

---

## Best Practices

### Do's

✅ **Check email daily** for overnight alerts  
✅ **Respond to approvals promptly** (< 30 min)  
✅ **Review weekly reports** for patterns  
✅ **Test manually after deployments**  
✅ **Keep API keys rotated** (every 90 days)  
✅ **Document custom changes**  
✅ **Monitor Terry's own health**  
✅ **Provide feedback** on false positives/negatives

### Don'ts

❌ **Don't ignore critical alerts**  
❌ **Don't approve blindly** (read the details)  
❌ **Don't disable workflows** without backup plan  
❌ **Don't share approval links publicly**  
❌ **Don't modify workflows** without testing  
❌ **Don't forget to backup** before major changes  
❌ **Don't disable logging** (needed for debugging)

---

## Troubleshooting Common Issues

### "I'm not receiving emails"

**Check:**
1. Email credentials in `.env`
2. Spam folder
3. Email sending limits (Gmail: 500/day)
4. SMTP connection in n8n logs

### "Approvals are expiring before I see them"

**Solutions:**
1. Enable WhatsApp notifications (faster)
2. Increase timeout from 30 to 60 minutes
3. Set up multiple approval recipients
4. Enable email forwarding to phone

### "Terry keeps restarting same container"

**This means:**
- Container has persistent issue
- Auto-restart not solving problem

**Actions:**
1. Deny next restart approval
2. Investigate container logs manually
3. Fix underlying issue
4. Update container configuration

### "Too many alerts"

**Solutions:**
1. Increase thresholds (see Customization)
2. Enable smart filtering (reduce duplicates)
3. Move low-priority checks to daily digest
4. Review and adjust severity levels

---

## Quick Reference

### Common Commands

```bash
# Start Terry
docker-compose up -d

# Stop Terry
docker-compose down

# Restart Terry
docker-compose restart n8n

# View logs
docker-compose logs -f n8n

# Check status
docker ps | grep terry

# Backup
./scripts/backup.sh

# Restore
./scripts/restore.sh <backup-file>
```

### Email Reply Commands

```
APPROVE  - Approve fix
DENY     - Deny fix
INFO     - Get more info
STATUS   - Get current status
HELP     - Get help
```

### WhatsApp Reply Commands

```
YES   - Approve
NO    - Deny
INFO  - More details
```

### Priority Codes

```
🔴 CRITICAL - Act immediately
🟠 HIGH     - Act within 1 hour
🟡 MEDIUM   - Act within 4 hours
🟢 LOW      - No immediate action
ℹ️ INFO     - FYI only
```

---

## Support

### Getting Help

**Documentation:**
- [Setup Guide](./SETUP_GUIDE.md) - Installation issues
- [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md) - Common problems
- [Architecture](./ARCHITECTURE.md) - System design
- [API Reference](./API_REFERENCE.md) - Technical details

**Internal:**
- Slack: #terry-agent channel
- Email: devops@ai-whisperers.com
- Emergency: Contact DevOps team directly

### Providing Feedback

**Report issues:**
- False positives/negatives
- Missing alerts
- Incorrect diagnoses
- UI/UX problems

**Suggest improvements:**
- New checks to add
- Better alert messages
- Workflow optimizations
- Feature requests

---

## Glossary

**Auto-fix**: Automatic remediation without human approval

**Approval workflow**: Human-in-the-loop pattern requiring permission

**MTTR**: Mean Time To Resolution - average time to fix issues

**False positive**: Alert for non-existent problem

**False negative**: Missed alert for real problem

**Risk level**: Assessment of potential harm (low/medium/high)

**Execution**: Single run of a workflow

**Node**: Individual step in a workflow

**Webhook**: HTTP endpoint that receives events

**Credential**: Stored API key or authentication token

---

**Terry User Manual v1.0**

*Built by AI-Whisperers for AI-Whisperers*

Last updated: 2025-11-03

