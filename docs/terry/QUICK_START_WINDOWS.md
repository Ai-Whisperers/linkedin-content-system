# Terry Quick Start Guide - Windows

**Time to Complete:** 30-45 minutes
**Difficulty:** Easy
**Prerequisites:** Docker Desktop, API keys ready

---

## Step 1: Start Docker Desktop (2 minutes)

1. Open Docker Desktop on Windows
2. Wait for Docker to fully start (bottom-left should show green "Running")
3. Verify Docker is running:

```powershell
docker --version
docker ps
```

Expected output: Docker version info and empty container list (or existing containers).

---

## Step 2: Create Environment File (5 minutes)

Navigate to Terry directory:

```powershell
cd C:\Users\kyrian\Documents\contentCreator\docs\terry
```

Create `.env` file from template:

```powershell
copy env.template .env
notepad .env
```

**Fill in these values in `.env`:**

```bash
# n8n Login (CHANGE THESE!)
N8N_BASIC_AUTH_USER=aiwhisperers
N8N_BASIC_AUTH_PASSWORD=ChooseAStrongPassword123!

# GitHub API (YOU HAVE THIS)
GITHUB_TOKEN=ghp_your_actual_github_token_here
GITHUB_ORG=Ai-Whisperers

# OpenAI API (YOU HAVE THIS)
OPENAI_API_KEY=sk-proj-your_actual_openai_key_here

# Email (YOU HAVE THIS)
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=terry@ai-whisperers.com
EMAIL_TO=your-email@gmail.com
```

**Save and close Notepad.**

---

## Step 3: Launch Terry (2 minutes)

Start Terry containers:

```powershell
docker-compose up -d
```

Expected output:
```
[+] Running 2/2
 ✔ Network terry_terry-network  Created
 ✔ Container terry-n8n          Started
```

Check Terry is running:

```powershell
docker-compose ps
```

Expected output:
```
NAME        IMAGE             STATUS        PORTS
terry-n8n   n8nio/n8n:latest  Up X seconds  0.0.0.0:5678->5678/tcp
```

View startup logs:

```powershell
docker-compose logs -f n8n
```

Wait for this message:
```
Editor is now accessible via: http://localhost:5678
```

Press `Ctrl+C` to exit logs.

---

## Step 4: Access Terry Interface (2 minutes)

Open your browser:

```
http://localhost:5678
```

**Login with credentials from `.env`:**
- Username: `aiwhisperers` (or whatever you set as N8N_BASIC_AUTH_USER)
- Password: Your N8N_BASIC_AUTH_PASSWORD

You should see the n8n workflow interface!

---

## Step 5: Configure Credentials (10 minutes)

### 5.1 GitHub Credentials

1. In n8n, click **Settings** (bottom left) → **Credentials**
2. Click **"Add Credential"**
3. Search for **"GitHub"** → Select **"GitHub API"**
4. Fill in:
   - **Credential Name:** `AI-Whisperers GitHub`
   - **Access Token:** Your GitHub token (from `.env`)
5. Click **"Save"**

### 5.2 OpenAI Credentials

1. Click **"Add Credential"** again
2. Search for **"OpenAI"** → Select **"OpenAI API"**
3. Fill in:
   - **Credential Name:** `Terry GPT-4`
   - **API Key:** Your OpenAI key (from `.env`)
   - **Organization:** (leave empty unless you have an org ID)
4. Click **"Save"**

### 5.3 Email (SMTP) Credentials

1. Click **"Add Credential"** again
2. Search for **"SMTP"** → Select **"SMTP"**
3. Fill in:
   - **Credential Name:** `Terry Email Alerts`
   - **Host:** `smtp.gmail.com`
   - **Port:** `587`
   - **User:** Your Gmail address
   - **Password:** Your Gmail app password
   - **From Email:** `terry@ai-whisperers.com`
   - **Connection Security:** `TLS`
4. Click **"Test Connection"** (should succeed)
5. Click **"Save"**

---

## Step 6: Import Workflows (10 minutes)

### 6.1 Import GitHub Health Check Workflow

1. In n8n, click **"Workflows"** (top left) → **"Add Workflow"**
2. Click the **three dots menu** (···) → **"Import from File"**
3. Navigate to: `C:\Users\kyrian\Documents\contentCreator\docs\terry\workflows\`
4. Select **`01-github-health-check.json`**
5. Click **"Open"**
6. The workflow will load in the editor

**Configure the workflow:**

1. Click on the **"Get Repository Info"** node (blue HTTP Request box)
2. In the right panel, under **"Credential to connect with"**:
   - Select **"AI-Whisperers GitHub"** (the credential you created)
3. Click on the **"Send Alert Email"** node
4. In the right panel, under **"Credential to connect with"**:
   - Select **"Terry Email Alerts"**
5. Update email addresses:
   - **"To Email"**: Your actual email address
   - **"From Email"**: `terry@ai-whisperers.com`

**Save and Activate:**

1. Click **"Save"** button (top right)
2. Name it: **"GitHub Health Check"**
3. Toggle **"Active"** switch (top right) → should turn GREEN
4. Click **"Execute Workflow"** to test it manually

You should receive an email report about your GitHub repositories!

### 6.2 Import Website Uptime Workflow

1. Click **"Workflows"** → **"Add Workflow"**
2. Click **···** → **"Import from File"**
3. Select **`02-website-uptime.json`**
4. Click **"Open"**

**Configure the workflow:**

1. Click on the **"Check Website"** node
2. Update the URL to: `https://ai-whisperers-portfolio-website.vercel.app/`
3. Click on the **"Send Alert Email"** node
4. Select credential: **"Terry Email Alerts"**
5. Update email addresses

**Save and Activate:**

1. Click **"Save"** → Name: **"Website Uptime Monitor"**
2. Toggle **"Active"** → GREEN
3. Click **"Execute Workflow"** to test

You should receive a website uptime report!

---

## Step 7: Verify Everything Works (5 minutes)

### Test 1: Check Containers

```powershell
docker-compose ps
```

Expected: `terry-n8n` should show **"Up"** status.

### Test 2: Check Logs

```powershell
docker-compose logs -f --tail=50 n8n
```

Expected: No ERROR messages. Should see workflow executions.

### Test 3: Manual Workflow Execution

1. In n8n, go to **"Workflows"**
2. Open **"GitHub Health Check"**
3. Click **"Execute Workflow"**
4. Check **"Executions"** tab (bottom) - should show SUCCESS
5. Check your email - should receive GitHub health report

### Test 4: Check Scheduled Execution

Wait 6 hours for automatic GitHub check (or change the schedule to run every 15 minutes for testing).

To change schedule:
1. Open **"GitHub Health Check"** workflow
2. Click on **"Every 6 Hours"** node (the first node)
3. Change interval to **"Every 15 minutes"** for testing
4. Click **"Save"**
5. Wait 15 minutes, then check **"Executions"** tab

---

## Step 8: Customize Monitoring (Optional)

### Add More Repositories

1. Open **"GitHub Health Check"** workflow
2. Click on **"Set Repository List"** node
3. In the **"repositories"** field, add/remove repo names:

```json
["work-hours-automated-reports", "Company-Information", "agentic-schemas", "ai-whisperers-portfolio-website", "WPG-Amenities", "contentCreator"]
```

4. Click **"Save"**

### Add More Websites to Monitor

1. Open **"Website Uptime Monitor"** workflow
2. Add more **"Check Website"** nodes for different URLs
3. Connect them to the alert logic

### Change Alert Thresholds

1. Open workflows
2. Edit the JavaScript code in **"Analyze"** nodes
3. Change threshold values (e.g., response time > 3000ms = alert)

---

## Common Issues & Solutions

### Issue: Docker won't start

**Solution:**
```powershell
docker-compose down
docker-compose up -d
```

### Issue: Can't access http://localhost:5678

**Solution:**
1. Check Docker Desktop is running
2. Check port 5678 isn't used by another app:
```powershell
netstat -ano | findstr :5678
```
3. Try restarting containers

### Issue: Workflow execution fails

**Solution:**
1. Check credentials are saved correctly
2. Click **"Executions"** tab → View error details
3. Check API keys are valid
4. Verify internet connection

### Issue: Not receiving emails

**Solution:**
1. Verify Gmail app password is correct (not your regular password)
2. Check spam/junk folder
3. Test SMTP credentials in n8n (should show success)
4. Try sending to different email address

---

## Stop/Start Terry

**Stop Terry:**
```powershell
cd C:\Users\kyrian\Documents\contentCreator\docs\terry
docker-compose down
```

**Start Terry:**
```powershell
cd C:\Users\kyrian\Documents\contentCreator\docs\terry
docker-compose up -d
```

**Restart Terry:**
```powershell
docker-compose restart
```

**View Logs:**
```powershell
docker-compose logs -f n8n
```

---

## Next Steps

1. ✅ **Let Terry run for 24 hours** - Monitor your first automated reports
2. ✅ **Review WORKFLOW_GUIDES.md** - Learn about all 14 available workflows
3. ✅ **Add more monitoring** - Docker containers, API endpoints, deployments
4. ✅ **Set up WhatsApp alerts** - For critical issues (optional)
5. ✅ **Create custom workflows** - Build your own automation

---

## Backup & Maintenance

### Backup Terry Data

```powershell
docker run --rm -v terry_n8n_data:/data -v ${PWD}:/backup alpine tar czf /backup/terry-backup-$(Get-Date -Format "yyyyMMdd").tar.gz /data
```

### Update Terry

```powershell
docker-compose pull
docker-compose down
docker-compose up -d
```

---

## Support

**Issues?**
1. Check `docker-compose logs -f n8n`
2. Review TROUBLESHOOTING_GUIDE.md
3. Contact DevOps team

**Terry is now protecting your infrastructure 24/7!** 🤖✅

---

**Built by AI-Whisperers | Paraguay → Global**
