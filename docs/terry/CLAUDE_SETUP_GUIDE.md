# Terry with Claude AI - Setup Guide

**What This Does:** GitHub repository monitoring with intelligent AI analysis powered by Claude 3.5 Sonnet

**Time to Set Up:** 15 minutes
**Prerequisites:** Claude API key, GitHub token, Email configured

---

## What Makes This Better Than GPT-4

✅ **Better reasoning** - Claude excels at technical analysis
✅ **Longer context** - Handles more repository data
✅ **More practical** - Action-oriented recommendations
✅ **Consistent formatting** - Reliable structured output
✅ **You already use it** - Same API you're using now!

---

## Step 1: Get Your Claude API Key (3 min)

1. Go to: **https://console.anthropic.com/**
2. Sign in (you likely already have an account)
3. Click **"API Keys"** in the left menu
4. Click **"Create Key"**
5. Name it: `Terry AI Agent`
6. Copy the key (starts with `sk-ant-api...`)

**Check your billing:**
- Go to **Settings** → **Billing**
- Verify you have credits or auto-recharge enabled
- Claude 3.5 Sonnet costs: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Terry's usage: ~$0.10-0.50 per day (only runs on problems)

---

## Step 2: Add Claude Credential in n8n (5 min)

**In n8n at http://localhost:5678:**

1. Go to **Settings** (gear icon) → **Credentials**
2. Click **"Add Credential"**
3. Search for **"Header Auth"**
4. Select **"Header Auth"**
5. Fill in:
   - **Credential Name:** `Claude API`
   - **Name:** `x-api-key`
   - **Value:** (paste your Claude API key)
6. Click **"Save"**

✅ Credential saved successfully!

---

## Step 3: Import Claude-Powered Workflow (5 min)

**In n8n:**

1. Click **"Workflows"** → **"Add Workflow"**
2. Click **"···"** menu (top-right) → **"Import from File"**
3. Navigate to: `C:\Users\kyrian\Documents\contentCreator\docs\terry\workflows\`
4. Select **`03-github-health-claude.json`**
5. Click **"Open"**

The workflow will load with all nodes connected!

---

## Step 4: Configure Credentials (3 min)

**You'll see several colored nodes. Configure each one:**

### A. GitHub Credentials

1. Click on **"Get Repository Info"** node (blue HTTP box)
2. In right panel, **"Credential to connect with"**:
   - Select **"AI-Whisperers GitHub"**
3. Click on **"Get Recent Commits"** node
4. Select **"AI-Whisperers GitHub"**

### B. Claude Credentials

1. Click on **"Claude AI Analysis"** node (should be in the middle)
2. In right panel, **"Authentication"** section:
   - **Generic Auth Type:** Select **"Header Auth"**
   - **Credential for Header Auth:** Select **"Claude API"**

### C. Email Credentials

1. Click on **"Send Alert Email with AI Analysis"** node
2. Select credential: **"Terry Email"** (or your SMTP credential)
3. Update **"To Email"** to your actual email address
4. Click on **"Send Healthy Status Email"** node
5. Select credential: **"Terry Email"**
6. Update **"To Email"** to your actual email address

---

## Step 5: Test the Workflow (2 min)

**Before activating, let's test it manually:**

1. Make sure all credentials are configured (green checkmarks)
2. Click **"Save"** button (top-right)
3. Name it: **"GitHub Health Check with Claude"**
4. Click **"Execute Workflow"** button

**What Happens:**
1. Checks all 6 AI-Whisperers repositories
2. Analyzes health scores
3. For any problems → Sends data to Claude
4. Claude provides intelligent analysis
5. Emails you with results

**Check your email!** You should receive either:
- ✅ Healthy status report (if all repos good)
- 🤖 AI analysis report (if problems detected)

---

## Step 6: Activate Automated Monitoring

**If the test worked:**

1. Toggle **"Active"** switch (top-right) → should turn GREEN
2. The workflow will now run **automatically every 6 hours**

**Schedule:**
- Every 6 hours, Terry checks all repos
- Only sends email if problems detected
- Claude analyzes and provides actionable recommendations

---

## What the Workflow Does

### Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ Every 6 Hours (Schedule Trigger)                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ Loop Through 6 Repositories                     │
│ • work-hours-automated-reports                  │
│ • Company-Information                           │
│ • agentic-schemas                               │
│ • ai-whisperers-portfolio-website               │
│ • WPG-Amenities                                 │
│ • contentCreator                                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ For Each Repo:                                  │
│ 1. Get repository info (stars, issues, etc.)   │
│ 2. Get recent commits (last 5)                 │
│ 3. Analyze health (calculate score)            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ Health Score Decision                           │
│ • Score ≥ 75 → Healthy (optional email)        │
│ • Score < 75 → Needs Analysis                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ Claude AI Analysis (if needed)                  │
│ • Root Cause: Why is this happening?           │
│ • Impact: How critical is this?                │
│ • Actions: Specific steps to fix               │
│ • Prevention: Avoid future issues              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ Send Email with Analysis                        │
│ • Beautiful HTML format                         │
│ • Health metrics & charts                      │
│ • Claude's recommendations                      │
│ • Links to repository & issues                 │
└─────────────────────────────────────────────────┘
```

---

## What Claude Analyzes

When Claude detects a problem, it provides:

### 1. Root Cause Analysis
**Example:**
```
The repository hasn't been updated in 45 days, likely due to:
- Team focus shifted to other projects
- No active development planned for this quarter
- Maintenance-only mode
```

### 2. Impact Assessment
**Example:**
```
IMPACT: Medium Priority
- No immediate user impact (stable codebase)
- Risk of dependency vulnerabilities accumulating
- May become harder to update later (drift)
```

### 3. Recommended Actions (Prioritized)
**Example:**
```
IMMEDIATE (This Week):
1. Review open issues - close stale ones
2. Run dependency updates (npm audit fix)
3. Add "maintenance mode" note to README

SHORT-TERM (This Month):
4. Schedule quarterly maintenance check
5. Set up Dependabot for auto-updates
6. Archive if truly deprecated

LONG-TERM:
7. Document sunset plan if not returning
```

### 4. Prevention Strategies
**Example:**
```
To prevent this:
- Set calendar reminder for quarterly checks
- Enable GitHub Dependabot alerts
- Add workflow automation for dependency updates
- Document maintenance expectations in CONTRIBUTING.md
```

---

## Health Scoring System

**How Terry calculates repository health:**

| Score | Status | Criteria |
|-------|--------|----------|
| 90-100 | Excellent | Active, low issues, well-documented |
| 75-89 | Healthy | Regular updates, manageable issues |
| 50-74 | Warning | Stale or high issues (Claude analyzes) |
| 0-49 | Critical | Multiple problems (Claude analyzes) |

**Factors affecting score:**

- **-30 points:** No updates in 60+ days
- **-15 points:** No updates in 30-60 days
- **-25 points:** 20+ open issues
- **-10 points:** 10-20 open issues
- **-10 points:** No recent commits
- **-5 points:** Missing description
- **-5 points:** No wiki or pages

---

## Email Report Features

### Healthy Report (Simple)
✅ Quick confirmation
- Health score
- Basic stats
- Repository link

### Problem Report (Detailed with Claude)
🤖 Beautiful HTML email with:
- Health score with color coding
- Repository statistics (stars, forks, issues)
- Problems and warnings listed
- **Claude's AI analysis** (in green box)
- Direct links to repo and issues
- Timestamp and priority level

**Example Email Preview:**

```
┌──────────────────────────────────────┐
│ 🤖 Terry AI Health Report            │
│ Repository: contentCreator           │
│ ⚠️ WARNING                           │
└──────────────────────────────────────┘
│                                      │
│ 📊 Health Score: 68/100             │
│                                      │
│ ⭐ Stars: 2    🐛 Issues: 15         │
│ 🔱 Forks: 1    📅 Days: 35           │
│                                      │
│ ⚠️ Problems Detected:                │
│ • No updates in 35 days              │
│ • Moderate open issues: 15           │
│                                      │
│ 🧠 Claude AI Analysis:               │
│ ┌──────────────────────────────────┐ │
│ │ ROOT CAUSE:                      │ │
│ │ Focus shifted to other projects  │ │
│ │                                  │ │
│ │ RECOMMENDED ACTIONS:             │ │
│ │ 1. Review and close stale issues │ │
│ │ 2. Update dependencies           │ │
│ │ 3. Document status in README     │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [View Repository] [View Issues]      │
└──────────────────────────────────────┘
```

---

## Customization Options

### Change Monitoring Frequency

**Default: Every 6 hours**

To change:
1. Click on **"Every 6 Hours"** node
2. Change interval:
   - Every 3 hours
   - Every 12 hours
   - Daily at specific time
   - Custom cron expression

### Add More Repositories

1. Click on **"Set Repository List"** node
2. Edit the `repositories` array:
```json
["work-hours-automated-reports", "Company-Information", "agentic-schemas", "ai-whisperers-portfolio-website", "WPG-Amenities", "contentCreator", "YOUR-NEW-REPO"]
```
3. Save

### Adjust Health Thresholds

1. Click on **"Analyze Repository Health"** node
2. Edit the JavaScript code
3. Change scoring values:
   - `daysSinceUpdate > 60` → Change 60 to different days
   - `open_issues_count > 20` → Change 20 to different threshold
   - `healthScore -= 30` → Change penalty amounts

### Change Claude's Analysis Style

1. Click on **"Claude AI Analysis"** node
2. Edit the prompt in the JSON body
3. Customize what Claude focuses on:
   - More technical depth
   - Business impact focus
   - Security-focused analysis
   - Cost optimization recommendations

---

## Troubleshooting

### Claude API Errors

**"Authentication failed"**
- Check your API key starts with `sk-ant-api`
- Verify key is active at console.anthropic.com
- Re-create credential in n8n

**"Rate limit exceeded"**
- You're calling Claude too often
- Increase monitoring interval
- Check billing limits at console.anthropic.com

**"Insufficient credits"**
- Add credits to your Anthropic account
- Enable auto-recharge
- Typical usage: $0.10-0.50 per day

### Workflow Errors

**No emails received:**
- Check SMTP credentials are correct
- Test email credentials with "Test Connection"
- Check spam/junk folder
- Verify "To Email" is your correct address

**GitHub API errors:**
- Token expired → regenerate at github.com/settings/tokens
- Rate limit → workflow runs every 6 hours (well within limits)
- Repository not found → check repo name spelling

**Execution fails:**
- Click on failed node (shows red X)
- View error in right panel
- Check all credentials have green checkmarks
- Click "Execute Workflow" to test manually

---

## Cost Estimate

### Claude API Usage

**Per Repository Check (with problems):**
- Input: ~1,000 tokens (repo data)
- Output: ~500 tokens (Claude's analysis)
- Cost: ~$0.01 per analysis

**Daily Cost:**
- 6 repos × 4 checks/day = 24 checks
- If 25% need analysis = 6 analyses/day
- Cost: ~$0.06/day = **$1.80/month**

**Reality:** Even lower because:
- Most repos are healthy (no Claude call)
- Claude only runs when problems detected
- Typical actual cost: **$0.50-1.00/month**

### Compared to GPT-4

| Model | Input Cost | Output Cost | Terry Monthly |
|-------|------------|-------------|---------------|
| Claude 3.5 Sonnet | $3/1M | $15/1M | $0.50-1.00 |
| GPT-4 | $10/1M | $30/1M | $3-6 |
| GPT-4 Turbo | $10/1M | $30/1M | $3-6 |

**Claude is 3-6x cheaper for this use case!**

---

## Next Steps

### After Setup

1. ✅ **Let it run for 24 hours** - Monitor the first few checks
2. ✅ **Review Claude's analysis** - See what issues it catches
3. ✅ **Adjust thresholds** - Fine-tune based on your needs
4. ✅ **Add more repositories** - Expand monitoring

### Additional Workflows to Add

1. **Website Uptime with Claude** - AI analysis of downtime causes
2. **Docker Health with Claude** - Container optimization suggestions
3. **Deployment Monitoring** - CI/CD failure analysis
4. **Security Alerts** - Dependency vulnerability explanations

---

## Benefits Over Manual Monitoring

**Without Terry:**
- ⏰ 30 min/day checking repos manually
- 🤷 Guessing at root causes
- 📝 Writing down issues
- 🔄 Repeat tomorrow

**With Terry + Claude:**
- ✅ Automatic checks every 6 hours
- 🧠 AI explains root causes
- 📧 Prioritized action items delivered
- 🎯 Only alerts when needed

**Time saved:** ~3.5 hours/week
**Value:** Catch problems before they escalate

---

## Support

**Issues?**
- Check workflow execution logs (click "Executions" tab)
- Review credential configuration
- Test each node individually
- Check console.anthropic.com for API status

**Working perfectly?**
- Share on LinkedIn (great content!)
- Add more monitoring workflows
- Customize Claude's analysis prompts

---

**🎉 You now have AI-powered infrastructure monitoring!**

Terry + Claude = Intelligent, proactive IT automation that actually helps.

---

**Built by AI-Whisperers | Paraguay → Global**

*"If you have to do it more than once, automate it."*
