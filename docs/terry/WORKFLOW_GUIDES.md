# Terry Workflow Implementation Guide

Complete guide for implementing all 14 workflows across 4 phases.

## Table of Contents

- [Phase 1: Core Monitoring](#phase-1-core-monitoring-week-1)
- [Phase 2: Intelligence Layer](#phase-2-intelligence-layer-week-2)
- [Phase 3: Auto-Remediation](#phase-3-auto-remediation-week-3)
- [Phase 4: Advanced Integration](#phase-4-advanced-integration-week-4)

---

## Phase 1: Core Monitoring (Week 1)

### Overview

Phase 1 establishes the foundation: monitoring GitHub repositories, website uptime, and Docker containers with basic alerting.

**Goal**: Know when something goes wrong.

**Time**: 1 week  
**Complexity**: Beginner to Intermediate

---

### Workflow 1: GitHub Repository Health Check

**Purpose**: Monitor all 6 AI-Whisperers repositories for health, activity, and issues.

**Frequency**: Every 6 hours

**Repositories Monitored**:
1. work-hours-automated-reports
2. Company-Information
3. agentic-schemas
4. ai-whisperers-portfolio-website
5. WPG-Amenities
6. AI-Whisperers-Website

#### n8n Workflow Structure

```
[Schedule Trigger: Every 6 hours]
    ↓
[Set: Define Repository List]
    ↓
[Loop Over Items: For each repository]
    ↓
[HTTP Request: GitHub API - Get Repo Info]
    ↓
[HTTP Request: GitHub API - Get Recent Commits]
    ↓
[HTTP Request: GitHub API - Get Open Issues]
    ↓
[HTTP Request: GitHub API - Get CI/CD Status]
    ↓
[Function: Analyze Repository Health]
    ↓
[IF: Health Check Failed]
    ↓
[Send Email/WhatsApp Alert]
    ↓
[Set: Log Result]
```

#### Node Configuration

**1. Schedule Trigger**
```json
{
  "rule": {
    "interval": [
      {
        "field": "hours",
        "hoursInterval": 6
      }
    ]
  }
}
```

**2. Set: Define Repository List**
```javascript
return [
  {
    json: {
      repositories: [
        'work-hours-automated-reports',
        'Company-Information',
        'agentic-schemas',
        'ai-whisperers-portfolio-website',
        'WPG-Amenities',
        'AI-Whisperers-Website'
      ],
      org: 'Ai-Whisperers'
    }
  }
];
```

**3. Loop Over Items**
```json
{
  "options": {
    "loopMode": "items"
  }
}
```

**4. HTTP Request: Get Repo Info**
```json
{
  "method": "GET",
  "url": "https://api.github.com/repos/{{$json.org}}/{{$json.repo}}",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "githubApi",
  "options": {
    "response": {
      "response": {
        "fullResponse": false,
        "neverError": true
      }
    }
  }
}
```

**5. HTTP Request: Get Recent Commits**
```json
{
  "method": "GET",
  "url": "https://api.github.com/repos/{{$json.org}}/{{$json.repo}}/commits?per_page=10",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "githubApi"
}
```

**6. HTTP Request: Get Open Issues**
```json
{
  "method": "GET",
  "url": "https://api.github.com/repos/{{$json.org}}/{{$json.repo}}/issues?state=open",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "githubApi"
}
```

**7. HTTP Request: Get CI/CD Status**
```json
{
  "method": "GET",
  "url": "https://api.github.com/repos/{{$json.org}}/{{$json.repo}}/actions/runs?per_page=5",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "githubApi"
}
```

**8. Function: Analyze Repository Health**
```javascript
const repo = $input.all()[0].json;
const commits = $input.all()[1].json;
const issues = $input.all()[2].json;
const workflows = $input.all()[3].json;

// Health score calculation
let healthScore = 100;
let problems = [];

// Check 1: Recent activity (commits in last 7 days)
const now = new Date();
const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
const recentCommits = commits.filter(c => new Date(c.commit.author.date) > sevenDaysAgo);

if (recentCommits.length === 0 && repo.name !== 'WPG-Amenities') {
  healthScore -= 20;
  problems.push('No commits in last 7 days');
}

// Check 2: Open issues count
const openIssuesCount = issues.length;
if (openIssuesCount > 10) {
  healthScore -= 15;
  problems.push(`High open issues count: ${openIssuesCount}`);
}

// Check 3: Failed workflows
const failedWorkflows = workflows.workflow_runs?.filter(w => w.conclusion === 'failure') || [];
if (failedWorkflows.length > 0) {
  healthScore -= 25;
  problems.push(`${failedWorkflows.length} failed CI/CD runs`);
}

// Check 4: Security alerts (if API access available)
// Note: Requires GitHub Advanced Security

// Check 5: Last update
const lastUpdate = new Date(repo.updated_at);
const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
if (daysSinceUpdate > 30 && repo.name !== 'WPG-Amenities') {
  healthScore -= 10;
  problems.push(`No updates in ${Math.floor(daysSinceUpdate)} days`);
}

// Determine status
let status = 'healthy';
let priority = 'low';
if (healthScore < 50) {
  status = 'critical';
  priority = 'high';
} else if (healthScore < 75) {
  status = 'warning';
  priority = 'medium';
}

return {
  json: {
    repository: repo.name,
    health_score: healthScore,
    status: status,
    priority: priority,
    problems: problems,
    stats: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      open_issues: openIssuesCount,
      recent_commits: recentCommits.length,
      failed_workflows: failedWorkflows.length
    },
    timestamp: now.toISOString()
  }
};
```

**9. IF: Health Check Failed**
```json
{
  "conditions": {
    "string": [
      {
        "value1": "={{$json.status}}",
        "operation": "notEqual",
        "value2": "healthy"
      }
    ]
  }
}
```

**10. Send Email Alert**
```json
{
  "resource": "email",
  "operation": "send",
  "fromEmail": "terry@ai-whisperers.com",
  "toEmail": "alerts@ai-whisperers.com",
  "subject": "⚠️ GitHub Repository Health Alert: {{$json.repository}}",
  "emailFormat": "html",
  "message": "<h2>Repository Health Alert</h2><p><strong>Repository:</strong> {{$json.repository}}</p><p><strong>Health Score:</strong> {{$json.health_score}}/100</p><p><strong>Status:</strong> {{$json.status}}</p><h3>Problems Detected:</h3><ul>{{$json.problems.map(p => '<li>' + p + '</li>').join('')}}</ul><h3>Statistics:</h3><ul><li>Stars: {{$json.stats.stars}}</li><li>Open Issues: {{$json.stats.open_issues}}</li><li>Recent Commits (7d): {{$json.stats.recent_commits}}</li><li>Failed Workflows: {{$json.stats.failed_workflows}}</li></ul><p><a href='https://github.com/Ai-Whisperers/{{$json.repository}}'>View on GitHub</a></p>"
}
```

#### Expected Output

Healthy repository:
```json
{
  "repository": "agentic-schemas",
  "health_score": 100,
  "status": "healthy",
  "priority": "low",
  "problems": [],
  "stats": {
    "stars": 15,
    "forks": 3,
    "open_issues": 2,
    "recent_commits": 5,
    "failed_workflows": 0
  }
}
```

Warning status:
```json
{
  "repository": "Company-Information",
  "health_score": 70,
  "status": "warning",
  "priority": "medium",
  "problems": [
    "2 failed CI/CD runs"
  ],
  "stats": {
    "stars": 0,
    "forks": 0,
    "open_issues": 5,
    "recent_commits": 8,
    "failed_workflows": 2
  }
}
```

---

### Workflow 2: Website Uptime Monitoring

**Purpose**: Monitor production website for availability, performance, and errors.

**Frequency**: Every 15 minutes

**Monitored**: https://ai-whisperers-portfolio-website.vercel.app/

#### n8n Workflow Structure

```
[Schedule Trigger: Every 15 minutes]
    ↓
[HTTP Request: GET Website]
    ↓
[Function: Analyze Response]
    ↓
[Switch: Route by Status]
    ├─ [200 OK + Fast] → Silent (log only)
    ├─ [200 OK + Slow] → Performance Warning
    ├─ [4xx Error] → Error Alert
    └─ [5xx Error] → Critical Alert (WhatsApp)
    ↓
[Send Alert if needed]
    ↓
[Set: Log to Database]
```

#### Node Configuration

**1. Schedule Trigger**
```json
{
  "rule": {
    "interval": [
      {
        "field": "minutes",
        "minutesInterval": 15
      }
    ]
  }
}
```

**2. HTTP Request: GET Website**
```json
{
  "method": "GET",
  "url": "https://ai-whisperers-portfolio-website.vercel.app/",
  "options": {
    "redirect": {
      "redirect": {
        "followRedirects": true,
        "maxRedirects": 3
      }
    },
    "response": {
      "response": {
        "fullResponse": true,
        "neverError": true
      }
    },
    "timeout": 10000
  }
}
```

**3. Function: Analyze Response**
```javascript
const response = $input.first().json;
const responseTime = $node["HTTP Request"].runExecutionTime;

// Parse response
const statusCode = response.statusCode;
const headers = response.headers;
const body = response.body;

// Performance check
const isSlowResponse = responseTime > 3000; // 3 seconds
const isVerySlowResponse = responseTime > 5000; // 5 seconds

// Content check
const hasExpectedContent = body && body.includes('AI-Whisperers');
const hasError = body && (body.includes('error') || body.includes('Error'));

// SSL check
const sslValid = true; // Check headers for SSL info if available

// Determine status
let status = 'healthy';
let priority = 'low';
let message = 'Website is operational';
let problems = [];

if (statusCode >= 500) {
  status = 'critical';
  priority = 'critical';
  message = 'Website is DOWN (5xx error)';
  problems.push(`HTTP ${statusCode} error`);
} else if (statusCode >= 400) {
  status = 'error';
  priority = 'high';
  message = 'Website returning client errors';
  problems.push(`HTTP ${statusCode} error`);
} else if (statusCode === 200) {
  if (!hasExpectedContent) {
    status = 'warning';
    priority = 'medium';
    message = 'Website content seems incorrect';
    problems.push('Expected content not found');
  }
  if (isVerySlowResponse) {
    status = 'warning';
    priority = 'medium';
    message = 'Website is very slow';
    problems.push(`Response time: ${responseTime}ms (> 5s)`);
  } else if (isSlowResponse) {
    status = 'warning';
    priority = 'low';
    message = 'Website performance degraded';
    problems.push(`Response time: ${responseTime}ms (> 3s)`);
  }
}

return {
  json: {
    url: 'https://ai-whisperers-portfolio-website.vercel.app/',
    status: status,
    priority: priority,
    status_code: statusCode,
    response_time_ms: responseTime,
    message: message,
    problems: problems,
    has_expected_content: hasExpectedContent,
    timestamp: new Date().toISOString()
  }
};
```

**4. Switch: Route by Status**
```json
{
  "mode": "rules",
  "rules": [
    {
      "output": 0,
      "conditions": {
        "string": [
          {
            "value1": "={{$json.status}}",
            "operation": "equals",
            "value2": "healthy"
          }
        ]
      }
    },
    {
      "output": 1,
      "conditions": {
        "string": [
          {
            "value1": "={{$json.status}}",
            "operation": "equals",
            "value2": "warning"
          }
        ]
      }
    },
    {
      "output": 2,
      "conditions": {
        "string": [
          {
            "value1": "={{$json.status}}",
            "operation": "equals",
            "value2": "error"
          }
        ]
      }
    },
    {
      "output": 3,
      "conditions": {
        "string": [
          {
            "value1": "={{$json.status}}",
            "operation": "equals",
            "value2": "critical"
          }
        ]
      }
    }
  ]
}
```

**5a. Silent (Log Only)**
```javascript
// Just log, no alert
return $input.all();
```

**5b. Performance Warning (Email)**
```json
{
  "resource": "email",
  "operation": "send",
  "subject": "⚠️ Website Performance Warning",
  "message": "Website response time: {{$json.response_time_ms}}ms\n\nProblems:\n{{$json.problems.join('\n')}}"
}
```

**5c. Error Alert (Email)**
```json
{
  "resource": "email",
  "operation": "send",
  "subject": "🚨 Website Error Alert",
  "message": "Website returned error: HTTP {{$json.status_code}}\n\nProblems:\n{{$json.problems.join('\n')}}"
}
```

**5d. Critical Alert (WhatsApp + Email)**
```json
{
  "method": "POST",
  "url": "https://graph.facebook.com/v18.0/{{$env.WHATSAPP_PHONE_NUMBER_ID}}/messages",
  "body": {
    "messaging_product": "whatsapp",
    "to": "{{$env.WHATSAPP_RECIPIENT}}",
    "type": "text",
    "text": {
      "body": "🚨 CRITICAL: Website is DOWN!\n\nStatus: HTTP {{$json.status_code}}\nTime: {{$json.timestamp}}\n\nCheck immediately!"
    }
  }
}
```

---

### Workflow 3: Docker Container Health

**Purpose**: Monitor Docker containers for health, resource usage, and failures.

**Frequency**: Every 30 minutes

**Requirements**: SSH access to server running Docker

#### n8n Workflow Structure

```
[Schedule Trigger: Every 30 minutes]
    ↓
[SSH: Execute 'docker ps -a']
    ↓
[Function: Parse Container List]
    ↓
[Loop: For each container]
    ↓
[SSH: Execute 'docker inspect {container}']
    ↓
[SSH: Execute 'docker stats --no-stream {container}']
    ↓
[Function: Analyze Container Health]
    ↓
[IF: Container Unhealthy]
    ↓
[Send Alert]
    ↓
[IF: Auto-restart enabled AND safe]
    ↓
[SSH: Execute 'docker restart {container}']
```

#### Node Configuration

**1. Schedule Trigger**
```json
{
  "rule": {
    "interval": [
      {
        "field": "minutes",
        "minutesInterval": 30
      }
    ]
  }
}
```

**2. SSH: List Containers**
```json
{
  "command": "docker ps -a --format '{{.ID}}|{{.Names}}|{{.Status}}|{{.Image}}'",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "sshPassword"
}
```

**3. Function: Parse Container List**
```javascript
const output = $input.first().json.stdout;
const lines = output.trim().split('\n');

const containers = lines.map(line => {
  const [id, name, status, image] = line.split('|');
  return {
    id: id,
    name: name,
    status: status,
    image: image,
    is_running: status.startsWith('Up')
  };
});

return containers.map(c => ({ json: c }));
```

**4. SSH: Inspect Container**
```json
{
  "command": "docker inspect {{$json.id}}"
}
```

**5. SSH: Get Stats**
```json
{
  "command": "docker stats --no-stream --format '{{.CPUPerc}}|{{.MemPerc}}|{{.MemUsage}}|{{.NetIO}}' {{$json.id}}"
}
```

**6. Function: Analyze Container Health**
```javascript
const container = $input.all()[0].json;
const inspectData = JSON.parse($input.all()[1].json.stdout)[0];
const statsData = $input.all()[2].json.stdout.trim().split('|');

// Parse stats
const cpuPercent = parseFloat(statsData[0]);
const memPercent = parseFloat(statsData[1]);
const memUsage = statsData[2];
const netIO = statsData[3];

// Health checks
let healthScore = 100;
let problems = [];
let status = 'healthy';
let priority = 'low';

// Check 1: Container running
if (!container.is_running) {
  healthScore -= 50;
  problems.push('Container is stopped');
  status = 'critical';
  priority = 'high';
}

// Check 2: Restart count
const restartCount = inspectData.RestartCount || 0;
if (restartCount > 5) {
  healthScore -= 20;
  problems.push(`High restart count: ${restartCount}`);
  status = 'warning';
  priority = 'medium';
}

// Check 3: CPU usage
if (cpuPercent > 90) {
  healthScore -= 15;
  problems.push(`High CPU usage: ${cpuPercent}%`);
  if (status === 'healthy') status = 'warning';
}

// Check 4: Memory usage
if (memPercent > 90) {
  healthScore -= 15;
  problems.push(`High memory usage: ${memPercent}%`);
  if (status === 'healthy') status = 'warning';
}

// Check 5: Exit code (if stopped)
if (!container.is_running && inspectData.State.ExitCode !== 0) {
  problems.push(`Exit code: ${inspectData.State.ExitCode}`);
  status = 'critical';
  priority = 'high';
}

return {
  json: {
    container_id: container.id,
    container_name: container.name,
    image: container.image,
    status: status,
    priority: priority,
    is_running: container.is_running,
    health_score: healthScore,
    problems: problems,
    metrics: {
      cpu_percent: cpuPercent,
      mem_percent: memPercent,
      mem_usage: memUsage,
      restart_count: restartCount,
      exit_code: inspectData.State.ExitCode
    },
    can_auto_restart: !container.is_running && restartCount < 3,
    timestamp: new Date().toISOString()
  }
};
```

**7. IF: Container Unhealthy**
```json
{
  "conditions": {
    "string": [
      {
        "value1": "={{$json.status}}",
        "operation": "notEqual",
        "value2": "healthy"
      }
    ]
  }
}
```

**8. Send Alert**
```json
{
  "resource": "email",
  "operation": "send",
  "subject": "⚠️ Docker Container Alert: {{$json.container_name}}",
  "message": "Container: {{$json.container_name}}\nStatus: {{$json.status}}\nRunning: {{$json.is_running}}\n\nProblems:\n{{$json.problems.join('\n')}}\n\nMetrics:\nCPU: {{$json.metrics.cpu_percent}}%\nMemory: {{$json.metrics.mem_percent}}%\nRestart Count: {{$json.metrics.restart_count}}"
}
```

**9. IF: Can Auto-Restart**
```json
{
  "conditions": {
    "boolean": [
      {
        "value1": "={{$json.can_auto_restart}}",
        "value2": true
      }
    ]
  }
}
```

**10. SSH: Restart Container**
```json
{
  "command": "docker restart {{$json.container_id}} && echo 'Container restarted successfully'"
}
```

---

## Phase 2: Intelligence Layer (Week 2)

### Overview

Phase 2 adds GPT-4 powered analysis, smart filtering, and structured outputs.

**Goal**: Understand WHY things go wrong and propose solutions.

**Time**: 1 week  
**Complexity**: Intermediate to Advanced

---

### Workflow 4: GPT-4 Problem Analysis

**Purpose**: Use AI to analyze problems, identify root causes, and propose solutions.

**Trigger**: When problems detected by Phase 1 workflows

#### n8n Workflow Structure

```
[Webhook: Receive Problem]
    ↓
[Function: Gather Context]
    ↓
[OpenAI: GPT-4 Analysis]
    ↓
[Function: Parse AI Response]
    ↓
[Function: Calculate Risk Level]
    ↓
[Route by Risk]
    ├─ Low Risk → Auto-fix eligible
    ├─ Medium Risk → Approval needed
    └─ High Risk → Human only
```

#### GPT-4 System Prompt

```javascript
const systemPrompt = `You are Terry, an AI IT engineer for AI-Whisperers, a 3-month-old startup in Paraguay.

COMPANY CONTEXT:
- Tech Stack: Python, TypeScript, FastAPI, NestJS, Next.js, Docker
- Infrastructure: 6 GitHub repos, Vercel hosting, Docker containers
- Team: 3 co-founders (Kyrian, Ivan, Jonathan)
- Philosophy: "If you do it twice, automate it"

YOUR ROLE:
Analyze infrastructure problems, identify root causes, and propose specific, actionable solutions.

RESPONSE FORMAT (JSON):
{
  "severity": "low|medium|high|critical",
  "root_cause": "brief technical explanation",
  "impact": "who/what is affected",
  "proposed_solution": {
    "description": "what needs to be done",
    "commands": ["exact command 1", "exact command 2"],
    "estimated_duration": "time estimate"
  },
  "risk_level": "low|medium|high",
  "can_auto_fix": true|false,
  "reasoning": "why this solution works",
  "prevention": "how to prevent this in future"
}

ANALYSIS GUIDELINES:
1. Be specific and technical
2. Provide exact commands when possible
3. Consider the startup context (simple solutions preferred)
4. Assess risk realistically
5. Think about prevention

RISK ASSESSMENT:
- Low: No data loss, easily reversible, affects single container
- Medium: May affect service, requires restart, moderate complexity
- High: Data risk, affects production, complex changes, security implications

AUTO-FIX ELIGIBLE (Low Risk Only):
- Restart stopped container
- Clear cache/temp files
- Restart web service
- Basic configuration fixes

NEVER AUTO-FIX (High Risk):
- Database operations
- Delete files/data
- Security changes
- Production configuration
- Anything irreversible`;
```

#### Node Configuration

**1. Webhook: Receive Problem**
```json
{
  "path": "problem-detected",
  "responseMode": "responseNode",
  "options": {
    "noResponseBody": false
  }
}
```

**2. Function: Gather Context**
```javascript
const problem = $input.first().json;

// Gather additional context
let context = {
  problem_description: problem.description || problem.message,
  service: problem.service,
  error_details: problem.error_details || problem.problems,
  metrics: problem.metrics || {},
  timestamp: problem.timestamp,
  history: []  // TODO: Query problem history database
};

// Service-specific context
if (problem.service === 'GitHub') {
  context.repository = problem.repository;
  context.recent_commits = problem.recent_commits || [];
  context.failed_workflows = problem.failed_workflows || [];
}

if (problem.service === 'Docker') {
  context.container_name = problem.container_name;
  context.container_image = problem.image;
  context.restart_count = problem.metrics?.restart_count;
  context.exit_code = problem.metrics?.exit_code;
}

if (problem.service === 'Website') {
  context.url = problem.url;
  context.status_code = problem.status_code;
  context.response_time = problem.response_time_ms;
}

return {
  json: {
    problem: problem,
    context: context
  }
};
```

**3. OpenAI: GPT-4 Analysis**
```json
{
  "resource": "chat",
  "operation": "message",
  "model": "gpt-4-turbo-preview",
  "messages": {
    "values": [
      {
        "role": "system",
        "content": "={{$node[\"Function: Gather Context\"].json.systemPrompt}}"
      },
      {
        "role": "user",
        "content": "=PROBLEM DETECTED:\n\nService: {{$json.problem.service}}\nDescription: {{$json.problem_description}}\nError Details: {{JSON.stringify($json.error_details)}}\n\nContext:\n{{JSON.stringify($json.context, null, 2)}}\n\nPlease analyze this problem and provide your response in the specified JSON format."
      }
    ]
  },
  "options": {
    "temperature": 0.3,
    "maxTokens": 1000,
    "responseFormat": "json_object"
  }
}
```

**4. Function: Parse AI Response**
```javascript
const aiResponse = $input.first().json.choices[0].message.content;
const analysis = JSON.parse(aiResponse);

// Validate and enrich
const enrichedAnalysis = {
  ...analysis,
  ai_analysis_time: new Date().toISOString(),
  original_problem: $node["Function: Gather Context"].json.problem,
  confidence: analysis.reasoning.length > 50 ? 'high' : 'medium'
};

return {
  json: enrichedAnalysis
};
```

**5. Function: Calculate Risk Level**
```javascript
const analysis = $input.first().json;

// Additional risk calculation beyond AI assessment
let finalRisk = analysis.risk_level;

// Override to higher risk if certain conditions
if (analysis.proposed_solution.commands.some(cmd => 
    cmd.includes('rm ') || 
    cmd.includes('delete') || 
    cmd.includes('drop')
)) {
  finalRisk = 'high';
  analysis.can_auto_fix = false;
}

if (analysis.severity === 'critical' && finalRisk === 'low') {
  finalRisk = 'medium'; // Critical issues shouldn't be low risk
}

// Add approval requirement
analysis.requires_approval = finalRisk !== 'low' || !analysis.can_auto_fix;

return {
  json: analysis
};
```

**6. Route by Risk**
```json
{
  "mode": "rules",
  "rules": [
    {
      "output": 0,
      "conditions": {
        "string": [
          {
            "value1": "={{$json.risk_level}}",
            "operation": "equals",
            "value2": "low"
          }
        ],
        "boolean": [
          {
            "value1": "={{$json.can_auto_fix}}",
            "value2": true
          }
        ]
      }
    },
    {
      "output": 1,
      "conditions": {
        "string": [
          {
            "value1": "={{$json.risk_level}}",
            "operation": "equals",
            "value2": "medium"
          }
        ]
      }
    },
    {
      "output": 2,
      "conditions": {
        "string": [
          {
            "value1": "={{$json.risk_level}}",
            "operation": "equals",
            "value2": "high"
          }
        ]
      }
    }
  ]
}
```

---

### Workflow 5: Smart Alert Filtering

**Purpose**: Reduce alert fatigue by intelligent filtering and prioritization.

**Strategy**:
- Suppress duplicate alerts within time window
- Batch non-critical alerts into digests
- Escalate if problem persists
- Learn from past false positives

#### n8n Workflow Structure

```
[Any Alert Trigger]
    ↓
[Function: Calculate Priority Score]
    ↓
[Redis/Cache: Check for Similar Recent Alerts]
    ↓
[IF: Duplicate within 1 hour] → Suppress
    ↓
[Function: Determine Alert Channel]
    ↓
[Route to Appropriate Channel]
```

#### Priority Scoring Algorithm

```javascript
function calculatePriorityScore(alert) {
  let score = 0;
  
  // Factor 1: Severity (0-40 points)
  const severityScores = {
    'critical': 40,
    'high': 30,
    'medium': 20,
    'low': 10
  };
  score += severityScores[alert.severity] || 10;
  
  // Factor 2: Impact (0-30 points)
  if (alert.service === 'Website' && alert.affects_users) {
    score += 30; // User-facing issues are high priority
  } else if (alert.service === 'GitHub') {
    score += 10; // Development issues are lower priority
  } else {
    score += 20;
  }
  
  // Factor 3: Time of day (0-10 points)
  const hour = new Date().getHours();
  const isBusinessHours = hour >= 9 && hour < 18;
  if (!isBusinessHours && alert.severity !== 'critical') {
    score -= 10; // Lower priority outside business hours
  }
  
  // Factor 4: Frequency (0-20 points)
  if (alert.occurrence_count > 1) {
    score += Math.min(alert.occurrence_count * 5, 20); // Escalate repeating issues
  }
  
  // Factor 5: Can auto-fix? (-10 points)
  if (alert.can_auto_fix) {
    score -= 10; // Lower urgency if can be auto-fixed
  }
  
  return Math.max(0, Math.min(100, score)); // Clamp to 0-100
}
```

**Priority Score to Action**:
- **80-100**: Critical → WhatsApp immediately
- **60-79**: High → Email immediately
- **40-59**: Medium → Email within 1 hour (batch)
- **20-39**: Low → Daily digest email
- **0-19**: Info → Log only

---

### Workflow 6: Structured Output Formatting

**Purpose**: Standardize all outputs for consistent logging, display, and analysis.

#### Standard Output Schema

```typescript
interface TerryAlert {
  // Identity
  alert_id: string;  // UUID
  alert_type: 'monitoring' | 'analysis' | 'action' | 'report';
  
  // Classification
  service: 'GitHub' | 'Website' | 'Docker' | 'API' | 'Deployment';
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'detected' | 'analyzing' | 'fixing' | 'resolved' | 'escalated';
  
  // Content
  title: string;
  description: string;
  problems: string[];
  error_details?: string;
  
  // Analysis (if available)
  root_cause?: string;
  proposed_solution?: {
    description: string;
    commands: string[];
    estimated_duration: string;
  };
  risk_level?: 'low' | 'medium' | 'high';
  can_auto_fix: boolean;
  
  // Metadata
  timestamp: string;  // ISO 8601
  detected_by: string;  // Workflow name
  affected_resources: string[];
  metrics?: Record<string, any>;
  
  // Actions
  actions_taken: string[];
  requires_approval: boolean;
  approval_status?: 'pending' | 'approved' | 'denied' | 'expired';
  
  // Tracking
  occurrence_count: number;
  first_seen: string;
  last_seen: string;
  resolved_at?: string;
  resolution_time_seconds?: number;
}
```

#### Function: Format Output

```javascript
function formatTerryAlert(data) {
  const now = new Date().toISOString();
  
  return {
    // Generate UUID
    alert_id: generateUUID(),
    alert_type: data.alert_type || 'monitoring',
    
    // Classification
    service: data.service,
    severity: data.severity || 'medium',
    priority: calculatePriority(data),
    status: data.status || 'detected',
    
    // Content
    title: generateTitle(data),
    description: data.description || data.message,
    problems: Array.isArray(data.problems) ? data.problems : [data.problems],
    error_details: data.error_details,
    
    // Analysis
    root_cause: data.root_cause,
    proposed_solution: data.proposed_solution,
    risk_level: data.risk_level,
    can_auto_fix: data.can_auto_fix || false,
    
    // Metadata
    timestamp: now,
    detected_by: data.workflow_name,
    affected_resources: data.affected_resources || [],
    metrics: data.metrics || {},
    
    // Actions
    actions_taken: data.actions_taken || [],
    requires_approval: data.requires_approval || false,
    
    // Tracking
    occurrence_count: data.occurrence_count || 1,
    first_seen: data.first_seen || now,
    last_seen: now
  };
}
```

---

## Phase 3: Auto-Remediation (Week 3)

### Overview

Phase 3 implements safe auto-fixing with human approval workflows.

**Goal**: Fix problems automatically when safe, ask permission when risky.

**Time**: 1 week  
**Complexity**: Advanced

---

### Workflow 7: Safe Auto-Fix Library

**Purpose**: Execute pre-approved, safe fixes automatically.

#### Auto-Fix Categories

**Category 1: Container Management**
- Restart stopped container
- Clear container logs
- Prune unused images/volumes

**Category 2: Performance**
- Clear application cache
- Restart web service
- Clear temp files

**Category 3: Network**
- Restart networking service
- Clear DNS cache
- Release/renew DHCP

#### Fix Script: Restart Container

```bash
#!/bin/bash
# scripts/fix-restart-container.sh

set -euo pipefail

CONTAINER_ID=$1
CONTAINER_NAME=$2

echo "[$(date)] Starting container restart: $CONTAINER_NAME ($CONTAINER_ID)"

# Pre-checks
if ! docker ps -a | grep -q "$CONTAINER_ID"; then
    echo "ERROR: Container $CONTAINER_ID not found"
    exit 1
fi

# Get current state
CURRENT_STATE=$(docker inspect --format='{{.State.Status}}' "$CONTAINER_ID")
echo "Current state: $CURRENT_STATE"

# Stop container (if running)
if [ "$CURRENT_STATE" == "running" ]; then
    echo "Stopping container..."
    docker stop "$CONTAINER_ID"
    sleep 2
fi

# Start container
echo "Starting container..."
docker start "$CONTAINER_ID"

# Wait and verify
sleep 5
NEW_STATE=$(docker inspect --format='{{.State.Status}}' "$CONTAINER_ID")

if [ "$NEW_STATE" == "running" ]; then
    echo "SUCCESS: Container restarted successfully"
    echo "New state: $NEW_STATE"
    
    # Get container health
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_ID" 2>/dev/null || echo "no healthcheck")
    echo "Health: $HEALTH"
    
    exit 0
else
    echo "ERROR: Container failed to start"
    echo "State: $NEW_STATE"
    
    # Get logs for debugging
    echo "Last 20 log lines:"
    docker logs --tail 20 "$CONTAINER_ID"
    
    exit 1
fi
```

#### n8n Workflow: Execute Auto-Fix

```
[Problem Detected with can_auto_fix=true]
    ↓
[Function: Select Fix Script]
    ↓
[Function: Prepare Fix Parameters]
    ↓
[SSH: Execute Fix Script]
    ↓
[Function: Verify Fix Success]
    ↓
[IF: Success]
    ├─ → [Log Success + Send Report]
    └─ → [Update Problem Status: Resolved]
[ELSE: Failed]
    ├─ → [Log Failure + Alert]
    └─ → [Escalate to Human]
```

---

### Workflow 8: Human-in-the-Loop Approval

**Purpose**: Request human approval for medium/high risk fixes.

**Channels**: Email with approval links, WhatsApp with reply commands

#### n8n Workflow Structure

```
[Problem Analyzed + requires_approval=true]
    ↓
[Function: Generate Approval Request]
    ↓
[Send Approval Request (Email + WhatsApp)]
    ↓
[Wait for Response Node - Timeout 30 min]
    ↓
[IF: Approved] → Execute Fix
[IF: Denied] → Escalate + Log
[IF: Timeout] → Alert + Do Nothing
```

#### Email Approval Template

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #17a2b8; color: white; padding: 20px; border-radius: 5px; }
        .content { padding: 20px; background: #f8f9fa; margin: 20px 0; border-radius: 5px; }
        .problem { background: #fff3cd; padding: 15px; margin: 10px 0; border-left: 4px solid #ffc107; }
        .solution { background: #d1ecf1; padding: 15px; margin: 10px 0; border-left: 4px solid #17a2b8; }
        .risk-low { color: #28a745; }
        .risk-medium { color: #ffc107; }
        .risk-high { color: #dc3545; }
        .commands { background: #e9ecef; padding: 10px; font-family: monospace; white-space: pre-wrap; }
        .actions { padding: 20px; text-align: center; }
        .btn { display: inline-block; padding: 12px 30px; margin: 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .btn-approve { background: #28a745; color: white; }
        .btn-deny { background: #dc3545; color: white; }
        .btn-info { background: #17a2b8; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h2>⚠️ Terry Approval Required</h2>
        <p>Request ID: {{alert_id}}</p>
        <p>Time: {{timestamp}}</p>
    </div>
    
    <div class="content">
        <h3>Problem Detected</h3>
        <div class="problem">
            <p><strong>Service:</strong> {{service}}</p>
            <p><strong>Severity:</strong> {{severity}}</p>
            <p><strong>Description:</strong> {{description}}</p>
            <p><strong>Problems:</strong></p>
            <ul>
                {{#each problems}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </div>
        
        <h3>AI Analysis</h3>
        <p><strong>Root Cause:</strong> {{root_cause}}</p>
        <p><strong>Impact:</strong> {{impact}}</p>
        
        <h3>Proposed Solution</h3>
        <div class="solution">
            <p><strong>Risk Level:</strong> <span class="risk-{{risk_level}}">{{risk_level}}</span></p>
            <p><strong>Description:</strong> {{proposed_solution.description}}</p>
            <p><strong>Estimated Duration:</strong> {{proposed_solution.estimated_duration}}</p>
            
            <p><strong>Commands to execute:</strong></p>
            <div class="commands">{{#each proposed_solution.commands}}{{this}}
{{/each}}</div>
            
            <p><strong>Reasoning:</strong> {{reasoning}}</p>
        </div>
    </div>
    
    <div class="actions">
        <a href="{{approval_url}}/approve/{{alert_id}}" class="btn btn-approve">✅ APPROVE & EXECUTE</a>
        <a href="{{approval_url}}/deny/{{alert_id}}" class="btn btn-deny">❌ DENY</a>
        <a href="{{approval_url}}/info/{{alert_id}}" class="btn btn-info">ℹ️ MORE INFO</a>
        
        <p style="margin-top: 20px; color: #666;">
            <small>This request will expire in 30 minutes.<br>
            After expiration, manual intervention will be required.</small>
        </p>
    </div>
    
    <hr style="margin: 30px 0;">
    <p style="text-align: center; color: #666;">
        <small>Sent by Terry AI Agent | AI-Whisperers<br>
        Reply to this email with APPROVE, DENY, or INFO</small>
    </p>
</body>
</html>
```

#### WhatsApp Approval Template

```
⚠️ *TERRY APPROVAL REQUIRED*

Request ID: {{alert_id}}
Service: {{service}}
Severity: {{severity}}

*Problem:*
{{description}}

*Root Cause:*
{{root_cause}}

*Proposed Fix:*
{{proposed_solution.description}}

Risk: {{risk_level}}
Duration: ~{{proposed_solution.estimated_duration}}

*Commands:*
```
{{proposed_solution.commands.join('\n')}}
```

*Reply with:*
• YES - Approve and execute fix
• NO - Deny and escalate
• INFO - Get detailed information

⏱️ Expires in 30 minutes

- Terry AI Agent
```

#### Approval Webhook Handler

```javascript
// n8n Webhook node to handle approval responses

const method = $input.first().json.method;
const alert_id = $input.first().json.alert_id;
const action = $input.first().json.action; // 'approve', 'deny', 'info'

// Validate request
if (!alert_id) {
  return {
    json: {
      status: 'error',
      message: 'Missing alert_id'
    }
  };
}

// Check if still valid (not expired)
const approval_request = await getApprovalRequest(alert_id);
if (!approval_request) {
  return {
    json: {
      status: 'error',
      message: 'Approval request not found or expired'
    }
  };
}

const now = new Date();
const requested_at = new Date(approval_request.timestamp);
const elapsed_minutes = (now - requested_at) / 1000 / 60;

if (elapsed_minutes > 30) {
  return {
    json: {
      status: 'expired',
      message: 'Approval request expired (> 30 minutes)'
    }
  };
}

// Process action
if (action === 'approve') {
  // Update status
  await updateApprovalStatus(alert_id, 'approved');
  
  // Trigger fix execution workflow
  await triggerWorkflow('execute-fix', {
    alert_id: alert_id,
    approved_by: $input.first().json.approved_by,
    approved_at: now.toISOString()
  });
  
  return {
    json: {
      status: 'approved',
      message: 'Fix approved and execution started',
      alert_id: alert_id
    }
  };
}

else if (action === 'deny') {
  await updateApprovalStatus(alert_id, 'denied');
  
  // Trigger escalation
  await triggerWorkflow('escalate-to-human', {
    alert_id: alert_id,
    denied_by: $input.first().json.denied_by,
    denied_at: now.toISOString()
  });
  
  return {
    json: {
      status: 'denied',
      message: 'Fix denied, escalating to human',
      alert_id: alert_id
    }
  };
}

else if (action === 'info') {
  // Return detailed information
  return {
    json: {
      status: 'info',
      approval_request: approval_request,
      alert_id: alert_id
    }
  };
}
```

---

### Workflow 9: Risk Assessment Logic

**Purpose**: Comprehensive risk evaluation before any automated action.

#### Risk Factors Matrix

```javascript
function assessRisk(problem, solution) {
  let riskScore = 0;
  let riskFactors = [];
  
  // Factor 1: Data Impact (0-30 points)
  if (solution.commands.some(cmd => 
      cmd.includes('rm ') || 
      cmd.includes('delete') || 
      cmd.includes('drop') ||
      cmd.includes('truncate')
  )) {
    riskScore += 30;
    riskFactors.push('Potential data loss');
  }
  
  // Factor 2: Service Impact (0-25 points)
  if (problem.service === 'Website' || problem.affects_users) {
    riskScore += 25;
    riskFactors.push('User-facing service affected');
  } else if (problem.service === 'Docker') {
    riskScore += 10;
    riskFactors.push('Development environment only');
  }
  
  // Factor 3: Reversibility (0-20 points)
  if (!solution.is_reversible) {
    riskScore += 20;
    riskFactors.push('Changes not easily reversible');
  }
  
  // Factor 4: Complexity (0-15 points)
  const commandCount = solution.commands.length;
  if (commandCount > 5) {
    riskScore += 15;
    riskFactors.push(`Complex fix (${commandCount} commands)`);
  } else if (commandCount > 2) {
    riskScore += 5;
  }
  
  // Factor 5: Security Impact (0-10 points)
  if (solution.commands.some(cmd =>
      cmd.includes('chmod') ||
      cmd.includes('chown') ||
      cmd.includes('sudo') ||
      cmd.includes('password')
  )) {
    riskScore += 10;
    riskFactors.push('Security-related changes');
  }
  
  // Determine final risk level
  let riskLevel;
  if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }
  
  // Override: Always high risk if production database
  if (problem.service === 'Database' && problem.environment === 'production') {
    riskLevel = 'high';
    riskFactors.push('Production database - always high risk');
  }
  
  return {
    risk_level: riskLevel,
    risk_score: riskScore,
    risk_factors: riskFactors,
    can_auto_fix: riskLevel === 'low' && riskScore < 15,
    requires_approval: riskLevel !== 'low'
  };
}
```

---

## Phase 4: Advanced Integration (Week 4)

### Overview

Phase 4 adds advanced features: GitHub automation, deployment monitoring, LinkedIn updates, and reporting.

**Goal**: Complete automation ecosystem with learning and reporting.

**Time**: 1 week  
**Complexity**: Advanced

---

### Workflow 10: GitHub Automation

**Purpose**: Automate issue triage, PR management, and repository maintenance.

#### Features

1. **Auto-triage new issues**
2. **Label PRs automatically**
3. **Auto-assign team members**
4. **Dependency update PRs**
5. **Stale issue management**

#### Sub-workflow: Issue Triage

```
[GitHub Webhook: New Issue Created]
    ↓
[Function: Extract Issue Details]
    ↓
[GPT-4: Analyze Issue Content]
    ↓
[Function: Determine Labels & Assignment]
    ↓
[GitHub API: Add Labels]
    ↓
[GitHub API: Assign Team Member]
    ↓
[GitHub API: Add to Project Board]
    ↓
[Send Slack Notification]
```

**GPT-4 Issue Analysis Prompt**:
```
Analyze this GitHub issue and classify it:

Title: {{issue.title}}
Body: {{issue.body}}
Author: {{issue.user.login}}

Provide classification in JSON:
{
  "type": "bug|feature|question|documentation",
  "priority": "low|medium|high|critical",
  "labels": ["array", "of", "labels"],
  "assign_to": "kyrian|ivan|jonathan|unassigned",
  "reasoning": "brief explanation",
  "estimated_effort": "small|medium|large"
}

Context:
- Kyrian: Full-stack, DevOps
- Ivan: AI/ML, Architecture
- Jonathan: Backend, APIs
```

---

### Workflow 11: Vercel Deployment Monitoring

**Purpose**: Monitor deployments, track performance, catch regressions.

#### Workflow Structure

```
[Vercel Webhook: Deployment Event]
    ↓
[Function: Parse Deployment Info]
    ↓
[Switch: Deployment Status]
    ├─ Success → Continue
    └─ Failed → Alert + Stop
    ↓
[Wait: 30 seconds for deployment to stabilize]
    ↓
[HTTP: Test Deployed Site]
    ↓
[HTTP: Run Lighthouse Performance Test]
    ↓
[Function: Compare with Baseline]
    ↓
[IF: Performance Regression]
    ↓
[Alert Team + Create GitHub Issue]
```

#### Lighthouse Integration

```javascript
// Use Google Lighthouse API or lighthouse-ci

const lighthouseResult = await runLighthouse({
  url: deploymentUrl,
  categories: ['performance', 'accessibility', 'best-practices', 'seo']
});

const scores = {
  performance: lighthouseResult.categories.performance.score * 100,
  accessibility: lighthouseResult.categories.accessibility.score * 100,
  bestPractices: lighthouseResult.categories['best-practices'].score * 100,
  seo: lighthouseResult.categories.seo.score * 100
};

// Get baseline from previous deployment
const baseline = await getBaselineScores();

// Check for regressions
const regressions = [];
for (const [category, score] of Object.entries(scores)) {
  const baselineScore = baseline[category];
  const diff = score - baselineScore;
  
  if (diff < -10) {  // More than 10 point drop
    regressions.push({
      category: category,
      current: score,
      baseline: baselineScore,
      diff: diff
    });
  }
}

if (regressions.length > 0) {
  // Alert about performance regression
  await sendAlert({
    severity: 'medium',
    title: 'Performance Regression Detected',
    description: `Deployment ${deploymentId} shows performance regressions`,
    regressions: regressions
  });
}
```

---

### Workflow 12: LinkedIn Notifications

**Purpose**: Post professional updates about system milestones and achievements.

#### Trigger Events

- 30 days uptime achieved
- 100 issues auto-resolved
- New feature deployed
- Monthly performance report
- System improvements

#### LinkedIn Post Templates

```javascript
const linkedInTemplates = {
  uptime_milestone: {
    text: `🎉 Infrastructure Milestone

Terry, our AI IT employee, just achieved {{days}} days of {{uptime}}% uptime!

Stats:
• {{issues_detected}} issues detected
• {{issues_resolved}} auto-resolved ({{success_rate}}%)
• {{time_saved}} hours of manual work saved
• {{mttr}} average resolution time

Building transparent automation that actually works.

#AI #Automation #DevOps #BuildingInPublic`,
    
    image: 'milestone-graphic.png'
  },
  
  monthly_report: {
    text: `📊 {{month}} Infrastructure Report

Terry AI Agent (our self-hosted AI IT employee) monthly stats:

Reliability:
• Uptime: {{uptime}}%
• MTTR: {{mttr}} minutes
• Zero production incidents

Automation:
• Issues detected: {{issues_detected}}
• Auto-fixed: {{issues_auto_fixed}} ({{auto_fix_rate}}%)
• Manual interventions: {{manual_interventions}}

Efficiency:
• Developer time saved: {{time_saved}} hours
• False positive rate: {{false_positive_rate}}%
• Alert response time: {{response_time}}

We eat our own dog food - and it tastes good.

Read more: {{blog_post_url}}

#MultiAgentSystems #AIAutomation #DevOps`,
    
    image: 'monthly-report-graphic.png'
  },
  
  feature_deployed: {
    text: `🚀 New Feature Deployed

Just shipped: {{feature_name}}

{{feature_description}}

Deployed automatically by Terry with zero downtime.

Time from commit to production: {{deployment_time}}

Check it out: {{website_url}}

#Automation #ContinuousDeployment #AI`,
    
    image: null
  }
};
```

---

### Workflow 13: Problem History Database

**Purpose**: Store and learn from all detected problems and resolutions.

#### Database Schema

```sql
CREATE TABLE problem_history (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    service VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    
    -- Problem details
    title TEXT NOT NULL,
    description TEXT,
    problems JSONB,
    error_details TEXT,
    
    -- Analysis
    root_cause TEXT,
    proposed_solution JSONB,
    risk_level VARCHAR(20),
    
    -- Resolution
    status VARCHAR(20) NOT NULL,
    resolution_method VARCHAR(50),
    actions_taken JSONB,
    resolved_at TIMESTAMP,
    resolution_time_seconds INTEGER,
    
    -- Human involvement
    required_approval BOOLEAN,
    approval_status VARCHAR(20),
    approved_by VARCHAR(50),
    
    -- Success metrics
    fix_successful BOOLEAN,
    issue_recurred BOOLEAN,
    recurrence_count INTEGER DEFAULT 0,
    
    -- Metadata
    detected_by VARCHAR(100),
    affected_resources JSONB,
    metrics JSONB,
    
    -- Indexing
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_problem_service ON problem_history(service);
CREATE INDEX idx_problem_severity ON problem_history(severity);
CREATE INDEX idx_problem_timestamp ON problem_history(timestamp DESC);
CREATE INDEX idx_problem_status ON problem_history(status);
```

#### Analytics Queries

```sql
-- Query 1: Auto-fix success rate
SELECT 
    service,
    COUNT(*) as total_issues,
    SUM(CASE WHEN resolution_method = 'auto_fix' THEN 1 ELSE 0 END) as auto_fixed,
    ROUND(AVG(CASE WHEN resolution_method = 'auto_fix' THEN 1 ELSE 0 END) * 100, 2) as auto_fix_rate
FROM problem_history
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY service;

-- Query 2: Mean Time To Resolution by severity
SELECT 
    severity,
    AVG(resolution_time_seconds) / 60 as mttr_minutes,
    MEDIAN(resolution_time_seconds) / 60 as median_minutes
FROM problem_history
WHERE resolved_at IS NOT NULL
AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY severity;

-- Query 3: Recurring issues (need attention)
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

-- Query 4: False positive rate
SELECT 
    service,
    COUNT(*) as total_alerts,
    SUM(CASE WHEN fix_successful = false THEN 1 ELSE 0 END) as false_positives,
    ROUND(AVG(CASE WHEN fix_successful = false THEN 1 ELSE 0 END) * 100, 2) as false_positive_rate
FROM problem_history
WHERE timestamp > NOW() - INTERVAL '30 days'
AND status = 'resolved'
GROUP BY service;
```

---

### Workflow 14: Monthly Reporting

**Purpose**: Generate comprehensive monthly reports with metrics, insights, and recommendations.

#### Report Sections

1. **Executive Summary**
2. **Reliability Metrics**
3. **Automation Performance**
4. **Top Issues & Resolutions**
5. **Cost Savings**
6. **Recommendations**

#### Report Generation Workflow

```
[Schedule: 1st of every month]
    ↓
[Query: Get Last Month's Data]
    ↓
[Function: Calculate Metrics]
    ↓
[GPT-4: Generate Insights & Recommendations]
    ↓
[Function: Format Report (HTML)]
    ↓
[Send Email Report]
    ↓
[Post LinkedIn Summary]
    ↓
[Save to Archive]
```

#### Report Template

```markdown
# Terry AI Agent - Monthly Report
## {{month}} {{year}}

### Executive Summary

Terry monitored AI-Whisperers' infrastructure 24/7, detecting and resolving {{total_issues}} issues with {{uptime}}% uptime.

**Key Achievements:**
- {{auto_resolved}} issues resolved automatically ({{auto_fix_rate}}%)
- {{time_saved}} hours of developer time saved
- Mean Time To Resolution: {{mttr}} minutes
- Zero production incidents

---

### Reliability Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Uptime | {{uptime}}% | 99.5% | {{uptime_status}} |
| MTTR | {{mttr}} min | <15 min | {{mttr_status}} |
| False Positives | {{false_positive_rate}}% | <5% | {{fp_status}} |
| Auto-Fix Rate | {{auto_fix_rate}}% | >80% | {{af_status}} |

---

### Service Health

**GitHub Repositories**
- Health checks: {{github_checks}}
- Issues detected: {{github_issues}}
- Average health score: {{github_health_score}}/100

**Production Website**
- Uptime: {{website_uptime}}%
- Average response time: {{website_response_time}}ms
- Downtime events: {{website_downtime_events}}

**Docker Containers**
- Containers monitored: {{container_count}}
- Restarts triggered: {{container_restarts}}
- Resource alerts: {{resource_alerts}}

---

### Top Issues Resolved

1. **{{issue_1_title}}**
   - Occurrences: {{issue_1_count}}
   - Resolution method: {{issue_1_method}}
   - Average resolution time: {{issue_1_time}}

2. **{{issue_2_title}}**
   - Occurrences: {{issue_2_count}}
   - Resolution method: {{issue_2_method}}
   - Average resolution time: {{issue_2_time}}

3. **{{issue_3_title}}**
   - Occurrences: {{issue_3_count}}
   - Resolution method: {{issue_3_method}}
   - Average resolution time: {{issue_3_time}}

---

### AI Analysis Performance

**GPT-4 Usage:**
- API calls: {{gpt4_calls}}
- Total tokens: {{gpt4_tokens}}
- Cost: ${{gpt4_cost}}

**Analysis Accuracy:**
- Correct root cause identification: {{root_cause_accuracy}}%
- Successful fix proposals: {{fix_success_rate}}%
- Approval rate (human validation): {{approval_rate}}%

---

### Cost Savings

**Developer Time Saved:**
- Manual monitoring: {{monitoring_time_saved}} hours
- Troubleshooting: {{troubleshooting_time_saved}} hours
- Total: {{total_time_saved}} hours

**Financial Impact:**
- Time saved value: ${{time_saved_value}}
- Terry operational cost: ${{terry_cost}}
- Net savings: ${{net_savings}}
- ROI: {{roi}}%

---

### Recommendations

{{gpt4_recommendations}}

---

### System Improvements

**This Month:**
{{improvements_made}}

**Next Month:**
{{planned_improvements}}

---

*Generated by Terry AI Agent | AI-Whisperers*
*Report ID: {{report_id}} | Generated: {{generation_timestamp}}*
```

---

## Workflow Export & Import

All workflows are exported as JSON files in the `workflows/` directory:

```
workflows/
├── phase1/
│   ├── 01-github-health-check.json
│   ├── 02-website-uptime.json
│   └── 03-docker-health.json
├── phase2/
│   ├── 04-gpt4-analysis.json
│   ├── 05-smart-filtering.json
│   └── 06-structured-output.json
├── phase3/
│   ├── 07-auto-fix-library.json
│   ├── 08-approval-workflow.json
│   └── 09-risk-assessment.json
└── phase4/
    ├── 10-github-automation.json
    ├── 11-vercel-monitoring.json
    ├── 12-linkedin-updates.json
    ├── 13-problem-history.json
    └── 14-monthly-reporting.json
```

### Import Instructions

1. Open n8n UI
2. Click "Workflows" → "Import from File"
3. Select JSON file
4. Configure credentials
5. Update environment-specific variables
6. Activate workflow

---

## Testing Workflows

### Test Checklist

```bash
# Phase 1
□ GitHub health check detects unhealthy repo
□ Website monitoring detects downtime
□ Docker health finds stopped container
□ Email alerts received successfully

# Phase 2
□ GPT-4 correctly analyzes problem
□ Smart filtering suppresses duplicates
□ Outputs follow standard schema
□ Priority routing works correctly

# Phase 3
□ Auto-fix successfully restarts container
□ Approval request sent via email/WhatsApp
□ Approval workflow executes fix
□ Risk assessment prevents dangerous operations

# Phase 4
□ GitHub issue auto-labeled correctly
□ Deployment monitoring catches regression
□ LinkedIn post published successfully
□ Monthly report generated with accurate data
```

---

## Next Steps

1. ✅ Import Phase 1 workflows
2. ✅ Test each workflow individually
3. ✅ Configure notification channels
4. ✅ Set up approval workflows
5. ✅ Deploy to production
6. ✅ Monitor and iterate

## Support

For workflow issues:
- Check n8n execution logs
- Review [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)
- Test individual nodes
- Contact DevOps team

---

**Built transparently by AI-Whisperers**

