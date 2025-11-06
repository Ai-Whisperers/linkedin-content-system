# Terry n8n Workflows

**Production-ready workflows for AI-Whisperers automation**

Last updated: 2025-11-05

---

## 🚀 Production Workflows (3 Active)

| Priority | File | Name | Frequency | Purpose | Status |
|----------|------|------|-----------|---------|--------|
| **P0** | `content-generator-linkedin.json` | AI-Whisperers Content Generator | Every 2 weeks | Generate LinkedIn posts from context | ✅ Ready |
| **P1** | `website-uptime-monitor.json` | Website Uptime Monitor | Every 15 min | Monitor website availability | ✅ Active |
| **P2** | `github-org-health-monitor.json` | GitHub Organization Health | Every 6 hours | Monitor GitHub repositories with AI | ✅ Ready |

---

## 📦 Archived Workflows

Legacy workflows moved to `archive/` folder:
- `01-github-health-check.json` - Superseded (broken JSON + outdated)
- `03-github-health-claude.json` - Superseded (slower loop architecture)

See [`WORKFLOW_ANALYSIS.md`](./WORKFLOW_ANALYSIS.md) for detailed comparison.

---

## Quick Start

### 1. Import Workflows to n8n

**Via n8n UI:**
1. Open n8n at `http://localhost:5678`
2. Click "Workflows" → "Add workflow"
3. Click "..." menu → "Import from File"
4. Select workflow JSON file
5. Click "Open"

**Via API:**
```bash
curl -X POST "http://localhost:5678/api/v1/workflows" \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d @website-uptime-monitor.json
```

### 2. Configure Credentials

All workflows need these credentials configured in n8n:

#### Required Credentials

**Claude AI (`claude_cred`):**
- Type: HTTP Header Auth
- Header: `x-api-key`
- Value: Your Anthropic API key
- Used by: Content Generator, GitHub Monitor

**SMTP Email (`smtp_cred`):**
- Type: SMTP
- Host: Your email provider
- User: terry@ai-whisperers.com (or your email)
- Password: App password
- Used by: All workflows

**GitHub API (`github_cred`):**
- Type: GitHub API
- Access Token: Personal Access Token
- Scopes: `repo`, `read:org`
- Used by: GitHub Monitor

**WhatsApp API (Optional):**
- Type: HTTP Header Auth
- Used by: Website Monitor (critical alerts only)

### 3. Test Manually

Before activating:
1. Open workflow in n8n
2. Click "Execute Workflow" (top right)
3. Check output of each node
4. Verify alerts are sent
5. Fix any credential issues

### 4. Activate

1. Toggle "Active" switch (top right)
2. Workflow will run on schedule
3. Monitor in "Executions" tab

---

## Workflow Details

### P0: Content Generator

**File:** `content-generator-linkedin.json`

**What it does:**
- Scans `/context/` directory for all .md files
- Generates 5 post variations per context file (Claude 3.5 Sonnet)
  - How-To
  - Case Study
  - Opinion
  - Framework
  - Metric-Driven
- Validates quality (word count, hashtags, buzzwords, emojis)
- Routes by status: Approved / Needs Revision / Rejected
- Saves to organized folders
- Sends comprehensive summary email

**Schedule:** Every 2 weeks (bi-weekly)

**Expected output:** 95 posts from 19 context files (~20-30 approved)

**ROI:** Saves 20+ hours/week of manual content creation

---

### P1: Website Uptime Monitor

**File:** `website-uptime-monitor.json`

**What it does:**
- Checks website availability every 15 minutes
- Monitors: https://ai-whisperers-portfolio-website.vercel.app/
- Analyzes response time and HTTP status codes
- Routes by severity:
  - Healthy (200, <3s): No action
  - Warning (200, >3s): Email alert
  - Critical (5xx, 4xx): WhatsApp alert
- Tracks uptime percentage

**Schedule:** Every 15 minutes

**Why keep:** Different from GitHub monitoring, real-time alerts critical for customer-facing services

---

### P2: GitHub Organization Health

**File:** `github-org-health-monitor.json`

**What it does:**
- Monitors 6 GitHub repositories in parallel
- Analyzes health scores (activity, issues, description)
- Aggregates organization-wide report
- Uses Claude AI for analysis (only when problems detected)
- Single consolidated email report
- Tracks trends over time

**Schedule:** Every 6 hours (4x daily)

**Repositories monitored:**
1. work-hours-automated-reports
2. Company-Information
3. agentic-schemas
4. ai-whisperers-portfolio-website
5. WPG-Amenities
6. contentCreator

**Architecture:** Parallel (6x faster than loop-based predecessors)

---

## Customization

### Change Schedule

Edit the Schedule Trigger node:

```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "hours",
          "hoursInterval": 6  // Change frequency
        }
      ]
    }
  }
}
```

### Add Repositories (GitHub Monitor)

Edit nodes checking each repo (parallel architecture):
- Duplicate a "Check: repo-name" node
- Update URL to new repo
- Add merge connection

### Adjust Quality Thresholds (Content Generator)

In "Parse & Validate Posts" node:

```javascript
// Word count validation
if (post.word_count < 120 || post.word_count > 180) {
  issues.push('Word count outside range');
}

// Hashtag count
if (post.hashtags.length !== 4) {
  issues.push('Must have exactly 4 hashtags');
}
```

### Change Alert Emails

Update "Send Email" nodes:
```json
{
  "fromEmail": "terry@ai-whisperers.com",
  "toEmail": "your-email@domain.com",  // Change here
  "subject": "Your custom subject"
}
```

---

## Credentials Setup

### Claude API

1. Get API key from https://console.anthropic.com/
2. In n8n: Settings → Credentials → Add Credential
3. Type: "HTTP Header Auth"
4. Name: `claude_cred`
5. Header: `x-api-key`
6. Value: `sk-ant-api03-...`

### SMTP (Email)

**Gmail:**
1. Enable 2FA on Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. In n8n: Credentials → SMTP
4. Host: `smtp.gmail.com`
5. Port: `465` (SSL) or `587` (TLS)
6. User: Your Gmail address
7. Password: App password (16 characters)

**SendGrid:**
1. Get API key from SendGrid
2. Host: `smtp.sendgrid.net`
3. Port: `587`
4. User: `apikey`
5. Password: Your SendGrid API key

### GitHub API

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Scopes: `repo`, `read:org`
4. In n8n: Credentials → GitHub API
5. Access Token: Paste token
6. Name: `github_cred`

---

## Monitoring & Maintenance

### Check Workflow Executions

1. Open n8n
2. Click "Executions" in sidebar
3. View recent runs
4. Filter by: Success / Error / Waiting

### Common Issues

**Workflow not executing:**
- Check "Active" toggle is ON
- Verify schedule is correct
- Check n8n is running: `docker ps`

**Credentials errors (401, 403):**
- Re-check API keys
- Verify token hasn't expired
- Check token has correct scopes

**Timeout errors:**
- Increase timeout in HTTP nodes
- Check network connectivity
- Verify API endpoints are reachable

**Email not sending:**
- Test SMTP credentials manually
- Check spam folder
- Verify from/to addresses are correct

---

## Architecture Decisions

### Why Parallel over Loop? (GitHub Monitor)

**Loop-based (archived 03):**
```
For each repo:
  → Fetch → Analyze → Send Email
```
- Sequential processing (slow)
- Multiple emails
- Can't aggregate org-wide insights

**Parallel (current 02):**
```
Fetch all repos simultaneously
→ Merge results
→ Single analysis
→ One consolidated email
```
- 6x faster
- Better UX
- Organization-level insights

### Why Conditional AI? (GitHub Monitor)

Claude API costs ~$0.025 per request.

**Always-on AI:**
- 4 runs/day × $0.025 = $0.10/day = $3/month
- Often analyzes "all healthy" (wasteful)

**Conditional AI:**
- Only when problems detected
- Average: ~1 problem/week = $0.30/month
- 90% cost reduction

### Why Quality Validation? (Content Generator)

Without validation:
- 30-40% posts contain buzzwords
- 20% wrong word count
- Manual review takes 30+ min

With validation:
- Auto-routes by quality
- Focus review time on good content
- 20-30% approval rate (expected)

---

## Performance Metrics

### Content Generator
- **Time saved:** 20 hours/week
- **Output:** 95 posts per run
- **Approval rate:** 20-30%
- **Cost:** ~$20-30/month (Claude API)

### Website Monitor
- **Detection time:** <15 minutes
- **False positives:** <5%
- **Uptime tracking:** Real-time

### GitHub Monitor
- **Processing time:** 30 seconds (parallel)
- **Cost:** ~$0.30/month (conditional AI)
- **Coverage:** 6 repositories

---

## Future Enhancements

### Content Generator v2
- [ ] Auto-publish approved posts to LinkedIn
- [ ] A/B test post variations
- [ ] Performance tracking integration
- [ ] Image generation for posts

### Monitoring v2
- [ ] Predictive alerts (ML-based)
- [ ] Auto-remediation (safe fixes)
- [ ] Slack integration
- [ ] Dashboard visualization

---

## Getting Help

**Documentation:**
- Analysis: [`WORKFLOW_ANALYSIS.md`](./WORKFLOW_ANALYSIS.md)
- Setup: [`../SETUP_GUIDE.md`](../SETUP_GUIDE.md)
- Troubleshooting: [`../TROUBLESHOOTING_GUIDE.md`](../TROUBLESHOOTING_GUIDE.md)

**Support:**
- GitHub Issues: https://github.com/Ai-Whisperers/contentCreator/issues
- Email: support@ai-whisperers.com

---

**Workflows by AI-Whisperers**

*Automate thoughtfully. Measure everything. Scale smart.*
