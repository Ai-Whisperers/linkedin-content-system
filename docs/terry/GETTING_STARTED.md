# Getting Started with Terry

Quick guide to get Terry up and running in 30 minutes.

## Overview

Terry is your AI IT employee that monitors infrastructure 24/7. This guide will get you from zero to monitoring in 30 minutes.

## Prerequisites (5 minutes)

Install these first:

```bash
# Check if installed
docker --version          # Need 20.10+
docker-compose --version  # Need 2.0+
git --version            # Need 2.30+
```

If missing, install from:
- Docker: https://docs.docker.com/get-docker/
- Git: https://git-scm.com/downloads

## Step 1: Setup (10 minutes)

### 1.1 Create Environment File

```bash
cd docs/terry
cp env.template .env
nano .env  # or code .env for VS Code
```

### 1.2 Required Configuration

Fill in these **required** fields in `.env`:

```bash
# GitHub (get token at https://github.com/settings/tokens)
GITHUB_TOKEN=ghp_your_actual_token_here
GITHUB_ORG=Ai-Whisperers

# OpenAI (get key at https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your_actual_key_here

# Email (use Gmail app password)
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-16-char-app-password
EMAIL_TO=alerts@ai-whisperers.com

# Change password!
N8N_BASIC_AUTH_PASSWORD=choose-secure-password-here
```

### 1.3 Start Terry

```bash
# Create docker-compose.yml (see SETUP_GUIDE.md)
# Or use provided template

docker-compose up -d

# Check it's running
docker ps | grep terry
```

## Step 2: Configure (10 minutes)

### 2.1 Access n8n

Open browser to: http://localhost:5678

Login:
- Username: `aiwhisperers`
- Password: (from your .env file)

### 2.2 Add Credentials

1. Click Settings → Credentials
2. Add these credentials:

**GitHub API:**
- Click "Add Credential"
- Select "GitHub API"
- Name: "AI-Whisperers GitHub"
- Access Token: (your GITHUB_TOKEN)
- Save

**SMTP Email:**
- Click "Add Credential"
- Select "SMTP"
- Name: "Terry Email"
- Host: smtp.gmail.com
- Port: 587
- Secure: No
- Username: (your email)
- Password: (your app password)
- Save

### 2.3 Import Workflows

1. Click "Workflows"
2. Click "Import from File"
3. Select `workflows/01-github-health-check.json`
4. Click "Import"
5. Repeat for `02-website-uptime.json`

## Step 3: Test (10 minutes)

### 3.1 Test GitHub Workflow

1. Open "GitHub Repository Health Check"
2. Click "Execute Workflow" (top right)
3. Watch nodes execute
4. Check for green checkmarks
5. Verify email received

### 3.2 Test Website Workflow

1. Open "Website Uptime Monitor"
2. Click "Execute Workflow"
3. Verify status code 200
4. Check response time logged

### 3.3 Activate Workflows

1. Toggle "Active" switch (top right) to ON for each workflow
2. Check "Executions" tab after 15 minutes
3. Verify automatic executions

## Step 4: Monitor

### Check Terry Status

```bash
# View logs
docker-compose logs -f n8n

# Check health
curl http://localhost:5678/healthz
# Should return: {"status":"ok"}

# Check executions in browser
# http://localhost:5678 → Executions
```

## Next Steps

### Add More Monitoring

- Docker containers: See [WORKFLOW_GUIDES.md](./WORKFLOW_GUIDES.md#workflow-3-docker-container-health)
- More repositories: Edit GitHub workflow
- Custom checks: Create new workflows

### Enable WhatsApp Alerts

See [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md#whatsapp-business-api)

### Set Up Auto-Remediation

See [WORKFLOW_GUIDES.md](./WORKFLOW_GUIDES.md#phase-3-auto-remediation-week-3)

## Troubleshooting

### Can't Access n8n UI

```bash
# Check if running
docker ps | grep terry

# If not, start it
docker-compose up -d

# Check logs
docker-compose logs n8n
```

### Workflows Not Executing

1. Check "Active" toggle is ON
2. Verify credentials are configured
3. Check n8n logs for errors

### Email Not Sending

1. Verify Gmail app password (not regular password)
2. Check spam folder
3. Test SMTP connection:
```bash
telnet smtp.gmail.com 587
```

## Getting Help

- Full documentation: [README.md](./README.md)
- Setup details: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Troubleshooting: [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)
- User guide: [USER_MANUAL.md](./USER_MANUAL.md)

## Documentation Map

```
terry/
├── README.md ........................ Project overview
├── GETTING_STARTED.md ............... This file (quick start)
├── SETUP_GUIDE.md ................... Detailed installation
├── WORKFLOW_GUIDES.md ............... All 14 workflows
├── NOTIFICATION_SETUP.md ............ Email/WhatsApp/LinkedIn
├── ARCHITECTURE.md .................. System design
├── USER_MANUAL.md ................... Daily operations
├── TROUBLESHOOTING_GUIDE.md ......... Common issues
├── API_REFERENCE.md ................. Technical reference
├── workflows/ ....................... Importable n8n workflows
└── scripts/ ......................... Auto-fix bash scripts
```

---

**You're all set! Terry is now monitoring your infrastructure.**

Questions? Check the documentation or contact DevOps team.

*Built by AI-Whisperers with transparency*

