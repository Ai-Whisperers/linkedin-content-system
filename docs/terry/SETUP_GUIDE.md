# Terry Setup Guide

Complete installation and configuration guide for self-hosted Terry AI IT Agent.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [API Keys Setup](#api-keys-setup)
5. [Network Configuration](#network-configuration)
6. [Initial Configuration](#initial-configuration)
7. [Verification](#verification)
8. [Backup & Restore](#backup--restore)

## Prerequisites

### Required Software

```bash
# Check if you have these installed
docker --version          # Docker 20.10+ required
docker-compose --version  # Docker Compose 2.0+ required
git --version            # Git 2.30+ required
node --version           # Node.js 18+ recommended (optional)
```

### Required Accounts & API Keys

- [ ] GitHub Personal Access Token (with repo, workflow, admin:org permissions)
- [ ] OpenAI API Key (with GPT-4 access)
- [ ] Email SMTP credentials (Gmail, SendGrid, or custom)
- [ ] WhatsApp Business API account (optional but recommended)
- [ ] LinkedIn API credentials (optional)

### Access Requirements

- [ ] Admin access to AI-Whisperers GitHub organization
- [ ] Access to production website deployment (Vercel)
- [ ] SSH access to servers/containers to monitor (if applicable)
- [ ] Email account for receiving alerts

## System Requirements

### Minimum Hardware
- CPU: 2 cores
- RAM: 4GB
- Disk: 20GB free space
- Network: Stable internet connection

### Recommended Hardware
- CPU: 4+ cores
- RAM: 8GB+
- Disk: 50GB+ SSD
- Network: Low latency, high availability

### Supported Operating Systems
- Ubuntu 20.04+ (recommended)
- Windows 10/11 with WSL2
- macOS 12+
- Any Linux with Docker support

## Installation Steps

### Step 1: Install Docker

#### Windows (WSL2)
```powershell
# Enable WSL2
wsl --install

# Install Docker Desktop for Windows
# Download from: https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
docker-compose --version
```

#### Linux (Ubuntu)
```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify
docker --version
docker compose version
```

#### macOS
```bash
# Install Docker Desktop for Mac
# Download from: https://www.docker.com/products/docker-desktop

# Or use Homebrew
brew install --cask docker

# Verify
docker --version
docker-compose --version
```

### Step 2: Clone Terry Repository

```bash
# Navigate to your projects directory
cd ~/projects  # or C:\Users\YourName\Documents

# Clone the contentCreator repository
git clone https://github.com/Ai-Whisperers/contentCreator.git
cd contentCreator/docs/terry
```

### Step 3: Create Environment File

Create `.env` file with your configuration:

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your preferred editor
nano .env  # or code .env for VS Code
```

#### Environment Variables Template

```bash
# ============================================
# TERRY AI IT AGENT - ENVIRONMENT CONFIGURATION
# ============================================

# n8n Configuration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=aiwhisperers
N8N_BASIC_AUTH_PASSWORD=CHANGE_THIS_SECURE_PASSWORD

# Database (SQLite for simple setup, PostgreSQL for production)
DB_TYPE=sqlite
# DB_TYPE=postgresdb
# DB_POSTGRESDB_HOST=postgres
# DB_POSTGRESDB_PORT=5432
# DB_POSTGRESDB_DATABASE=n8n
# DB_POSTGRESDB_USER=n8n
# DB_POSTGRESDB_PASSWORD=n8n_password

# Execution Mode
EXECUTIONS_MODE=regular
EXECUTIONS_TIMEOUT=300
EXECUTIONS_TIMEOUT_MAX=3600

# Timezone
GENERIC_TIMEZONE=America/Asuncion

# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# GitHub API
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_ORG=Ai-Whisperers

# Email Configuration (Gmail Example)
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-app-specific-password
EMAIL_FROM=terry@ai-whisperers.com
EMAIL_TO=alerts@ai-whisperers.com

# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_RECIPIENT=+595xxxxxxxxx

# LinkedIn API
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_PERSON_URN=urn:li:person:your_person_id

# Vercel API
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx

# Monitoring Configuration
MONITOR_GITHUB_INTERVAL=21600  # 6 hours in seconds
MONITOR_WEBSITE_INTERVAL=900   # 15 minutes
MONITOR_DOCKER_INTERVAL=1800   # 30 minutes

# Alert Thresholds
ALERT_WEBSITE_RESPONSE_TIME=3000  # 3 seconds
ALERT_CONTAINER_CPU_PERCENT=80
ALERT_CONTAINER_MEMORY_PERCENT=80

# Security
WEBHOOK_SECRET=CHANGE_THIS_WEBHOOK_SECRET
ENCRYPTION_KEY=CHANGE_THIS_ENCRYPTION_KEY

# Optional: Tunnel for webhooks (ngrok, localtunnel, etc.)
# WEBHOOK_URL=https://your-domain.com
# N8N_WEBHOOK_TUNNEL_URL=https://your-tunnel-url.ngrok.io
```

### Step 4: Create Docker Compose File

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: terry-n8n
    restart: unless-stopped
    ports:
      - "${N8N_PORT}:5678"
    environment:
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=${N8N_PROTOCOL}
      - N8N_BASIC_AUTH_ACTIVE=${N8N_BASIC_AUTH_ACTIVE}
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      - DB_TYPE=${DB_TYPE}
      - EXECUTIONS_MODE=${EXECUTIONS_MODE}
      - EXECUTIONS_TIMEOUT=${EXECUTIONS_TIMEOUT}
      - EXECUTIONS_TIMEOUT_MAX=${EXECUTIONS_TIMEOUT_MAX}
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - WEBHOOK_URL=${WEBHOOK_URL:-}
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/workflows
      - ./scripts:/scripts
    networks:
      - terry-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Optional: PostgreSQL for production
  # postgres:
  #   image: postgres:15-alpine
  #   container_name: terry-postgres
  #   restart: unless-stopped
  #   environment:
  #     POSTGRES_DB: ${DB_POSTGRESDB_DATABASE}
  #     POSTGRES_USER: ${DB_POSTGRESDB_USER}
  #     POSTGRES_PASSWORD: ${DB_POSTGRESDB_PASSWORD}
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   networks:
  #     - terry-network

volumes:
  n8n_data:
    driver: local
  # postgres_data:
  #   driver: local

networks:
  terry-network:
    driver: bridge
```

### Step 5: Start Terry

```bash
# Start Terry in detached mode
docker-compose up -d

# Check logs
docker-compose logs -f n8n

# Wait for startup (about 30-60 seconds)
# You should see: "Editor is now accessible via: http://localhost:5678"
```

### Step 6: Access n8n Interface

```bash
# Open in browser
# Windows/Linux
open http://localhost:5678

# Or navigate manually to:
http://localhost:5678
```

Login with credentials from `.env`:
- Username: `aiwhisperers` (or your N8N_BASIC_AUTH_USER)
- Password: Your N8N_BASIC_AUTH_PASSWORD

## API Keys Setup

### GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Set name: "Terry AI IT Agent"
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `admin:org` (Full control of orgs and teams)
   - `read:user` (Read user profile data)
5. Generate and copy token
6. Add to `.env`: `GITHUB_TOKEN=ghp_xxxxxxxxxxxx`

### OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name: "Terry AI IT Agent"
4. Copy the key (starts with `sk-proj-`)
5. Add to `.env`: `OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx`
6. Ensure you have GPT-4 access (check billing)

### Email SMTP (Gmail Example)

#### Option A: Gmail with App Password (Recommended)

1. Enable 2-factor authentication on Gmail
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate app password for "Mail"
4. Add to `.env`:
```bash
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-16-char-app-password
```

#### Option B: SendGrid (Production Recommended)

1. Sign up at https://sendgrid.com
2. Create API key with "Mail Send" permission
3. Verify sender email
4. Add to `.env`:
```bash
EMAIL_SMTP_HOST=smtp.sendgrid.net
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=apikey
EMAIL_SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### WhatsApp Business API

#### Prerequisites
- Facebook Business Account
- WhatsApp Business Platform account
- Verified phone number

#### Setup Steps

1. Go to https://developers.facebook.com/apps
2. Create new app → Business type
3. Add WhatsApp product
4. Set up webhook (use ngrok for development)
5. Get credentials:
   - Phone Number ID
   - Access Token
   - Webhook verify token

6. Add to `.env`:
```bash
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_RECIPIENT=+595xxxxxxxxx
```

See [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md) for detailed WhatsApp configuration.

### LinkedIn API

#### Setup Steps

1. Create LinkedIn App at https://www.linkedin.com/developers/apps
2. Request "Sign In with LinkedIn" product
3. Add redirect URL: `http://localhost:5678/rest/oauth2-credential/callback`
4. Get Client ID and Client Secret
5. Generate access token using OAuth 2.0

See [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md) for detailed LinkedIn configuration.

### Vercel API

1. Go to Vercel Dashboard → Settings → Tokens
2. Create new token: "Terry Monitoring"
3. Get Team ID and Project ID from project settings
4. Add to `.env`:
```bash
VERCEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx
```

## Network Configuration

### Ports

Terry uses these ports:

| Port | Service | Purpose |
|------|---------|---------|
| 5678 | n8n | Workflow interface and webhooks |
| 5432 | PostgreSQL | Database (if using) |

### Firewall Rules

```bash
# Allow n8n port (if remote access needed)
sudo ufw allow 5678/tcp

# Or use SSH tunnel for secure access
ssh -L 5678:localhost:5678 user@terry-server
```

### Webhook Configuration

For receiving webhooks from GitHub, Vercel, etc., you need a public URL.

#### Development: Use ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 5678

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Add to n8n Settings → Environment → WEBHOOK_URL
```

#### Production: Use reverse proxy

```nginx
# Nginx configuration
server {
    listen 80;
    server_name terry.ai-whisperers.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Initial Configuration

### Step 1: Import Workflows

1. Access n8n at http://localhost:5678
2. Click "Workflows" → "Import from File"
3. Import workflows from `./workflows/` directory in order:
   - `01-github-health-check.json`
   - `02-website-uptime.json`
   - `03-docker-health.json`
   - (Continue with all workflows)

### Step 2: Configure Credentials

1. Go to n8n Settings → Credentials
2. Add credentials for each service:

#### GitHub Credentials
- Type: GitHub API
- Name: AI-Whisperers GitHub
- Access Token: (your GITHUB_TOKEN)

#### OpenAI Credentials
- Type: OpenAI API
- Name: GPT-4 for Terry
- API Key: (your OPENAI_API_KEY)
- Organization: (optional)

#### Email Credentials
- Type: SMTP
- Name: Terry Alerts Email
- Host: (your EMAIL_SMTP_HOST)
- Port: (your EMAIL_SMTP_PORT)
- User: (your EMAIL_SMTP_USER)
- Password: (your EMAIL_SMTP_PASSWORD)

### Step 3: Configure Workflow Variables

For each imported workflow:

1. Open workflow
2. Click on "Workflow Settings"
3. Set variables:
   - GitHub organization: `Ai-Whisperers`
   - Alert email: Your email address
   - WhatsApp number: Your phone number
   - Check intervals: As defined in `.env`

### Step 4: Activate Workflows

1. Open each workflow
2. Toggle "Active" switch in top right
3. Verify "Last execution" shows successful runs

## Verification

### Test Checklist

```bash
# 1. Check Docker containers
docker-compose ps

# Expected output:
# NAME          STATUS        PORTS
# terry-n8n     Up X minutes  0.0.0.0:5678->5678/tcp

# 2. Check n8n logs
docker-compose logs -f n8n | grep ERROR
# Should see no errors

# 3. Test n8n API
curl http://localhost:5678/healthz
# Expected: {"status":"ok"}

# 4. Test GitHub API
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/orgs/Ai-Whisperers/repos
# Should return list of repositories

# 5. Test OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY"
# Should return list of models including gpt-4
```

### Manual Workflow Tests

1. **Test GitHub Monitoring**:
   - Open "GitHub Health Check" workflow
   - Click "Execute Workflow"
   - Check execution log for repository status

2. **Test Website Monitoring**:
   - Open "Website Uptime" workflow
   - Click "Execute Workflow"
   - Verify website response time is logged

3. **Test Email Alerts**:
   - Open "Test Email" workflow (create simple test)
   - Click "Execute Workflow"
   - Check your email inbox

4. **Test WhatsApp**:
   - Open "Test WhatsApp" workflow
   - Click "Execute Workflow"
   - Check your WhatsApp messages

### Common Issues

See [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md) for detailed troubleshooting.

## Backup & Restore

### Backup Strategy

```bash
# 1. Backup n8n data volume
docker run --rm \
  -v terry_n8n_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/n8n-backup-$(date +%Y%m%d).tar.gz /data

# 2. Backup environment file
cp .env .env.backup

# 3. Backup workflows (export from n8n UI or copy JSON files)
cp -r workflows workflows-backup-$(date +%Y%m%d)

# 4. Backup database (if using PostgreSQL)
docker-compose exec postgres pg_dump -U n8n n8n > backup-$(date +%Y%m%d).sql
```

### Automated Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR

# Backup n8n data
docker run --rm \
  -v terry_n8n_data:/data \
  -v $(pwd)/$BACKUP_DIR:/backup \
  alpine tar czf /backup/n8n-data-$DATE.tar.gz /data

# Backup environment
cp .env $BACKUP_DIR/env-$DATE.backup

# Backup workflows
cp -r workflows $BACKUP_DIR/workflows-$DATE

echo "Backup completed: $BACKUP_DIR/*-$DATE*"
```

### Restore Procedure

```bash
# 1. Stop Terry
docker-compose down

# 2. Restore n8n data
docker run --rm \
  -v terry_n8n_data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd /data && tar xzf /backup/n8n-backup-YYYYMMDD.tar.gz --strip 1"

# 3. Restore environment
cp .env.backup .env

# 4. Restore workflows
cp -r workflows-backup-YYYYMMDD/* workflows/

# 5. Start Terry
docker-compose up -d
```

### Backup Schedule

Recommended backup frequency:
- **Daily**: Automated backup via cron
- **Before updates**: Manual backup
- **Weekly**: Offsite backup copy

Example cron job:
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/terry && ./scripts/backup.sh
```

## Next Steps

1. ✅ Complete [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md) for email/WhatsApp/LinkedIn
2. ✅ Review [WORKFLOW_GUIDES.md](./WORKFLOW_GUIDES.md) for workflow implementation
3. ✅ Read [USER_MANUAL.md](./USER_MANUAL.md) for daily operations
4. ✅ Implement Phase 1 workflows (Week 1)

## Support

For installation issues:
- Check [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)
- Review n8n logs: `docker-compose logs -f`
- Contact DevOps team on Slack

## Version History

- v1.0.0 (2025-11): Initial setup guide

