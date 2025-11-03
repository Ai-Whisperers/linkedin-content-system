# Terry API Reference

Technical reference for Terry's APIs, webhooks, and integration points.

## Table of Contents

1. [n8n Workflow API](#n8n-workflow-api)
2. [Webhook Endpoints](#webhook-endpoints)
3. [Custom Function Nodes](#custom-function-nodes)
4. [Credential Management](#credential-management)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)

---

## n8n Workflow API

### Execute Workflow

**Endpoint:** `POST /api/v1/workflows/{workflowId}/execute`

**Authentication:** Basic Auth or API Key

**Request:**
```json
{
  "data": {
    "problem": "Container stopped",
    "service": "Docker",
    "container_id": "abc123"
  }
}
```

**Response:**
```json
{
  "data": {
    "executionId": "exec-123456",
    "status": "running",
    "startedAt": "2025-11-03T14:30:00Z"
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:5678/api/v1/workflows/1/execute" \
  -u "aiwhisperers:password" \
  -H "Content-Type: application/json" \
  -d '{"data": {"test": true}}'
```

---

### Get Workflow Status

**Endpoint:** `GET /api/v1/executions/{executionId}`

**Authentication:** Basic Auth or API Key

**Response:**
```json
{
  "data": {
    "id": "exec-123456",
    "finished": true,
    "mode": "manual",
    "startedAt": "2025-11-03T14:30:00Z",
    "stoppedAt": "2025-11-03T14:31:15Z",
    "status": "success",
    "data": {
      "resultData": {
        "runData": {}
      }
    }
  }
}
```

---

### List Active Workflows

**Endpoint:** `GET /api/v1/workflows?active=true`

**Authentication:** Basic Auth or API Key

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "GitHub Health Check",
      "active": true,
      "createdAt": "2025-10-01T10:00:00Z",
      "updatedAt": "2025-11-03T14:30:00Z"
    }
  ]
}
```

---

## Webhook Endpoints

### Problem Detection Webhook

**Endpoint:** `POST /webhook/problem-detected`

**Purpose:** Receive problem notifications from monitoring workflows

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: your-webhook-secret
```

**Payload:**
```json
{
  "problem_id": "prob-123456",
  "timestamp": "2025-11-03T14:30:00Z",
  "service": "Website",
  "severity": "critical",
  "description": "Website returning 503 errors",
  "problems": [
    "HTTP 503 Service Unavailable",
    "Response time > 10 seconds"
  ],
  "metrics": {
    "status_code": 503,
    "response_time_ms": 12500,
    "uptime_percent": 98.5
  },
  "context": {
    "url": "https://ai-whisperers-portfolio-website.vercel.app/",
    "recent_deploys": []
  }
}
```

**Response:**
```json
{
  "status": "received",
  "problem_id": "prob-123456",
  "workflow_triggered": "problem-analysis"
}
```

**Example:**
```bash
curl -X POST "http://localhost:5678/webhook/problem-detected" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret" \
  -d '{
    "service": "Docker",
    "severity": "high",
    "description": "Container stopped",
    "container_id": "abc123"
  }'
```

---

### Approval Webhook

**Endpoint:** `POST /webhook/approval/{action}/{alert_id}`

**Actions:** `approve`, `deny`, `info`

**Purpose:** Handle approval responses (email/WhatsApp clicks)

**Example URLs:**
```
POST /webhook/approval/approve/alert-123456
POST /webhook/approval/deny/alert-123456
POST /webhook/approval/info/alert-123456
```

**Query Parameters:**
```
?approved_by=kyrian@ai-whisperers.com
&timestamp=1699000000
```

**Response:**
```json
{
  "status": "approved",
  "alert_id": "alert-123456",
  "approved_by": "kyrian@ai-whisperers.com",
  "approved_at": "2025-11-03T14:35:00Z",
  "execution_id": "exec-789012"
}
```

---

### GitHub Webhook

**Endpoint:** `POST /webhook/github`

**Purpose:** Receive GitHub events (issues, PRs, deployments)

**Headers:**
```
X-GitHub-Event: issues
X-GitHub-Delivery: abc123-def456
X-Hub-Signature-256: sha256=...
```

**Payload (Issue Created):**
```json
{
  "action": "opened",
  "issue": {
    "id": 123456,
    "number": 42,
    "title": "Bug: Website slow",
    "body": "The website loads slowly...",
    "state": "open",
    "user": {
      "login": "kyrian"
    },
    "labels": [],
    "created_at": "2025-11-03T14:30:00Z"
  },
  "repository": {
    "name": "ai-whisperers-portfolio-website",
    "full_name": "Ai-Whisperers/ai-whisperers-portfolio-website"
  }
}
```

**Signature Verification:**
```javascript
const crypto = require('crypto');

function verifyGitHubSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

---

### Vercel Webhook

**Endpoint:** `POST /webhook/vercel`

**Purpose:** Receive deployment events from Vercel

**Headers:**
```
X-Vercel-Signature: signature-here
```

**Payload (Deployment Success):**
```json
{
  "type": "deployment",
  "createdAt": 1699000000,
  "payload": {
    "deployment": {
      "id": "dpl_123456",
      "url": "preview-abc123.vercel.app",
      "name": "ai-whisperers-portfolio-website",
      "state": "READY",
      "creator": {
        "username": "kyrian"
      }
    },
    "project": {
      "id": "prj_123456",
      "name": "ai-whisperers-portfolio-website"
    }
  }
}
```

---

### WhatsApp Webhook (Incoming Messages)

**Endpoint:** `POST /webhook/whatsapp`

**Purpose:** Receive WhatsApp messages for approval responses

**Verification Request (GET):**
```
GET /webhook/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
```

**Verification Response:**
```
CHALLENGE
```

**Message Payload:**
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "phone_number_id": "123456789"
        },
        "messages": [{
          "from": "+595xxxxxxxxx",
          "id": "wamid.xxx",
          "timestamp": "1699000000",
          "type": "text",
          "text": {
            "body": "YES"
          }
        }]
      }
    }]
  }]
}
```

**Processing:**
```javascript
const message = payload.entry[0].changes[0].value.messages[0];
const from = message.from;
const text = message.text.body.toUpperCase();

if (text === 'YES' || text === 'APPROVE') {
  await handleApproval(from);
} else if (text === 'NO' || text === 'DENY') {
  await handleDenial(from);
} else if (text === 'INFO') {
  await sendMoreInfo(from);
}
```

---

## Custom Function Nodes

### Problem Analyzer

**Purpose:** Analyze problem severity and determine routing

**Input:**
```javascript
{
  "service": "Website",
  "error": "503 Service Unavailable",
  "metrics": {
    "status_code": 503,
    "response_time_ms": 12500
  }
}
```

**Function:**
```javascript
// Function Node: analyzeProblem
const input = $input.first().json;

// Calculate severity
let severity = 'low';
let priority = 'low';

if (input.service === 'Website' && input.metrics.status_code >= 500) {
  severity = 'critical';
  priority = 'critical';
} else if (input.metrics.response_time_ms > 10000) {
  severity = 'high';
  priority = 'high';
} else if (input.metrics.response_time_ms > 5000) {
  severity = 'medium';
  priority = 'medium';
}

// Determine alert channels
let channels = [];
if (priority === 'critical') {
  channels = ['whatsapp', 'email'];
} else if (priority === 'high') {
  channels = ['email'];
} else {
  channels = ['log'];
}

return {
  json: {
    ...input,
    severity: severity,
    priority: priority,
    channels: channels,
    analysis_timestamp: new Date().toISOString()
  }
};
```

**Output:**
```javascript
{
  "service": "Website",
  "error": "503 Service Unavailable",
  "metrics": {
    "status_code": 503,
    "response_time_ms": 12500
  },
  "severity": "critical",
  "priority": "critical",
  "channels": ["whatsapp", "email"],
  "analysis_timestamp": "2025-11-03T14:30:00Z"
}
```

---

### Risk Assessor

**Purpose:** Calculate risk score for proposed solutions

**Input:**
```javascript
{
  "solution": {
    "commands": [
      "docker stop abc123",
      "docker rm abc123"
    ],
    "affects": "development"
  }
}
```

**Function:**
```javascript
// Function Node: assessRisk
const solution = $input.first().json.solution;

let riskScore = 0;
let riskFactors = [];

// Check for destructive operations
const destructiveCommands = ['rm', 'delete', 'drop', 'truncate'];
for (const cmd of solution.commands) {
  for (const destructive of destructiveCommands) {
    if (cmd.includes(destructive)) {
      riskScore += 30;
      riskFactors.push(`Destructive operation: ${destructive}`);
    }
  }
}

// Check environment
if (solution.affects === 'production') {
  riskScore += 25;
  riskFactors.push('Affects production environment');
} else if (solution.affects === 'staging') {
  riskScore += 10;
  riskFactors.push('Affects staging environment');
}

// Check complexity
if (solution.commands.length > 5) {
  riskScore += 15;
  riskFactors.push(`High complexity: ${solution.commands.length} commands`);
}

// Determine risk level
let riskLevel;
if (riskScore >= 50) {
  riskLevel = 'high';
} else if (riskScore >= 25) {
  riskLevel = 'medium';
} else {
  riskLevel = 'low';
}

return {
  json: {
    risk_level: riskLevel,
    risk_score: riskScore,
    risk_factors: riskFactors,
    can_auto_fix: riskLevel === 'low' && riskScore < 15,
    requires_approval: riskLevel !== 'low'
  }
};
```

**Output:**
```javascript
{
  "risk_level": "medium",
  "risk_score": 30,
  "risk_factors": [
    "Destructive operation: rm"
  ],
  "can_auto_fix": false,
  "requires_approval": true
}
```

---

### Alert Deduplicator

**Purpose:** Prevent duplicate alerts within time window

**Function:**
```javascript
// Function Node: deduplicateAlerts
const alert = $input.first().json;
const staticData = $getWorkflowStaticData('node');

// Create unique key for this alert
const alertKey = `${alert.service}_${alert.description}`;
const now = Date.now();
const ONE_HOUR = 3600000;

// Check if we've alerted about this recently
if (staticData[alertKey]) {
  const lastAlertTime = staticData[alertKey];
  const timeSinceLastAlert = now - lastAlertTime;
  
  if (timeSinceLastAlert < ONE_HOUR) {
    // Skip this alert (duplicate within 1 hour)
    return {
      json: {
        skipped: true,
        reason: 'duplicate',
        last_alert_minutes_ago: Math.floor(timeSinceLastAlert / 60000)
      }
    };
  }
}

// Not a duplicate, store this alert time
staticData[alertKey] = now;

// Clean up old entries (older than 24 hours)
const ONE_DAY = 86400000;
for (const key in staticData) {
  if (now - staticData[key] > ONE_DAY) {
    delete staticData[key];
  }
}

return {
  json: {
    ...alert,
    skipped: false,
    is_unique: true
  }
};
```

---

## Credential Management

### Credential Types

#### 1. GitHub API

**Type:** `githubApi`

**Fields:**
```javascript
{
  "name": "AI-Whisperers GitHub",
  "type": "githubApi",
  "data": {
    "accessToken": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "server": "https://api.github.com"  // optional
  }
}
```

**Usage in HTTP Request Node:**
```json
{
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "githubApi"
}
```

---

#### 2. OpenAI API

**Type:** `openAiApi`

**Fields:**
```javascript
{
  "name": "GPT-4 for Terry",
  "type": "openAiApi",
  "data": {
    "apiKey": "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "organizationId": "org-xxxxx"  // optional
  }
}
```

---

#### 3. SMTP Email

**Type:** `smtp`

**Fields:**
```javascript
{
  "name": "Terry Email",
  "type": "smtp",
  "data": {
    "user": "your-email@gmail.com",
    "password": "abcdefghijklmnop",  // App password
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,  // Use STARTTLS
    "ssl": false
  }
}
```

---

#### 4. SSH

**Type:** `sshPassword` or `sshPrivateKey`

**Password Auth:**
```javascript
{
  "name": "Production Server SSH",
  "type": "sshPassword",
  "data": {
    "host": "server.example.com",
    "port": 22,
    "username": "terry",
    "password": "secure-password"
  }
}
```

**Key Auth:**
```javascript
{
  "name": "Production Server SSH",
  "type": "sshPrivateKey",
  "data": {
    "host": "server.example.com",
    "port": 22,
    "username": "terry",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "passphrase": "optional-passphrase"
  }
}
```

---

#### 5. HTTP Basic Auth

**Type:** `httpBasicAuth`

**Fields:**
```javascript
{
  "name": "API Basic Auth",
  "type": "httpBasicAuth",
  "data": {
    "user": "username",
    "password": "password"
  }
}
```

---

#### 6. HTTP Header Auth

**Type:** `httpHeaderAuth`

**Fields (WhatsApp/LinkedIn):**
```javascript
{
  "name": "WhatsApp Business API",
  "type": "httpHeaderAuth",
  "data": {
    "name": "Authorization",
    "value": "Bearer EAAxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

---

### Programmatic Credential Access

**Get Credential:**
```javascript
// In Function node:
const credentials = await this.getCredentials('githubApi');
const githubToken = credentials.accessToken;
```

**Not Recommended:** Credentials should be accessed through n8n's built-in nodes when possible.

---

## Environment Variables

### Core n8n Configuration

```bash
# Server
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_WEBHOOK_URL=https://your-domain.com  # For webhooks

# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=aiwhisperers
N8N_BASIC_AUTH_PASSWORD=secure_password

# Database
DB_TYPE=sqlite  # or postgresdb
DB_POSTGRESDB_HOST=postgres
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=n8n_password

# Execution
EXECUTIONS_MODE=regular  # or queue
EXECUTIONS_TIMEOUT=300  # seconds
EXECUTIONS_TIMEOUT_MAX=3600
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=false

# Timezone
GENERIC_TIMEZONE=America/Asuncion

# Logging
N8N_LOG_LEVEL=info  # error, warn, info, verbose, debug
N8N_LOG_OUTPUT=console  # console, file

# Performance
N8N_CONCURRENCY_PRODUCTION_LIMIT=10
```

---

### Terry-Specific Variables

```bash
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_ORG=Ai-Whisperers

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview

# Email
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=app-password
EMAIL_FROM=terry@ai-whisperers.com
EMAIL_TO=alerts@ai-whisperers.com

# WhatsApp
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_RECIPIENT=+595xxxxxxxxx

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_PERSON_URN=urn:li:person:xxxxxxx

# Vercel
VERCEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx

# Monitoring Configuration
MONITOR_GITHUB_INTERVAL=21600  # 6 hours
MONITOR_WEBSITE_INTERVAL=900   # 15 minutes
MONITOR_DOCKER_INTERVAL=1800   # 30 minutes

# Alert Thresholds
ALERT_WEBSITE_RESPONSE_TIME=3000  # ms
ALERT_CONTAINER_CPU_PERCENT=80
ALERT_CONTAINER_MEMORY_PERCENT=80

# Security
WEBHOOK_SECRET=your_webhook_secret
ENCRYPTION_KEY=your_encryption_key
```

---

### Accessing in Workflows

```javascript
// In Function nodes:
const githubToken = $env.GITHUB_TOKEN;
const orgName = $env.GITHUB_ORG;

// In HTTP Request nodes (expressions):
{
  "url": "={{$env.GITHUB_API_URL}}/orgs/{{$env.GITHUB_ORG}}/repos"
}
```

---

## Database Schema

### Problem History Table

```sql
CREATE TABLE problem_history (
    -- Identity
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Classification
    service VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('detected', 'analyzing', 'fixing', 'resolved', 'escalated')),
    
    -- Problem Details
    title TEXT NOT NULL,
    description TEXT,
    problems JSONB,
    error_details TEXT,
    
    -- Analysis (from GPT-4)
    root_cause TEXT,
    proposed_solution JSONB,
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
    
    -- Resolution
    resolution_method VARCHAR(50),  -- 'auto_fix', 'manual', 'approval_based'
    actions_taken JSONB,
    resolved_at TIMESTAMP,
    resolution_time_seconds INTEGER,
    
    -- Human Involvement
    required_approval BOOLEAN DEFAULT false,
    approval_status VARCHAR(20),  -- 'pending', 'approved', 'denied', 'expired'
    approved_by VARCHAR(100),
    approved_at TIMESTAMP,
    
    -- Success Metrics
    fix_successful BOOLEAN,
    issue_recurred BOOLEAN DEFAULT false,
    recurrence_count INTEGER DEFAULT 0,
    
    -- Metadata
    detected_by VARCHAR(100),  -- Workflow name
    affected_resources JSONB,
    metrics JSONB,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_problem_service ON problem_history(service);
CREATE INDEX idx_problem_severity ON problem_history(severity);
CREATE INDEX idx_problem_timestamp ON problem_history(timestamp DESC);
CREATE INDEX idx_problem_status ON problem_history(status);
CREATE INDEX idx_problem_resolved ON problem_history(resolved_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_problem_history_updated_at BEFORE UPDATE
    ON problem_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### Query Examples

**Get recent problems:**
```sql
SELECT * FROM problem_history
WHERE timestamp > NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC
LIMIT 50;
```

**Auto-fix success rate:**
```sql
SELECT 
    service,
    COUNT(*) as total,
    SUM(CASE WHEN resolution_method = 'auto_fix' THEN 1 ELSE 0 END) as auto_fixed,
    ROUND(AVG(CASE WHEN resolution_method = 'auto_fix' THEN 1 ELSE 0 END) * 100, 2) as auto_fix_rate
FROM problem_history
WHERE resolved_at > NOW() - INTERVAL '30 days'
GROUP BY service;
```

**Mean Time To Resolution:**
```sql
SELECT 
    service,
    AVG(resolution_time_seconds) / 60 as mttr_minutes
FROM problem_history
WHERE resolved_at IS NOT NULL
AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY service;
```

**Recurring issues:**
```sql
SELECT 
    title,
    service,
    COUNT(*) as occurrences,
    MAX(timestamp) as last_occurrence
FROM problem_history
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY title, service
HAVING COUNT(*) > 3
ORDER BY occurrences DESC;
```

---

## Integration Examples

### Calling Terry from External Service

**Python Example:**
```python
import requests
import json

def trigger_terry_analysis(problem_data):
    """Trigger Terry problem analysis workflow"""
    
    url = "http://localhost:5678/webhook/problem-detected"
    headers = {
        "Content-Type": "application/json",
        "X-Webhook-Secret": "your-webhook-secret"
    }
    
    payload = {
        "service": problem_data["service"],
        "severity": problem_data["severity"],
        "description": problem_data["description"],
        "metrics": problem_data["metrics"]
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Problem reported: {result['problem_id']}")
        return result
    else:
        print(f"Error: {response.status_code}")
        return None

# Usage
problem = {
    "service": "API",
    "severity": "high",
    "description": "High error rate detected",
    "metrics": {
        "error_rate": 0.15,
        "requests_per_second": 100
    }
}

trigger_terry_analysis(problem)
```

---

### Querying Terry Status

**JavaScript Example:**
```javascript
const axios = require('axios');

async function getTerryStatus() {
  try {
    // Check health
    const health = await axios.get('http://localhost:5678/healthz');
    console.log('Terry Status:', health.data.status);
    
    // Get active workflows (requires auth)
    const workflows = await axios.get('http://localhost:5678/api/v1/workflows?active=true', {
      auth: {
        username: 'aiwhisperers',
        password: 'your-password'
      }
    });
    
    console.log('Active Workflows:', workflows.data.data.length);
    
    // Get recent executions
    const executions = await axios.get('http://localhost:5678/api/v1/executions', {
      auth: {
        username: 'aiwhisperers',
        password: 'your-password'
      },
      params: {
        limit: 10
      }
    });
    
    const successRate = executions.data.data.filter(e => e.finished && !e.stoppedAt).length / executions.data.data.length;
    console.log('Recent Success Rate:', (successRate * 100).toFixed(2) + '%');
    
  } catch (error) {
    console.error('Error checking Terry status:', error.message);
  }
}

getTerryStatus();
```

---

## Rate Limits & Quotas

### External APIs

| Service | Limit | Reset Period | Notes |
|---------|-------|--------------|-------|
| GitHub API | 5,000 requests | 1 hour | Per token |
| OpenAI GPT-4 | 3,500 tokens/min | 1 minute | Varies by tier |
| Gmail SMTP | 500 emails | 1 day | Per account |
| SendGrid Free | 100 emails | 1 day | Upgrade for more |
| WhatsApp Business | 1,000 messages | 1 day | Default tier |
| LinkedIn API | 100 requests | 1 day | Free tier |

### Terry Internal Limits

```javascript
// Configurable in workflows
const RATE_LIMITS = {
  github_checks_per_hour: 10,     // Max 10 GitHub API calls per hour
  openai_calls_per_hour: 30,      // Max 30 GPT-4 calls per hour
  email_alerts_per_hour: 20,      // Max 20 emails per hour
  whatsapp_messages_per_hour: 10  // Max 10 WhatsApp per hour
};
```

---

## Error Codes

### n8n API Errors

| Code | Error | Meaning |
|------|-------|---------|
| 400 | Bad Request | Invalid payload or parameters |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Workflow or execution not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | n8n server error |

### Terry Custom Errors

```javascript
const TERRY_ERRORS = {
  PROBLEM_ANALYSIS_FAILED: {
    code: 'TERRY_1001',
    message: 'GPT-4 analysis failed',
    retry: true
  },
  FIX_EXECUTION_FAILED: {
    code: 'TERRY_1002',
    message: 'Fix execution failed',
    retry: false
  },
  APPROVAL_EXPIRED: {
    code: 'TERRY_1003',
    message: 'Approval request expired',
    retry: false
  },
  INVALID_RISK_LEVEL: {
    code: 'TERRY_1004',
    message: 'Risk level too high for auto-fix',
    retry: false
  }
};
```

---

**API Reference v1.0**

*Complete technical reference for Terry integrations*

Last updated: 2025-11-03

