# Terry Troubleshooting Guide

Comprehensive guide for diagnosing and fixing common Terry issues.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Installation Issues](#installation-issues)
3. [Connection Problems](#connection-problems)
4. [Workflow Errors](#workflow-errors)
5. [Notification Issues](#notification-issues)
6. [Performance Problems](#performance-problems)
7. [API Issues](#api-issues)
8. [Recovery Procedures](#recovery-procedures)

---

## Quick Diagnostics

### Is Terry Running?

```bash
# Check Docker container status
docker ps | grep terry

# Expected output:
# CONTAINER ID   IMAGE          STATUS        PORTS
# abc123def456   n8nio/n8n      Up 2 hours    0.0.0.0:5678->5678/tcp

# If not running:
docker-compose ps

# Check logs
docker-compose logs --tail 50 n8n
```

### Is Terry Working?

```bash
# Check n8n health endpoint
curl http://localhost:5678/healthz

# Expected response:
# {"status":"ok"}

# If error, check logs:
docker-compose logs -f n8n
```

### Recent Errors?

```bash
# Check logs for errors
docker-compose logs n8n | grep -i error | tail -20

# Check execution history in n8n UI:
# 1. Open http://localhost:5678
# 2. Click "Executions"
# 3. Look for red X marks (failed executions)
```

---

## Installation Issues

### Issue: Docker Container Won't Start

**Symptoms:**
```
Error: Cannot start service n8n: driver failed
```

**Diagnosis:**
```bash
# Check Docker is running
docker info

# Check port availability
netstat -tuln | grep 5678
# or on Windows:
netstat -an | findstr 5678
```

**Solutions:**

**1. Port already in use:**
```bash
# Find process using port 5678
lsof -i :5678
# or on Windows:
netstat -ano | findstr :5678

# Kill the process or change Terry's port in docker-compose.yml:
ports:
  - "5679:5678"  # Changed from 5678
```

**2. Docker permissions:**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER

# Log out and back in, then test:
docker ps
```

**3. Insufficient resources:**
```bash
# Check Docker resources
docker info | grep -i "total memory\|cpus"

# Increase in Docker Desktop settings:
# Settings → Resources → Memory: 4GB+
```

---

### Issue: n8n UI Not Accessible

**Symptoms:**
- Browser shows "Connection refused"
- http://localhost:5678 times out

**Diagnosis:**
```bash
# 1. Is container running?
docker ps | grep n8n

# 2. Is n8n process running inside container?
docker-compose exec n8n ps aux | grep n8n

# 3. Check container logs
docker-compose logs n8n | tail -50
```

**Solutions:**

**1. Container running but UI not accessible:**
```bash
# Check n8n logs for startup errors
docker-compose logs n8n | grep -i "error\|fail"

# Common error: Port binding failed
# Solution: Change port in docker-compose.yml
```

**2. Firewall blocking:**
```bash
# Linux: Allow port 5678
sudo ufw allow 5678/tcp

# Windows: Add firewall rule via GUI or:
netsh advfirewall firewall add rule name="n8n" dir=in action=allow protocol=TCP localport=5678
```

**3. Wrong host configuration:**
```yaml
# In docker-compose.yml, ensure:
environment:
  - N8N_HOST=localhost  # or your actual hostname
  - N8N_PORT=5678
  - N8N_PROTOCOL=http
```

---

### Issue: Database Connection Failed

**Symptoms:**
```
Error: ECONNREFUSED connecting to PostgreSQL
```

**Diagnosis:**
```bash
# If using PostgreSQL:
docker-compose ps postgres

# Check PostgreSQL logs:
docker-compose logs postgres
```

**Solutions:**

**1. Use SQLite instead (simpler):**
```yaml
# In docker-compose.yml:
environment:
  - DB_TYPE=sqlite
  # Comment out PostgreSQL settings
```

**2. Fix PostgreSQL connection:**
```bash
# Ensure postgres container is running
docker-compose up -d postgres

# Wait for postgres to be ready:
docker-compose logs -f postgres
# Look for: "database system is ready to accept connections"

# Then start n8n:
docker-compose up -d n8n
```

---

## Connection Problems

### Issue: GitHub API Authentication Failed

**Symptoms:**
```
Error: 401 Unauthorized
Bad credentials
```

**Diagnosis:**
```bash
# Test GitHub token manually:
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/user

# Should return your user info
# If 401, token is invalid
```

**Solutions:**

**1. Token expired or revoked:**
```
1. Go to GitHub: Settings → Developer settings → Personal access tokens
2. Regenerate token
3. Update in n8n:
   - Credentials → GitHub credential → Edit
   - Enter new token
   - Save
```

**2. Insufficient permissions:**
```
Token needs these scopes:
✓ repo (Full control of private repositories)
✓ workflow (Update GitHub Action workflows)
✓ admin:org (Full control of orgs and teams)

Create new token with correct scopes.
```

**3. Token not configured in n8n:**
```
1. Open n8n UI
2. Settings → Credentials → Add Credential
3. Select "GitHub API"
4. Enter:
   - Name: AI-Whisperers GitHub
   - Access Token: ghp_xxxxxxxxxxxx
5. Save
6. Update workflows to use this credential
```

---

### Issue: OpenAI API Errors

**Symptoms:**
```
Error: 429 Rate limit exceeded
Error: 401 Invalid API key
Error: Model 'gpt-4' not found
```

**Diagnosis:**
```bash
# Test API key:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY"

# Check your usage:
# Visit: https://platform.openai.com/usage
```

**Solutions:**

**1. Rate limit exceeded:**
```
Cause: Too many requests

Solutions:
a) Wait 60 seconds, retry
b) Upgrade OpenAI tier
c) Add rate limiting to workflows:
   - Add delay between API calls
   - Use caching for repeated queries
```

**2. Invalid API key:**
```
1. Visit: https://platform.openai.com/api-keys
2. Create new secret key
3. Update in n8n:
   - Credentials → OpenAI credential → Edit
   - Enter new key
   - Save
```

**3. Model not found (gpt-4):**
```
Cause: Account doesn't have GPT-4 access

Solutions:
a) Check access: https://platform.openai.com/account
b) Use GPT-3.5 temporarily:
   - Edit workflow
   - Change model from "gpt-4" to "gpt-3.5-turbo"
c) Add payment method to unlock GPT-4
```

**4. Insufficient quota:**
```
Error: "You exceeded your current quota"

Solutions:
1. Check billing: https://platform.openai.com/account/billing
2. Add payment method
3. Set usage limits to prevent overspending
```

---

### Issue: Email Not Sending

**Symptoms:**
- No emails received
- SMTP connection timeout
- Authentication failed

**Diagnosis:**
```bash
# Test SMTP connection manually:
telnet smtp.gmail.com 587

# Should connect
# If timeout, SMTP blocked or wrong host/port
```

**Solutions:**

**1. Gmail authentication failed:**
```
Cause: Using regular password instead of app password

Solution:
1. Enable 2FA on Gmail
2. Generate app password:
   - Google Account → Security → App passwords
3. Use app password in n8n (not regular password)
```

**2. SMTP blocked by firewall:**
```bash
# Test if port 587 is accessible:
nc -zv smtp.gmail.com 587

# If blocked, check firewall rules:
sudo iptables -L | grep 587

# Allow outbound SMTP:
sudo ufw allow out 587/tcp
```

**3. Wrong SMTP configuration:**
```javascript
// Correct Gmail SMTP settings:
{
  host: "smtp.gmail.com",
  port: 587,
  secure: false,  // Use STARTTLS, not SSL
  user: "your-email@gmail.com",
  password: "your-app-password"  // 16-char app password
}
```

**4. SendGrid issues:**
```
Error: "The from address does not match a verified Sender Identity"

Solution:
1. Go to SendGrid → Settings → Sender Authentication
2. Verify your sender email
3. Use verified email in "from" field
```

**5. Rate limit exceeded:**
```
Gmail: 500 emails/day
SendGrid Free: 100 emails/day

Solution:
- Batch non-critical alerts into digest
- Upgrade to paid tier
- Use multiple providers
```

---

### Issue: WhatsApp Messages Not Sending

**Symptoms:**
```
Error: 401 Unauthorized
Error: Phone number not verified
Messages not delivered
```

**Diagnosis:**
```bash
# Test WhatsApp API:
curl -X POST "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "+1234567890",
    "type": "text",
    "text": { "body": "Test" }
  }'
```

**Solutions:**

**1. Access token expired:**
```
Temporary tokens expire after 24 hours

Solution:
1. Go to Meta Business Suite
2. System Users → Create permanent token
3. Update token in n8n
```

**2. Phone number not verified:**
```
1. Go to WhatsApp Business Platform
2. Phone Numbers → Verify your number
3. Follow SMS verification process
```

**3. Recipient phone format wrong:**
```
Correct format: +[country_code][phone_number]
Example: +595981234567 (Paraguay)

Wrong: 0981234567 (missing country code)
```

**4. Message template not approved:**
```
For first message to user, need approved template

Solution:
1. Use test numbers during development
2. Submit templates for approval in production
3. Or use interactive conversations (reply-based)
```

---

## Workflow Errors

### Issue: Workflow Execution Failed

**Symptoms:**
- Red X in execution history
- "Node execution error"
- Workflow stops unexpectedly

**Diagnosis:**
```
1. Open n8n UI
2. Click "Executions"
3. Find failed execution
4. Click to see details
5. Find red node (error point)
6. Click node to see error message
```

**Common Errors & Solutions:**

#### Error: "Cannot read property 'json' of undefined"

**Cause:** Previous node returned no data

**Solution:**
```
1. Check previous node's output
2. Add IF node to handle empty data:
   - If data exists → Continue
   - If no data → Skip or use default
```

#### Error: "Timeout of 120000ms exceeded"

**Cause:** Operation took too long

**Solution:**
```javascript
// In HTTP Request node, increase timeout:
{
  "timeout": 300000  // 5 minutes instead of 2
}

// Or in Function node, optimize logic:
// - Reduce iterations
// - Add early returns
// - Batch operations
```

#### Error: "ECONNRESET" or "ETIMEDOUT"

**Cause:** Network interruption

**Solution:**
```
1. Add retry logic:
   - HTTP Request node → Options → Retry on Fail
   - Max Attempts: 3
   - Wait Between Tries: 1000ms

2. Check network connectivity:
   docker exec terry-n8n ping -c 4 github.com
```

#### Error: "SSH connection failed"

**Cause:** SSH credentials invalid or server unreachable

**Solution:**
```
1. Test SSH manually:
   ssh user@server

2. Check SSH credentials in n8n:
   - Credentials → SSH credential
   - Verify host, user, password/key

3. Check server SSH is running:
   sudo systemctl status sshd
```

---

### Issue: Workflow Not Triggering

**Symptoms:**
- Schedule trigger not firing
- Webhook not receiving events
- Manual execution works, auto doesn't

**Diagnosis:**
```
1. Check workflow is ACTIVE (toggle in top right)
2. Check trigger node configuration
3. Check n8n logs for trigger errors
```

**Solutions:**

**1. Workflow not activated:**
```
Top right toggle must be ON (blue)
If OFF (gray), click to activate
```

**2. Schedule trigger misconfigured:**
```javascript
// Correct cron syntax:
{
  "rule": {
    "interval": [{
      "field": "hours",
      "hoursInterval": 6
    }]
  }
}

// Or cron expression:
{
  "rule": {
    "cronExpression": "0 */6 * * *"  // Every 6 hours
  }
}
```

**3. Webhook URL wrong:**
```
Correct format:
https://your-domain.com/webhook/YOUR_WEBHOOK_PATH

Check in workflow:
- Webhook Trigger node
- Copy webhook URL
- Update in external service (GitHub, Vercel, etc.)
```

**4. Webhook secret mismatch:**
```
If webhook requires signature verification:
1. Get secret from external service
2. Add to n8n webhook node
3. Enable authentication
```

---

## Notification Issues

### Issue: Not Receiving Alerts

**Symptoms:**
- Problems detected but no email/WhatsApp
- Workflows execute but notifications silent

**Diagnosis:**
```
1. Check workflow execution logs
2. Find notification node (Send Email, WhatsApp, etc.)
3. Check if node executed
4. Check node output for errors
```

**Solutions:**

**1. Notification node skipped:**
```
Cause: IF node condition not met

Solution:
- Review IF node condition
- Check data being compared
- Add logging before IF node to debug
```

**2. Email in spam folder:**
```
1. Check spam/junk folder
2. Add sender to safe senders list
3. Check email headers for spam score
```

**3. WhatsApp blocked:**
```
Cause: Too many messages, or messages flagged as spam

Solution:
1. Check WhatsApp Business account status
2. Review message templates
3. Reduce message frequency
4. Use approved templates
```

**4. Wrong recipient:**
```
Check recipient address in:
- .env file: EMAIL_TO, WHATSAPP_RECIPIENT
- n8n credential configuration
- Workflow node configuration
```

---

### Issue: Too Many Notifications (Alert Fatigue)

**Symptoms:**
- Receiving alerts every few minutes
- Duplicate alerts for same issue
- Low-priority alerts interrupting work

**Solutions:**

**1. Enable alert deduplication:**
```javascript
// In workflow, add Function node before notification:
const recentAlerts = $getWorkflowStaticData('node');
const alertKey = `${$json.service}_${$json.problem}`;
const now = Date.now();

// Check if alerted in last hour
if (recentAlerts[alertKey] && (now - recentAlerts[alertKey]) < 3600000) {
  // Skip notification (already alerted)
  return null;
}

// Store this alert time
recentAlerts[alertKey] = now;
return $json;
```

**2. Adjust thresholds:**
```javascript
// Increase thresholds to reduce sensitivity:

// Website response time: 3s → 5s
const SLOW_RESPONSE = 5000; // ms

// CPU usage: 80% → 90%
const HIGH_CPU = 90; // percent

// Error rate: 1% → 5%
const HIGH_ERROR_RATE = 0.05;
```

**3. Use priority routing:**
```javascript
// Send critical via WhatsApp, others via email
if (priority === 'critical') {
  await sendWhatsApp(alert);
} else if (priority === 'high' || priority === 'medium') {
  await sendEmail(alert);
} else {
  // Low priority → log only
  await logToDatabase(alert);
}
```

**4. Create digest emails:**
```
Instead of sending each alert immediately:
1. Store alerts in database
2. Send daily summary email at 8 AM
3. Only send immediate alerts for critical issues
```

---

## Performance Problems

### Issue: Terry Running Slowly

**Symptoms:**
- Workflow executions taking minutes instead of seconds
- n8n UI sluggish
- High CPU/memory usage

**Diagnosis:**
```bash
# Check Docker resource usage:
docker stats terry-n8n

# Should see:
# CPU: < 50%
# Memory: < 2GB

# Check workflow execution times in n8n UI:
# Executions → Sort by duration → Look for slow workflows
```

**Solutions:**

**1. Database too large:**
```bash
# Check database size:
docker exec terry-n8n du -sh /home/node/.n8n/database.sqlite

# If > 1GB, archive old executions:
# n8n UI → Settings → Execution History
# Set: "Save executions for X days" → 30 days
```

**2. Too many concurrent workflows:**
```yaml
# In docker-compose.yml, limit concurrency:
environment:
  - EXECUTIONS_PROCESS=main  # Run in main process
  - EXECUTIONS_MODE=regular  # Not queue mode
```

**3. Memory leak in workflow:**
```javascript
// In Function nodes, avoid memory leaks:

// BAD (stores data indefinitely):
const allData = [];
for (const item of $input.all()) {
  allData.push(item.json);
}

// GOOD (processes streams):
return $input.all().map(item => ({
  json: processItem(item.json)
}));
```

**4. External API slow:**
```
Add timeouts to HTTP Request nodes:
- Options → Timeout: 10000ms
- Options → Retry on Fail: 3 attempts

If still slow, API may be the bottleneck (not Terry).
```

---

### Issue: High GPT-4 API Costs

**Symptoms:**
- Monthly OpenAI bill unexpectedly high
- Token usage exceeding budget

**Diagnosis:**
```
1. Visit: https://platform.openai.com/usage
2. Review daily token usage
3. Identify which requests use most tokens
```

**Solutions:**

**1. Use GPT-4-turbo (cheaper):**
```javascript
// In OpenAI node, change model:
{
  "model": "gpt-4-turbo-preview"  // Instead of "gpt-4"
}

// Savings: ~50% reduction in cost
```

**2. Reduce context size:**
```javascript
// Don't send entire logs, summarize:

// BAD (sends 10KB of logs):
const context = {
  logs: fullLogs  // 10,000 tokens
};

// GOOD (send summary):
const context = {
  logs: fullLogs.slice(-50)  // Last 50 lines only (500 tokens)
};
```

**3. Cache common analyses:**
```javascript
// Store AI responses for similar problems:
const cacheKey = `analysis_${problemType}`;
const cached = await getFromCache(cacheKey);

if (cached) {
  return cached;  // Skip GPT-4 call
} else {
  const analysis = await gpt4(problem);
  await saveToCache(cacheKey, analysis);
  return analysis;
}
```

**4. Set monthly budget alert:**
```
1. OpenAI dashboard → Billing → Usage limits
2. Set soft limit: $50/month
3. Set hard limit: $100/month
4. Email alerts enabled
```

---

## API Issues

### Issue: GitHub API Rate Limit

**Symptoms:**
```
Error: 403 API rate limit exceeded
X-RateLimit-Remaining: 0
```

**Diagnosis:**
```bash
# Check current rate limit:
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/rate_limit

# Response shows:
# - limit: 5000 (authenticated)
# - remaining: 0
# - reset: 1699000000 (Unix timestamp)
```

**Solutions:**

**1. Wait for reset:**
```javascript
// Add to workflow:
const reset = response.headers['x-ratelimit-reset'];
const waitTime = (reset * 1000) - Date.now();

if (waitTime > 0) {
  await sleep(waitTime);
  // Retry request
}
```

**2. Reduce check frequency:**
```
GitHub Health Check: Every 6 hours (default)
If rate limit hit, change to: Every 12 hours

In workflow schedule trigger:
hoursInterval: 12
```

**3. Use conditional requests (ETags):**
```javascript
// Cache ETag from previous request:
const etag = $getWorkflowStaticData('node').etag;

// Include in next request:
const response = await http({
  url: 'https://api.github.com/repos/owner/repo',
  headers: {
    'If-None-Match': etag
  }
});

// If 304 Not Modified, no rate limit cost
// If 200, save new ETag for next time
```

---

### Issue: Vercel API Webhook Not Triggering

**Symptoms:**
- Deployments happening but Terry not notified
- Webhook endpoint not receiving events

**Diagnosis:**
```
1. Check Vercel webhook configuration:
   - Project Settings → Git → Deploy Hooks
2. Check webhook URL is correct
3. Check n8n webhook execution history
```

**Solutions:**

**1. Wrong webhook URL:**
```
Correct format:
https://your-n8n-domain.com/webhook/vercel-deployment

Update in Vercel:
1. Project Settings → Git
2. Deploy Hooks → Edit
3. Enter correct URL
4. Save
```

**2. Webhook secret mismatch:**
```
Vercel sends signature in header: x-vercel-signature

In n8n Webhook node:
1. Enable "Respond → Immediately"
2. Header Auth → Add:
   Name: x-vercel-signature
   Value: (your webhook secret)
```

**3. n8n not publicly accessible:**
```
For webhooks, n8n must be reachable from internet

Solutions:
a) Use ngrok (development):
   ngrok http 5678
   Use ngrok URL in Vercel

b) Use cloud deployment (production):
   Deploy n8n to DigitalOcean, AWS, etc.
   Use public domain
```

---

## Recovery Procedures

### Complete Terry Reinstall

**When needed:**
- Corrupted database
- Configuration completely broken
- Upgrade to new version

**Steps:**

```bash
# 1. Backup current data
./scripts/backup.sh

# 2. Stop and remove containers
docker-compose down -v  # -v removes volumes

# 3. Clean up
docker system prune -a

# 4. Reinstall
docker-compose up -d

# 5. Restore from backup (if needed)
./scripts/restore.sh backup-YYYYMMDD.tar.gz

# 6. Import workflows
# Via n8n UI: Workflows → Import from File
# Import each workflow JSON from ./workflows/

# 7. Configure credentials
# Via n8n UI: Settings → Credentials
# Re-add all API keys

# 8. Test
# Execute each workflow manually
# Verify all connections work

# 9. Activate workflows
# Toggle each workflow to Active
```

---

### Restore from Backup

**When needed:**
- Accidental workflow deletion
- Configuration error
- Data corruption

**Steps:**

```bash
# 1. Stop Terry
docker-compose down

# 2. List available backups
ls -lh backups/

# 3. Restore specific backup
./scripts/restore.sh backups/n8n-backup-20251103.tar.gz

# 4. Restart Terry
docker-compose up -d

# 5. Verify restoration
# - Open n8n UI
# - Check workflows are present
# - Check credentials (may need to re-enter passwords)
# - Test a workflow execution

# 6. If successful, keep backup
# If not, try different backup
```

---

### Emergency: Terry Completely Down

**Critical situation: Infrastructure monitoring offline**

**Immediate actions:**

```
1. Don't panic
   - Infrastructure likely still running
   - Terry monitors, doesn't control

2. Check systems manually:
   □ Visit website: Working?
   □ Check GitHub: Repos accessible?
   □ SSH to servers: Everything running?

3. Quick Terry restart:
   docker-compose restart n8n

4. If still down:
   docker-compose logs -f n8n
   # Look for errors

5. If can't fix quickly:
   - Post in Slack: "Terry down, investigating"
   - Monitor systems manually
   - Fix Terry when time permits

6. Temporary manual monitoring:
   # Website check:
   */15 * * * * curl -s https://ai-whisperers-portfolio-website.vercel.app/

   # GitHub check (visit in browser):
   https://github.com/Ai-Whisperers

7. Document what happened:
   - What broke?
   - How did you fix it?
   - How to prevent next time?
```

---

## Getting Help

### Before Asking for Help

**Gather information:**

```bash
# 1. System info
docker --version
docker-compose --version
uname -a  # Linux
systeminfo  # Windows

# 2. Container status
docker-compose ps

# 3. Recent logs
docker-compose logs --tail 100 n8n > terry-logs.txt

# 4. Execution history
# Take screenshot of failed execution in n8n UI

# 5. Configuration (remove sensitive data!)
cat docker-compose.yml > config.txt
cat .env | grep -v "PASSWORD\|TOKEN\|KEY\|SECRET" >> config.txt
```

### Where to Get Help

**Internal (AI-Whisperers):**
- Slack: #terry-agent channel
- Email: devops@ai-whisperers.com
- Documentation: This guide

**External:**
- n8n Community: https://community.n8n.io
- n8n Discord: https://discord.gg/n8n
- GitHub Issues: https://github.com/n8n-io/n8n/issues

---

## Preventive Maintenance

**Weekly:**
```
□ Review execution history for errors
□ Check disk space (df -h)
□ Review alert volume (too many/few?)
□ Update thresholds if needed
```

**Monthly:**
```
□ Review monthly report
□ Archive old executions (> 30 days)
□ Check API usage vs. limits
□ Update documentation for any changes
□ Test backup/restore procedure
```

**Quarterly:**
```
□ Rotate API keys and passwords
□ Review and optimize workflows
□ Update n8n to latest version
□ Review and update alert thresholds
□ Train team on any new features
```

---

**Troubleshooting Guide v1.0**

*If issue not covered here, check [USER_MANUAL.md](./USER_MANUAL.md) or contact DevOps team.*

Last updated: 2025-11-03

