# n8n LinkedIn Automation - Quick Start Guide

**Goal:** Get your first automated LinkedIn post published in under 2 hours

**Audience:** Technical team member setting up n8n for the first time

---

## Prerequisites

Before starting, ensure you have:
- [ ] LinkedIn account with posting permissions (Kyrian, Ivan, or Jonathan)
- [ ] Admin access to AI-Whisperers company page (for company posts)
- [ ] Email address for n8n account
- [ ] Credit card for n8n Cloud subscription (€20/month, 14-day free trial)

---

## Step 1: Set Up n8n Cloud (15 minutes)

### 1.1 Create n8n Account

1. Go to https://n8n.cloud
2. Click "Start Free Trial"
3. Sign up with email/password or Google
4. Choose "Starter" plan (€20/month, free for 14 days)
5. Verify your email address

### 1.2 Create Your First Workflow

1. In n8n dashboard, click "New Workflow"
2. Name it: "LinkedIn Text Post Automation"
3. Save the workflow

---

## Step 2: Set Up LinkedIn API (30 minutes)

### 2.1 Create LinkedIn Developer App

1. Go to https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Fill in details:
   - **App name:** AI-Whisperers Content Automation
   - **LinkedIn Page:** Select AI-Whisperers company page
   - **App logo:** Upload AI-Whisperers logo (or skip for now)
   - **Privacy policy URL:** Your company website
4. Check agreement boxes, click "Create app"

### 2.2 Configure OAuth Settings

1. In your new app, go to "Auth" tab
2. Under "OAuth 2.0 settings":
   - Add redirect URL: `https://[your-n8n-instance].app.n8n.cloud/rest/oauth2-credential/callback`
   - Replace `[your-n8n-instance]` with your actual n8n URL
3. Under "OAuth 2.0 scopes":
   - Check `r_liteprofile` (Read profile data)
   - Check `w_member_social` (Post to personal profile)
   - Check `r_organization_social` (Read company data)
   - Check `w_organization_social` (Post to company page)
4. Click "Update"

### 2.3 Get API Credentials

1. Go to "Auth" tab
2. Copy **Client ID**
3. Copy **Client Secret**
4. Save both securely (you'll need them in Step 3)

**Important:** Keep Client Secret confidential. Never commit to git or share publicly.

---

## Step 3: Connect n8n to LinkedIn (20 minutes)

### 3.1 Add LinkedIn Credentials in n8n

1. In n8n workflow editor, click "+" to add a node
2. Search for "LinkedIn" and select "LinkedIn" node
3. Click "Create New Credential"
4. Fill in:
   - **Name:** LinkedIn - Kyrian Weiss (or your name)
   - **Client ID:** Paste from Step 2.3
   - **Client Secret:** Paste from Step 2.3
5. Click "Connect my account"
6. Authorize the app on LinkedIn
7. You'll be redirected back to n8n
8. Click "Save"

**Test the connection:**
- The credential should show a green checkmark
- If red X, review OAuth settings and try again

### 3.2 Get Your LinkedIn URN

You need your LinkedIn URN to post content. Here's how to find it:

**Method 1: Via API**
1. In n8n, add HTTP Request node
2. Set to GET `https://api.linkedin.com/v2/me`
3. Use LinkedIn OAuth2 credential
4. Execute node
5. Copy the `id` field (format: `urn:li:person:XXXXXXXXX`)

**Method 2: Via Browser**
1. Go to your LinkedIn profile
2. URL looks like: `linkedin.com/in/your-profile-name`
3. Your URN is more complex, use Method 1 instead

Save your URN, you'll need it for posting.

---

## Step 4: Build Your First Workflow (30 minutes)

### 4.1 Add Nodes

Create this workflow structure:

```
Manual Trigger → Code (Parse Markdown) → HTTP Request (Post to LinkedIn) → Slack Notification
```

**Add each node:**

1. **Manual Trigger**
   - Click "+" → Search "Manual Trigger"
   - Add to canvas
   - This lets you test manually before scheduling

2. **Code Node (Parse Markdown)**
   - Click "+" → Search "Code"
   - Name it "Parse Post Content"
   - Paste this code:

```javascript
// Sample post for testing
const postText = `We cut ticket handle time by 30% with an AI triage agent. Here's how we did it in 2 weeks.

Most support queues fail because everything looks urgent. The triage agent doesn't solve tickets — it sorts them so humans focus on what matters.

We built a simple classifier that routes tickets into 4 lanes: auto-resolve, low-touch, complex, and escalate. Trained on 2,000 historical tickets, deployed in 20 minutes ⚡

Result: 30% faster resolution, happier agents, fewer burnouts.

The key: we didn't try to automate everything. We automated triage, then let humans do what they do best — solve complex problems.

Start with one workflow. Scope it tight. Measure one metric. Repeat.

What's one support workflow you'd automate first?

#Automation #Operations #MultiAgentSystems #AI`;

// Validation
const wordCount = postText.split(/\s+/).length;
const emojiCount = (postText.match(/\p{Emoji}/gu) || []).length;
const hashtagCount = (postText.match(/#\w+/g) || []).length;

return {
  postText,
  wordCount,
  emojiCount,
  hashtagCount,
  valid: wordCount >= 120 && wordCount <= 180 && emojiCount <= 2 && hashtagCount === 4
};
```

3. **HTTP Request (Post to LinkedIn)**
   - Click "+" → Search "HTTP Request"
   - Name it "Post to LinkedIn"
   - Configure:
     - **Method:** POST
     - **URL:** `https://api.linkedin.com/rest/posts`
     - **Authentication:** OAuth2 (select your LinkedIn credential)
     - **Send Headers:** ON
     - Add header: `LinkedIn-Version` = `202306`
     - Add header: `X-Restli-Protocol-Version` = `2.0.0`
     - **Send Body:** ON
     - **Body Content Type:** JSON
     - **Body:**

```json
{
  "author": "urn:li:person:YOUR_URN_HERE",
  "commentary": "={{ $json.postText }}",
  "visibility": "PUBLIC",
  "distribution": {
    "feedDistribution": "MAIN_FEED"
  },
  "lifecycleState": "PUBLISHED"
}
```

**Important:** Replace `YOUR_URN_HERE` with your actual URN from Step 3.2

4. **Slack Notification (Optional)**
   - If you use Slack, add notification for when post is published
   - Otherwise, skip this node

### 4.2 Test the Workflow

1. Click "Execute Workflow" (play button at bottom)
2. Check each node for green checkmarks
3. If errors:
   - Red nodes show error details
   - Common issues:
     - Wrong URN format
     - Missing OAuth scopes
     - Invalid LinkedIn-Version header
4. If successful:
   - Check your LinkedIn profile
   - You should see the test post published!

**Congratulations!** You just automated your first LinkedIn post.

---

## Step 5: Schedule Regular Posts (15 minutes)

### 5.1 Replace Manual Trigger with Schedule

1. Delete the "Manual Trigger" node
2. Add "Schedule Trigger" node
3. Configure:
   - **Mode:** Custom
   - **Cron Expression:** `0 9 * * 1,3,5`
   - This posts at 9:00 AM on Monday, Wednesday, Friday

### 5.2 Connect to Content Source

Currently the post text is hardcoded. To use your markdown files:

**Option A: Manual Upload (Simplest)**
1. Replace the hardcoded `postText` in Code node with your actual post
2. Update workflow before each scheduled post

**Option B: Google Drive Integration**
1. Add "Google Drive" node before Code node
2. Read markdown file from Drive
3. Parse in Code node

**Option C: GitHub Integration**
1. Add "GitHub" node
2. Read from `drafts/posts/*.md`
3. Parse in Code node

For now, use Option A to get started quickly. You can enhance later.

---

## Step 6: Add Quality Validation (10 minutes)

### 6.1 Add IF Node After Code

1. Add "IF" node after "Parse Post Content"
2. Configure condition:
   - **Value 1:** `{{ $json.valid }}`
   - **Operation:** Equal
   - **Value 2:** `true`

3. Connect:
   - **TRUE branch:** Goes to "Post to LinkedIn"
   - **FALSE branch:** Add "Slack" or "Email" node to alert you

This prevents posting if validation fails (wrong word count, too many emojis, etc.)

---

## Step 7: Track Engagement (10 minutes)

### 7.1 Add Google Sheets Node

1. After "Post to LinkedIn" node, add "Google Sheets" node
2. Authenticate with Google account
3. Select your ENGAGEMENT_TRACKER spreadsheet
4. Operation: "Append Row"
5. Map fields:
   - **Date:** `{{ $now.format('YYYY-MM-DD') }}`
   - **Author:** `Kyrian` (or use variable)
   - **Post URL:** `{{ $json.postUrl }}` (from LinkedIn response)
   - **Post Type:** `How-To`
   - **Status:** `Published`

Now every post automatically logs to your tracking sheet!

---

## Next Steps

### Immediate (Today)
- [ ] Test workflow with 1-2 more posts
- [ ] Verify posts display correctly on LinkedIn
- [ ] Check engagement tracking sheet updates

### This Week
- [ ] Schedule 3 posts for next week
- [ ] Update Code node with actual post content
- [ ] Test scheduled triggers (set to near future time to verify)

### Next Week
- [ ] Add Ivan's profile authentication
- [ ] Create author routing (IF node based on author field)
- [ ] Test multi-author posting

### Month 2
- [ ] Add AI quality checker (OpenAI node)
- [ ] Automate engagement metrics fetching
- [ ] Generate weekly performance reports

---

## Troubleshooting

### Error: "Invalid authentication"
**Fix:** Re-authenticate LinkedIn credential in n8n, check OAuth scopes

### Error: "Cannot post to this entity"
**Fix:** Verify URN format, ensure `w_member_social` scope is granted

### Error: "Invalid LinkedIn-Version header"
**Fix:** Use `202306` (or latest from LinkedIn docs)

### Post formatting looks wrong
**Fix:** LinkedIn may strip line breaks. Add double line breaks (`\n\n`) in post text

### Workflow not triggering on schedule
**Fix:**
- Workflow must be "Active" (toggle in top-right)
- Cron expression must be valid (test at crontab.guru)
- Check n8n execution logs for errors

---

## Support Resources

**n8n Documentation:**
- https://docs.n8n.io
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.linkedin/

**LinkedIn API Docs:**
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api

**AI-Whisperers Internal:**
- Full plan: `docs/automation/N8N_LINKEDIN_INTEGRATION_PLAN.md`
- Summary: `N8N_INTEGRATION_SUMMARY.md`

**Questions?**
- Post in Slack #linkedin-automation channel
- Contact Ivan or Jonathan for technical help

---

## Success Checklist

By the end of this guide, you should have:
- [x] n8n Cloud account created
- [x] LinkedIn API app configured
- [x] OAuth authentication working
- [x] First automated post published successfully
- [x] Workflow scheduled for Mon/Wed/Fri
- [x] Quality validation active
- [x] Engagement tracking auto-logging

**Estimated total time:** 2 hours

**Next milestone:** 3 automated posts published (1 week)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-21
**Maintainer:** AI-Whisperers Technical Team

*You're now ready to automate LinkedIn content publishing. Welcome to the future of content marketing!*
