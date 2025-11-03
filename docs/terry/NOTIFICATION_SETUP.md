# Terry Notification Setup Guide

Complete guide for configuring multi-channel notifications: Email, WhatsApp, and LinkedIn.

## Table of Contents

1. [Notification Strategy](#notification-strategy)
2. [Email Configuration](#email-configuration)
3. [WhatsApp Business API](#whatsapp-business-api)
4. [LinkedIn API](#linkedin-api)
5. [Priority Routing](#priority-routing)
6. [Message Templates](#message-templates)
7. [Testing](#testing)

## Notification Strategy

Terry uses intelligent multi-channel routing based on alert priority:

### Channel Selection Matrix

| Priority | Primary | Secondary | Content | Response Time |
|----------|---------|-----------|---------|---------------|
| **Critical** | WhatsApp | Email | Production down, security breach | Immediate |
| **High** | Email | WhatsApp | Service degradation, failed deployment | Within 1 hour |
| **Medium** | Email | None | Dependency updates, warnings | Daily digest |
| **Low** | Log only | LinkedIn | Milestones, statistics | Weekly summary |

### Alert Types by Channel

#### WhatsApp (Urgent Only)
- Production website down (5xx errors)
- Critical container failure
- Security vulnerability detected
- Data loss risk
- Resource exhaustion (disk full, OOM)

#### Email (Primary Channel)
- Failed deployments
- High resource usage warnings
- Failed CI/CD pipelines
- Dependency security updates
- API rate limit warnings
- Daily/weekly summary reports

#### LinkedIn (Professional Updates)
- System milestones (30 days uptime)
- Performance improvements
- New features deployed
- Monthly statistics
- Team achievements

## Email Configuration

### Option 1: Gmail (Development/Personal Use)

#### Step 1: Enable 2-Factor Authentication

1. Go to Google Account Security: https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Complete setup with phone number

#### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter: "Terry AI Agent"
5. Click "Generate"
6. Copy the 16-character password

#### Step 3: Configure .env

```bash
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false  # Use STARTTLS
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=abcd efgh ijkl mnop  # Remove spaces
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=alerts@yourdomain.com
```

#### Step 4: Configure n8n Credential

1. Open n8n UI
2. Go to Credentials → Add Credential
3. Select "SMTP"
4. Fill in:
   - **Name**: Terry Gmail SMTP
   - **Host**: smtp.gmail.com
   - **Port**: 587
   - **Secure**: No (uses STARTTLS)
   - **Username**: your-email@gmail.com
   - **Password**: (your 16-char app password)
5. Test connection
6. Save

### Option 2: SendGrid (Production Recommended)

#### Step 1: Create SendGrid Account

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Verify email address
3. Complete sender verification

#### Step 2: Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: "Terry AI Agent"
4. Permissions: "Restricted Access"
5. Enable: "Mail Send" → Full Access
6. Create & copy key (starts with `SG.`)

#### Step 3: Verify Sender

1. Go to Settings → Sender Authentication
2. Choose "Single Sender Verification" (free)
3. Fill in sender details:
   - From Name: Terry AI Agent
   - From Email: terry@yourdomain.com
4. Verify email address

#### Step 4: Configure .env

```bash
EMAIL_SMTP_HOST=smtp.sendgrid.net
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=apikey  # Literal string "apikey"
EMAIL_SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=terry@yourdomain.com
EMAIL_TO=alerts@yourdomain.com
```

#### Step 5: Configure n8n Credential

1. n8n UI → Credentials → Add Credential → SMTP
2. Fill in:
   - **Name**: Terry SendGrid SMTP
   - **Host**: smtp.sendgrid.net
   - **Port**: 587
   - **Secure**: No
   - **Username**: apikey
   - **Password**: (your SendGrid API key)
3. Test and save

### Option 3: Custom SMTP Server

```bash
EMAIL_SMTP_HOST=mail.yourdomain.com
EMAIL_SMTP_PORT=465  # or 587 for TLS
EMAIL_SMTP_SECURE=true  # true for SSL (465), false for TLS (587)
EMAIL_SMTP_USER=alerts@yourdomain.com
EMAIL_SMTP_PASSWORD=your_password
EMAIL_FROM=terry@yourdomain.com
EMAIL_TO=team@yourdomain.com
```

### Email Message Format

Terry sends HTML emails with this structure:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .critical { color: #dc3545; }
        .warning { color: #ffc107; }
        .info { color: #17a2b8; }
        .details { background: #f8f9fa; padding: 15px; margin: 10px 0; }
        code { background: #e9ecef; padding: 2px 6px; }
    </style>
</head>
<body>
    <h2>🚨 Terry Alert: [Alert Title]</h2>
    <p><strong>Priority:</strong> <span class="critical">Critical</span></p>
    <p><strong>Time:</strong> 2025-11-03 14:30:00 UTC</p>
    <p><strong>Service:</strong> Production Website</p>
    
    <div class="details">
        <h3>Issue Details</h3>
        <p>[Problem description]</p>
        <code>[Error details]</code>
    </div>
    
    <div class="details">
        <h3>Proposed Solution</h3>
        <p>[AI-generated solution]</p>
        <p><strong>Risk Level:</strong> Medium</p>
    </div>
    
    <p>
        <a href="[approval_link]">Approve Fix</a> | 
        <a href="[dashboard_link]">View Dashboard</a>
    </p>
    
    <hr>
    <small>Sent by Terry AI Agent | AI-Whisperers</small>
</body>
</html>
```

## WhatsApp Business API

### Prerequisites

- Facebook Business Account
- Meta Developer Account
- Verified business
- Phone number for WhatsApp Business

### Step 1: Create Facebook Business Account

1. Go to https://business.facebook.com
2. Create Business Account
3. Verify business details
4. Add team members if needed

### Step 2: Create Meta Developer App

1. Go to https://developers.facebook.com/apps
2. Click "Create App"
3. Select "Business" type
4. Fill in app details:
   - App Name: "Terry AI Agent"
   - Contact Email: your-email@domain.com
   - Business Account: Select your business
5. Create App

### Step 3: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Select or create WhatsApp Business Account
4. Add phone number (or use test number provided)

### Step 4: Get API Credentials

1. In WhatsApp → Getting Started:
   - Copy **Phone Number ID**
   - Copy **WhatsApp Business Account ID**
2. Generate **Temporary Access Token** (valid 24 hours)
3. For production, generate **Permanent Access Token**:
   - Go to Business Settings
   - System Users → Create system user
   - Assign WhatsApp permissions
   - Generate token

### Step 5: Configure Webhook (for 2-way communication)

1. Create webhook endpoint in n8n:
   ```
   https://your-n8n-domain.com/webhook/whatsapp
   ```

2. In WhatsApp → Configuration:
   - Callback URL: (your webhook URL)
   - Verify Token: (create a random string)
   - Subscribe to: messages, message_status

3. Verify webhook

### Step 6: Configure .env

```bash
# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_RECIPIENT=+595xxxxxxxxx  # Your phone number with country code
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_verification_token
```

### Step 7: Configure n8n Credential

1. n8n UI → Credentials → Add Credential
2. Select "HTTP Request" (generic)
3. Configure:
   - **Name**: WhatsApp Business API
   - **Authentication**: Generic Credential Type
   - **Header Auth**:
     - Name: `Authorization`
     - Value: `Bearer EAAxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 8: Send Test Message

Use n8n HTTP Request node:

```json
{
  "method": "POST",
  "url": "https://graph.facebook.com/v18.0/{{PHONE_NUMBER_ID}}/messages",
  "headers": {
    "Authorization": "Bearer {{ACCESS_TOKEN}}",
    "Content-Type": "application/json"
  },
  "body": {
    "messaging_product": "whatsapp",
    "to": "+595xxxxxxxxx",
    "type": "text",
    "text": {
      "body": "🤖 Terry AI Agent is now monitoring your infrastructure!"
    }
  }
}
```

### WhatsApp Message Templates

#### Critical Alert
```
🚨 *CRITICAL ALERT*

Service: {{service_name}}
Issue: {{issue_description}}
Time: {{timestamp}}

Status: {{current_status}}

Action Required: {{recommended_action}}

Reply APPROVE to authorize fix
Reply STATUS for more details

- Terry AI Agent
```

#### Approval Request
```
⚠️ *APPROVAL REQUIRED*

Terry detected an issue and proposed a fix:

Problem: {{problem}}
Solution: {{solution}}
Risk: {{risk_level}}

Commands to fix:
```
{{commands}}
```

Reply:
• YES - Approve and execute
• NO - Cancel and escalate
• INFO - Get more details

Timeout: 30 minutes

- Terry AI Agent
```

#### Status Update
```
✅ *ISSUE RESOLVED*

Problem: {{problem}}
Solution: {{solution_applied}}
Duration: {{time_taken}}

System Status: Healthy
Next Check: {{next_check_time}}

- Terry AI Agent
```

## LinkedIn API

### Step 1: Create LinkedIn Application

1. Go to https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Fill in details:
   - App name: "Terry AI Agent"
   - LinkedIn Page: (your company page)
   - App logo: (upload logo)
   - Privacy policy URL: (your URL)
4. Create app

### Step 2: Request API Access

1. In app settings, go to "Products"
2. Request access to:
   - "Sign In with LinkedIn using OpenID Connect"
   - "Share on LinkedIn"
   - "Messaging"
3. Wait for approval (usually instant for basic access)

### Step 3: Configure OAuth 2.0

1. In app settings → Auth:
   - Add Redirect URL: `http://localhost:5678/rest/oauth2-credential/callback`
   - Copy Client ID
   - Copy Client Secret

### Step 4: Get Access Token

#### Method 1: Using n8n OAuth2

1. n8n UI → Credentials → Add Credential
2. Select "LinkedIn OAuth2 API"
3. Fill in:
   - **Client ID**: (from app)
   - **Client Secret**: (from app)
   - **Scope**: `w_member_social,r_liteprofile,r_emailaddress`
4. Click "Connect my account"
5. Authorize in LinkedIn
6. Save credential

#### Method 2: Manual OAuth Flow

```bash
# 1. Get authorization code
https://www.linkedin.com/oauth/v2/authorization?
  response_type=code&
  client_id={{CLIENT_ID}}&
  redirect_uri=http://localhost:5678/rest/oauth2-credential/callback&
  scope=w_member_social

# 2. Exchange code for token
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -d "grant_type=authorization_code" \
  -d "code={{AUTH_CODE}}" \
  -d "client_id={{CLIENT_ID}}" \
  -d "client_secret={{CLIENT_SECRET}}" \
  -d "redirect_uri=http://localhost:5678/rest/oauth2-credential/callback"

# Response contains access_token
```

### Step 5: Configure .env

```bash
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_PERSON_URN=urn:li:person:your_person_id
```

### Step 6: Post to LinkedIn

Use n8n HTTP Request node:

```json
{
  "method": "POST",
  "url": "https://api.linkedin.com/v2/ugcPosts",
  "headers": {
    "Authorization": "Bearer {{ACCESS_TOKEN}}",
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0"
  },
  "body": {
    "author": "urn:li:person:{{PERSON_ID}}",
    "lifecycleState": "PUBLISHED",
    "specificContent": {
      "com.linkedin.ugc.ShareContent": {
        "shareCommentary": {
          "text": "🎉 Milestone: Terry AI Agent completed 30 days of 99.9% uptime!"
        },
        "shareMediaCategory": "NONE"
      }
    },
    "visibility": {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
  }
}
```

### LinkedIn Message Templates

#### Milestone Achievement
```
🎉 Infrastructure Milestone

Terry AI Agent just achieved:
• 30 days of 99.9% uptime
• 47 issues automatically resolved
• 12 hours of developer time saved
• 0 production incidents

Building transparent automation that works.

#AI #Automation #DevOps #BuildingInPublic
```

#### Monthly Report
```
📊 October Infrastructure Report

Terry AI Agent (our AI IT employee) stats:
• Uptime: 99.8%
• Issues detected: 52
• Auto-fixed: 43 (83%)
• Mean Time To Resolution: 8 minutes
• False positives: 2 (3.8%)

We're eating our own dog food and loving it.

Read more: [link to blog post]

#MultiAgentSystems #AIAutomation #DevOps
```

## Priority Routing

### Routing Logic in n8n

Create a routing workflow that determines which channel(s) to use:

```javascript
// Priority Routing Function Node
const priority = $input.item.json.priority;
const issue_type = $input.item.json.issue_type;

let channels = [];

// Critical: WhatsApp + Email
if (priority === 'critical') {
  channels = ['whatsapp', 'email'];
}
// High: Email (primary) + WhatsApp (if no response in 15 min)
else if (priority === 'high') {
  channels = ['email'];
  // Set up delayed WhatsApp if needed
}
// Medium: Email only
else if (priority === 'medium') {
  channels = ['email'];
}
// Low: Log only, LinkedIn weekly
else if (priority === 'low') {
  channels = ['log'];
}

// Special cases
if (issue_type === 'security') {
  channels = ['whatsapp', 'email'];  // Always both
}

if (issue_type === 'milestone') {
  channels = ['linkedin', 'email'];
}

return {
  channels: channels,
  message: $input.item.json.message,
  priority: priority
};
```

### Time-Based Routing

```javascript
// Check if business hours (9 AM - 6 PM Paraguay time)
const now = new Date();
const hour = now.getHours();
const isBusinessHours = hour >= 9 && hour < 18;

// During business hours: Email preferred
// Outside business hours: WhatsApp for critical only
if (priority === 'critical' && !isBusinessHours) {
  channels = ['whatsapp'];
} else if (priority === 'critical' && isBusinessHours) {
  channels = ['email', 'whatsapp'];
}
```

## Message Templates

### Template Variables

Standard variables available in all messages:

```javascript
{
  timestamp: "2025-11-03T14:30:00Z",
  priority: "critical|high|medium|low",
  service: "GitHub|Website|Docker|API",
  issue_type: "downtime|performance|security|deployment",
  issue_description: "Brief description",
  error_details: "Detailed error message",
  affected_users: 0,
  root_cause: "AI-analyzed root cause",
  proposed_solution: "Step-by-step fix",
  risk_level: "low|medium|high",
  estimated_impact: "Duration or severity",
  dashboard_url: "Link to monitoring dashboard",
  approval_url: "Link to approve action"
}
```

### Template Library

Store templates in n8n workflows or external JSON:

```json
{
  "critical_downtime": {
    "email_subject": "🚨 CRITICAL: {{service}} is DOWN",
    "email_body": "...",
    "whatsapp_message": "...",
    "linkedin_post": null
  },
  "deployment_success": {
    "email_subject": "✅ Deployment successful: {{service}}",
    "email_body": "...",
    "whatsapp_message": null,
    "linkedin_post": "..."
  }
}
```

## Testing

### Email Test

```bash
# Create test workflow in n8n
1. Manual trigger
2. Set data: { "test": "email" }
3. Send Email node
4. Execute and check inbox
```

### WhatsApp Test

```bash
# Test message via API
curl -X POST "https://graph.facebook.com/v18.0/{{PHONE_NUMBER_ID}}/messages" \
  -H "Authorization: Bearer {{ACCESS_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "{{YOUR_PHONE}}",
    "type": "text",
    "text": {
      "body": "Test message from Terry"
    }
  }'
```

### LinkedIn Test

```bash
# Test post via API
curl -X POST "https://api.linkedin.com/v2/ugcPosts" \
  -H "Authorization: Bearer {{ACCESS_TOKEN}}" \
  -H "Content-Type: application/json" \
  -H "X-Restli-Protocol-Version: 2.0.0" \
  -d '{
    "author": "urn:li:person:{{PERSON_ID}}",
    "lifecycleState": "PUBLISHED",
    "specificContent": {
      "com.linkedin.ugc.ShareContent": {
        "shareCommentary": {
          "text": "Test post from Terry AI Agent"
        },
        "shareMediaCategory": "NONE"
      }
    },
    "visibility": {
      "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS"
    }
  }'
```

### Integration Test Workflow

Create a comprehensive test workflow:

1. Trigger: Manual or scheduled
2. Generate test alerts (all priorities)
3. Send via all channels
4. Verify delivery
5. Log results
6. Alert if any channel fails

## Troubleshooting

### Email Issues

**Problem**: Emails not sending
```bash
# Check SMTP credentials in n8n
# Test with simple SMTP client
npm install -g nodemailer
node -e "
  const nodemailer = require('nodemailer');
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: { user: 'your-email', pass: 'your-password' }
  });
  transport.sendMail({
    from: 'your-email',
    to: 'test@example.com',
    subject: 'Test',
    text: 'Test'
  }, console.log);
"
```

**Problem**: Gmail blocking
- Enable "Less secure app access" (not recommended)
- Use App Password (recommended)
- Check Gmail sending limits (500/day)

### WhatsApp Issues

**Problem**: 401 Unauthorized
- Check access token validity (24h for temporary)
- Regenerate permanent token
- Verify phone number ID

**Problem**: Messages not delivered
- Check phone number format (+country code)
- Verify recipient has WhatsApp
- Check WhatsApp Business account status
- Review Meta Business Suite for blocks

### LinkedIn Issues

**Problem**: OAuth token expired
- Tokens expire after 60 days
- Implement token refresh flow
- Store refresh token securely

**Problem**: Rate limits
- LinkedIn: 100 API calls per day (free tier)
- Use caching and batching
- Upgrade to paid tier if needed

## Next Steps

1. ✅ Test all three channels
2. ✅ Create message templates
3. ✅ Implement routing logic
4. ✅ Set up approval workflows
5. ✅ Configure monitoring for notification system itself

See [WORKFLOW_GUIDES.md](./WORKFLOW_GUIDES.md) for implementing notification workflows.

## Support

For notification issues:
- Email: Check SMTP logs in n8n
- WhatsApp: Review Meta Developer console
- LinkedIn: Check LinkedIn Developer portal
- All: See [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)

