# Terry Workflows

This directory contains example n8n workflow JSON files that can be imported into your Terry installation.

## Available Workflows

### Phase 1: Core Monitoring

| File | Name | Frequency | Purpose |
|------|------|-----------|---------|
| `01-github-health-check.json` | GitHub Repository Health Check | Every 6 hours | Monitors all 6 AI-Whisperers repositories |
| `02-website-uptime.json` | Website Uptime Monitor | Every 15 minutes | Checks website availability and performance |

### Phase 2: Intelligence Layer (Coming Soon)

- GPT-4 Problem Analysis
- Smart Alert Filtering
- Structured Output Formatting

### Phase 3: Auto-Remediation (Coming Soon)

- Auto-Fix with Approval
- Risk Assessment
- Human-in-the-Loop Workflows

### Phase 4: Advanced Integration (Coming Soon)

- GitHub Automation (Issue Triage)
- Vercel Deployment Monitoring
- Monthly Reporting

## How to Import Workflows

### Method 1: Via n8n UI (Recommended)

1. Open n8n at `http://localhost:5678`
2. Click "Workflows" in the sidebar
3. Click the "+" button or "Add workflow"
4. Click the "..." menu (top right)
5. Select "Import from File"
6. Choose a workflow JSON file from this directory
7. Click "Open"

### Method 2: Via n8n CLI

```bash
# If you have n8n CLI installed
n8n import:workflow --input=./workflows/01-github-health-check.json
```

### Method 3: Via API

```bash
curl -X POST "http://localhost:5678/api/v1/workflows" \
  -u "aiwhisperers:password" \
  -H "Content-Type: application/json" \
  -d @./workflows/01-github-health-check.json
```

## After Importing

### 1. Configure Credentials

Each workflow requires certain credentials to be configured:

#### Required Credentials:

**GitHub Workflows:**
- GitHub API token (Personal Access Token)
- Name: "AI-Whisperers GitHub"
- Scopes: `repo`, `workflow`, `admin:org`

**Email Notifications:**
- SMTP credentials
- Name: "Terry Email"
- Recommended: Gmail App Password or SendGrid

**WhatsApp (Optional):**
- WhatsApp Business API token
- Name: "WhatsApp API"
- Type: HTTP Header Auth

#### How to Add Credentials:

1. Open n8n UI
2. Go to Settings → Credentials
3. Click "Add Credential"
4. Select credential type (e.g., "GitHub API")
5. Fill in details
6. Click "Save"

### 2. Update Environment Variables

Some workflows use environment variables. Ensure these are set in your `.env` file:

```bash
GITHUB_ORG=Ai-Whisperers
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_RECIPIENT=+595xxxxxxxxx
EMAIL_TO=alerts@ai-whisperers.com
```

### 3. Test the Workflow

Before activating:

1. Open the imported workflow
2. Click "Execute Workflow" (top right)
3. Check the output for each node
4. Verify alerts are sent correctly
5. Fix any errors

### 4. Activate the Workflow

1. Toggle the "Active" switch (top right)
2. The workflow will now run on its schedule
3. Check "Executions" tab to monitor runs

## Customizing Workflows

### Change Check Frequency

Edit the Schedule Trigger node:

```json
{
  "rule": {
    "interval": [
      {
        "field": "hours",
        "hoursInterval": 6  // Change this number
      }
    ]
  }
}
```

Or use cron expressions:

```json
{
  "rule": {
    "cronExpression": "0 */6 * * *"  // Every 6 hours
  }
}
```

### Add More Repositories

In GitHub workflow, edit the "Set Repository List" node:

```javascript
return [{
  json: {
    repositories: [
      'work-hours-automated-reports',
      'Company-Information',
      'agentic-schemas',
      'ai-whisperers-portfolio-website',
      'WPG-Amenities',
      'AI-Whisperers-Website',
      'your-new-repo-here'  // Add here
    ],
    org: 'Ai-Whisperers'
  }
}];
```

### Adjust Alert Thresholds

In analysis Function nodes, modify values:

```javascript
// Website response time
const SLOW_RESPONSE = 3000; // Change from 3s to 5s

// Health score
if (healthScore < 50) {  // Change threshold
  status = 'critical';
}
```

## Exporting Modified Workflows

After making changes, export for backup:

1. Open workflow in n8n
2. Click "..." menu (top right)
3. Select "Export"
4. Choose format (JSON recommended)
5. Save to this directory

## Workflow Dependencies

Some workflows depend on others:

```
Monitor Workflows (01-03)
    ↓
    Trigger
    ↓
Problem Analysis (04)
    ↓
Risk Assessment (05)
    ↓
    ├─ Auto-Fix (06) [if low risk]
    └─ Approval Workflow (07) [if medium/high risk]
        ↓
        Execute Fix (08)
```

Import in order for best results.

## Troubleshooting

### Workflow Import Failed

**Error:** "Invalid workflow format"

**Solution:**
- Ensure JSON file is valid
- Check file is not corrupted
- Try opening in text editor first

### Workflow Not Executing

**Possible causes:**
1. Workflow not activated (toggle is off)
2. Schedule trigger misconfigured
3. n8n not running
4. Credentials missing or invalid

**Debug steps:**
1. Check "Active" toggle is ON
2. Execute workflow manually
3. Check n8n logs: `docker-compose logs n8n`
4. Verify credentials in Settings

### Nodes Failing

**Error:** "401 Unauthorized"
- Check credentials are configured
- Verify API tokens are valid

**Error:** "Network timeout"
- Check internet connection
- Verify API endpoints are accessible

**Error:** "Cannot read property of undefined"
- Check previous node returned data
- Add IF node to handle empty data

## Best Practices

1. **Test before activating:** Always execute manually first
2. **Use descriptive names:** Rename imported workflows
3. **Add comments:** Use "Sticky Note" nodes to document logic
4. **Version control:** Export after changes
5. **Monitor executions:** Check "Executions" tab regularly
6. **Handle errors:** Add error workflows
7. **Set timeouts:** Prevent long-running workflows

## Getting Help

- Documentation: [../README.md](../README.md)
- Setup Guide: [../SETUP_GUIDE.md](../SETUP_GUIDE.md)
- Workflow Guide: [../WORKFLOW_GUIDES.md](../WORKFLOW_GUIDES.md)
- Troubleshooting: [../TROUBLESHOOTING_GUIDE.md](../TROUBLESHOOTING_GUIDE.md)

---

**Workflows by AI-Whisperers**

*Built with transparency*

