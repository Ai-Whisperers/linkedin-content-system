# LinkedIn Content Generator Workflow

**AI-powered LinkedIn post generation for AI-Whisperers**

Last updated: 2025-11-10

---

## Overview

Automated workflow that generates high-quality LinkedIn posts from your context files using Claude AI, with built-in quality validation and routing.

**File:** `content-generator-linkedin.json`

**Schedule:** Every 2 weeks (bi-weekly)

**Output:** 95 posts from 19 context files (~20-30 approved per batch)

**ROI:** Saves 20+ hours/week of manual content creation

---

## Quick Start

### 1. Import Workflow to n8n

**Via n8n UI:**
1. Open n8n at `http://localhost:5678`
2. Click "Workflows" → "Add workflow"
3. Click "..." menu → "Import from File"
4. Select `content-generator-linkedin.json`
5. Click "Open"

**Via API:**
```bash
curl -X POST "http://localhost:5678/api/v1/workflows" \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d @content-generator-linkedin.json
```

### 2. Configure Credentials

#### Required Credentials

**Claude AI (`claude_cred`):**
- Type: HTTP Header Auth
- Header: `x-api-key`
- Value: Your Anthropic API key
- Get key from: https://console.anthropic.com/

**SMTP Email (`smtp_cred`):**
- Type: SMTP
- Host: Your email provider (e.g., smtp.gmail.com)
- User: terry@ai-whisperers.com (or your email)
- Password: App password
- Used for: Summary email notifications

### 3. Test Manually

Before activating:
1. Open workflow in n8n
2. Click "Execute Workflow" (top right)
3. Check output of each node
4. Verify posts are generated and saved correctly
5. Check that summary email is sent
6. Fix any credential issues

### 4. Activate

1. Toggle "Active" switch (top right)
2. Workflow will run on schedule
3. Monitor in "Executions" tab

---

## How It Works

### Workflow Steps

1. **Load Manifest** - Reads `context/manifest.json` to get list of context files
2. **Read Context Files** - Loads all markdown files from `/context/` directory
3. **Merge Contexts** - Combines context files for batch processing
4. **Generate Posts** - Calls Claude API to create 5 post variations per context:
   - How-To
   - Case Study
   - Opinion
   - Framework
   - Metric-Driven
5. **Parse & Validate** - Checks quality criteria:
   - Word count: 120-180 words
   - Hashtags: Exactly 4
   - Emojis: Max 2
   - Forbidden words: None
6. **Route by Status** - Directs posts to folders:
   - ✅ Approved
   - ⚠️ Needs Revision
   - ❌ Rejected
7. **Save to Files** - Writes posts to organized folder structure
8. **Send Summary Email** - Comprehensive report with statistics

### Output Structure

```
generated-posts/
└── batch-YYYYMMDD/
    ├── approved/
    │   └── service-showcase-v2.0.0-20251110-0.md
    └── needs-revision/
        └── tool-tutorial-v2.0.0-20251110-1.md
```

### Quality Validation Rules

Posts are automatically validated against these criteria:

**Approval Requirements:**
- Word count: 120-180 words
- Hashtags: Exactly 4
- Emojis: 0-2 maximum
- No forbidden buzzwords
- No excessive jargon

**Status Routing:**
- ✅ **Approved** - Meets all criteria, ready to publish
- ⚠️ **Needs Revision** - Minor issues, may be salvageable
- ❌ **Rejected** - Major issues, needs rewrite

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
          "field": "weeks",
          "weeksInterval": 2  // Change frequency here
        }
      ]
    }
  }
}
```

### Adjust Quality Thresholds

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

// Emoji limit
if (post.emoji_count > 2) {
  issues.push('Too many emojis');
}
```

### Change Email Recipient

Update "Send Email" node:
```json
{
  "fromEmail": "terry@ai-whisperers.com",
  "toEmail": "your-email@domain.com",  // Change here
  "subject": "LinkedIn Content Generated - Batch YYYYMMDD"
}
```

### Add/Remove Post Types

In the Claude API call, modify the prompt to request different post variations:

```
Generate 5 variations:
1. How-To (step-by-step guide)
2. Case Study (real example)
3. Opinion (thought leadership)
4. Framework (structured approach)
5. Metric-Driven (data-backed insight)
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

---

## Monitoring & Troubleshooting

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
- Re-check Anthropic API key
- Verify key hasn't expired
- Check SMTP credentials are correct

**Timeout errors:**
- Increase timeout in Claude API HTTP node (default: 60s)
- Large batches may need 120-180s timeout
- Check network connectivity

**Email not sending:**
- Test SMTP credentials manually
- Check spam folder
- Verify from/to addresses are correct

**Low approval rate (<10%):**
- Review forbidden words list
- Adjust quality thresholds
- Check context files for clarity
- Update brand guidelines

---

## Performance Metrics

### Expected Results

- **Execution time:** 3-5 minutes for 19 context files
- **Posts generated:** 95 (5 per context file)
- **Approval rate:** 20-30% (~20-30 posts)
- **Needs revision:** 40-50% (~40-45 posts)
- **Rejected:** 20-30% (~20-25 posts)
- **Cost per run:** ~$1.50-2.00 (Claude API)
- **Monthly cost:** ~$3-4 (bi-weekly schedule)

### Time Savings

**Manual Process:**
- Research: 2 hours
- Writing: 15 hours
- Editing: 3 hours
- Total: 20 hours/week

**Automated Process:**
- Review approved: 30 min
- Edit revisions: 2 hours
- Total: 2.5 hours/week

**Savings:** 17.5 hours/week = 87.5% time reduction

---

## Architecture Decisions

### Why Quality Validation?

**Without validation:**
- 30-40% posts contain buzzwords
- 20% wrong word count
- Manual review takes 30+ min
- Hard to prioritize which posts to review

**With validation:**
- Auto-routes by quality
- Focus review time on approved posts
- 20-30% approval rate is expected and healthy
- Clear action items for revision posts

### Why Batch Processing?

**Advantages:**
- Single API call for all contexts (faster)
- Consistent tone across posts
- Better cost efficiency
- Organized output structure
- Easy to track batches over time

**Trade-offs:**
- All-or-nothing execution (if one fails, need to retry all)
- Larger timeout needed
- More memory usage

---

## Future Enhancements

### Planned Features

- [ ] Auto-publish approved posts to LinkedIn API
- [ ] A/B test different post variations
- [ ] Performance tracking integration (engagement metrics)
- [ ] Image generation for posts (AI-generated visuals)
- [ ] Personalized post variations based on audience segments
- [ ] Multi-language support
- [ ] Integration with content calendar

---

## Related Files

- **Workflow Definition**: `content-generator-linkedin.json`
- **Content Manifest**: `context/manifest.json`
- **Brand Guidelines**: `context/brand/rules.md`
- **Quality Checklist**: `brand-docs/QUALITY_CHECKLIST.md`
- **MCP Server**: `../mcp-server-n8n/` (programmatic control)

---

## Getting Help

**Documentation:**
- Setup Guide: [`../SETUP_GUIDE.md`](../SETUP_GUIDE.md) (if exists)
- Troubleshooting: [`../TROUBLESHOOTING_GUIDE.md`](../TROUBLESHOOTING_GUIDE.md) (if exists)

**Support:**
- GitHub Issues: https://github.com/Ai-Whisperers/contentCreator/issues
- Email: support@ai-whisperers.com

---

**LinkedIn Content Generator by AI-Whisperers**

*Automate thoughtfully. Create consistently. Scale smart.*
