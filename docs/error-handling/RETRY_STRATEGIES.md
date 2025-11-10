# Retry Strategies & Resilience Patterns

## Overview

Comprehensive retry and resilience strategies for the AI-Whisperers Content Generator. Covers exponential backoff, circuit breakers, fallback patterns, and idempotency guarantees.

---

## Table of Contents

1. [Retry Strategy Matrix](#retry-strategy-matrix)
2. [Exponential Backoff Implementation](#exponential-backoff-implementation)
3. [Circuit Breaker Pattern](#circuit-breaker-pattern)
4. [Idempotency Guarantees](#idempotency-guarantees)
5. [Checkpoint & Resume](#checkpoint--resume)
6. [Fallback Strategies](#fallback-strategies)

---

## Retry Strategy Matrix

| Error Type | Retriable? | Max Attempts | Backoff Strategy | Timeout |
|------------|------------|--------------|------------------|---------|
| **API Errors** |
| rate_limit_error (429) | ✅ Yes | 3 | Exponential (2s, 4s, 8s) | 30s |
| overloaded_error (529) | ✅ Yes | 3 | Exponential (2s, 4s, 8s) | 30s |
| timeout_error | ✅ Yes | 3 | Exponential (2s, 4s, 8s) | 30s |
| api_error (500, 502, 503) | ✅ Yes | 2 | Exponential (1s, 2s) | 30s |
| invalid_request_error (400) | ❌ No | 0 | - | - |
| authentication_error (401) | ❌ No | 0 | - | - |
| permission_error (403) | ❌ No | 0 | - | - |
| not_found_error (404) | ❌ No | 0 | - | - |
| **File Errors** |
| FILE_NOT_FOUND | ❌ No (if required) | 0 | - | - |
| FILE_EMPTY | ❌ No (if required) | 0 | - | - |
| FILE_INVALID | ❌ No | 0 | - | - |
| FILE_READ_ERROR | ✅ Yes | 2 | Linear (1s, 1s) | 10s |
| **Validation Errors** |
| MANIFEST_INVALID | ❌ No | 0 | - | - |
| VALIDATION_FAILED (critical) | ❌ No | 0 | - | - |
| VALIDATION_FAILED (important) | ⚠️ Manual | 0 | - | - |
| **Concurrency Errors** |
| RACE_CONDITION | ❌ No (abort) | 0 | - | - |
| QUEUE_FULL | ✅ Yes | 5 | Linear (10s intervals) | 600s |
| QUEUE_TIMEOUT | ❌ No | 0 | - | - |
| FILE_COLLISION | ✅ Yes | 3 | Linear (1s, 1s, 1s) | - |

---

## Exponential Backoff Implementation

### Basic Exponential Backoff

```javascript
/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (1-indexed)
 * @param {number} baseDelay - Base delay in milliseconds (default: 1000)
 * @param {number} maxDelay - Maximum delay in milliseconds (default: 30000)
 * @returns {number} Delay in milliseconds
 */
function calculateExponentialBackoff(attempt, baseDelay = 1000, maxDelay = 30000) {
  const delay = baseDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, maxDelay);
}

// Examples:
calculateExponentialBackoff(1, 1000);  // 1000ms  (1s)
calculateExponentialBackoff(2, 1000);  // 2000ms  (2s)
calculateExponentialBackoff(3, 1000);  // 4000ms  (4s)
calculateExponentialBackoff(4, 1000);  // 8000ms  (8s)
calculateExponentialBackoff(5, 1000);  // 16000ms (16s)
calculateExponentialBackoff(6, 1000);  // 30000ms (30s max)
```

### With Jitter (Randomization)

```javascript
/**
 * Calculate exponential backoff with jitter to prevent thundering herd
 * @param {number} attempt - Current attempt number
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} Delay in milliseconds with random jitter
 */
function calculateBackoffWithJitter(attempt, baseDelay = 1000, maxDelay = 30000) {
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);

  // Add random jitter (±25%)
  const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.max(0, cappedDelay + jitter);
}

// Examples:
calculateBackoffWithJitter(1, 1000);  // 750-1250ms  (random)
calculateBackoffWithJitter(2, 1000);  // 1500-2500ms (random)
calculateBackoffWithJitter(3, 1000);  // 3000-5000ms (random)
```

### Implementation in n8n Workflow

```javascript
// NODE: Retry Handler
const checkpoint = $('Pre-API Checkpoint').first().json;
const error = $input.first().error;

// Parse error type
const errorType = error.message.match(/RETRY_(\w+)/)?.[1] || 'UNKNOWN';

// Increment attempt
checkpoint.attempt += 1;

// Calculate backoff based on error type
let backoffMs;
if (errorType === 'rate_limit_error' || errorType === 'overloaded_error') {
  // Exponential backoff for rate limiting
  backoffMs = calculateBackoffWithJitter(checkpoint.attempt, 1000, 30000);
} else if (errorType === 'timeout_error') {
  // Exponential backoff for timeouts
  backoffMs = calculateExponentialBackoff(checkpoint.attempt, 2000, 60000);
} else {
  // Linear backoff for other errors
  backoffMs = checkpoint.attempt * 1000;
}

console.log(`Retry attempt ${checkpoint.attempt}/${checkpoint.max_attempts}`);
console.log(`Waiting ${backoffMs}ms before retry...`);

// Wait for backoff period
await new Promise(resolve => setTimeout(resolve, backoffMs));

// Update checkpoint
checkpoint.last_retry_at = new Date().toISOString();
checkpoint.backoff_ms = backoffMs;

// Return to retry point
return { json: checkpoint };
```

---

## Circuit Breaker Pattern

### Overview

Circuit breaker prevents cascading failures by detecting when a service is unhealthy and "opening the circuit" to stop sending requests.

**States:**
- **CLOSED** - Normal operation, requests pass through
- **OPEN** - Service is unhealthy, requests fail immediately
- **HALF_OPEN** - Testing if service has recovered

### State Diagram

```
CLOSED ──[failures > threshold]──> OPEN
  ↑                                  │
  │                                  │
  │                      [timeout expires]
  │                                  ↓
  └──[success]──────────────── HALF_OPEN
                                     │
                        [failure] ───┘
```

### Implementation

```javascript
// NODE: Circuit Breaker (before Claude Generate)
const fs = require('fs');
const circuitBreakerPath = `${baseDir}/.circuit-breaker.json`;

// Load circuit breaker state
let circuitState = {
  state: 'CLOSED',           // CLOSED, OPEN, HALF_OPEN
  failure_count: 0,
  last_failure_time: null,
  open_until: null,
  failure_threshold: 5,      // Open after 5 failures
  timeout_ms: 60000,         // Stay open for 60 seconds
  half_open_max_attempts: 1  // Try 1 request in HALF_OPEN
};

if (fs.existsSync(circuitBreakerPath)) {
  circuitState = JSON.parse(fs.readFileSync(circuitBreakerPath, 'utf-8'));
}

// Check circuit state
const now = Date.now();

if (circuitState.state === 'OPEN') {
  // Check if timeout has expired
  if (now >= circuitState.open_until) {
    console.log('Circuit breaker: OPEN → HALF_OPEN (timeout expired)');
    circuitState.state = 'HALF_OPEN';
  } else {
    const remainingMs = circuitState.open_until - now;
    throw new Error(`CIRCUIT_OPEN: API is unhealthy. Circuit opens in ${remainingMs}ms`);
  }
}

if (circuitState.state === 'HALF_OPEN') {
  console.log('Circuit breaker: HALF_OPEN (testing recovery)');
}

// Store state and continue
fs.writeFileSync(circuitBreakerPath, JSON.stringify(circuitState, null, 2));
return { json: { circuit_state: circuitState.state }};
```

```javascript
// NODE: Circuit Breaker Success Handler (after successful API call)
const circuitBreakerPath = `${baseDir}/.circuit-breaker.json`;
let circuitState = JSON.parse(fs.readFileSync(circuitBreakerPath, 'utf-8'));

if (circuitState.state === 'HALF_OPEN') {
  console.log('Circuit breaker: HALF_OPEN → CLOSED (recovery confirmed)');
  circuitState.state = 'CLOSED';
  circuitState.failure_count = 0;
  circuitState.last_failure_time = null;
  circuitState.open_until = null;
} else if (circuitState.state === 'CLOSED') {
  // Reset failure count on success
  circuitState.failure_count = 0;
}

fs.writeFileSync(circuitBreakerPath, JSON.stringify(circuitState, null, 2));
```

```javascript
// NODE: Circuit Breaker Failure Handler (after failed API call)
const circuitBreakerPath = `${baseDir}/.circuit-breaker.json`;
let circuitState = JSON.parse(fs.readFileSync(circuitBreakerPath, 'utf-8'));

circuitState.failure_count += 1;
circuitState.last_failure_time = new Date().toISOString();

if (circuitState.state === 'HALF_OPEN') {
  console.log('Circuit breaker: HALF_OPEN → OPEN (recovery failed)');
  circuitState.state = 'OPEN';
  circuitState.open_until = Date.now() + circuitState.timeout_ms;
} else if (circuitState.failure_count >= circuitState.failure_threshold) {
  console.log(`Circuit breaker: CLOSED → OPEN (${circuitState.failure_count} failures)`);
  circuitState.state = 'OPEN';
  circuitState.open_until = Date.now() + circuitState.timeout_ms;
}

fs.writeFileSync(circuitBreakerPath, JSON.stringify(circuitState, null, 2));
throw new Error('CIRCUIT_BREAKER: API call failed');
```

---

## Idempotency Guarantees

### Why Idempotency Matters

Retries can cause duplicate operations. Idempotency ensures that retrying an operation multiple times has the same effect as executing it once.

### Idempotency Key Pattern

```javascript
// NODE: Generate Idempotency Key (before API call)
const crypto = require('crypto');
const promptData = $input.first().json;

// Generate deterministic idempotency key from input
const idempotencyInput = JSON.stringify({
  run_id: promptData.run_metadata.run_id,
  manifest_version: promptData.run_metadata.manifest_version,
  context_hash: crypto.createHash('sha256')
    .update(JSON.stringify(promptData.context_sources))
    .digest('hex')
});

const idempotencyKey = crypto
  .createHash('sha256')
  .update(idempotencyInput)
  .digest('hex');

console.log(`Idempotency key: ${idempotencyKey}`);

// Check if operation already completed
const resultCachePath = `${baseDir}/.cache/results/${idempotencyKey}.json`;
if (fs.existsSync(resultCachePath)) {
  console.log('CACHE HIT: Using cached result (idempotent)');
  const cachedResult = JSON.parse(fs.readFileSync(resultCachePath, 'utf-8'));
  return { json: cachedResult };
}

return {
  json: {
    ...promptData,
    idempotency_key: idempotencyKey
  }
};
```

```javascript
// NODE: Cache Result (after successful API call)
const response = $input.first().json;
const idempotencyKey = $('Generate Idempotency Key').first().json.idempotency_key;

// Store result for future idempotent retries
const resultCachePath = `${baseDir}/.cache/results/${idempotencyKey}.json`;
const resultCacheDir = path.dirname(resultCachePath);

fs.mkdirSync(resultCacheDir, { recursive: true });
fs.writeFileSync(resultCachePath, JSON.stringify(response, null, 2));

console.log(`Result cached with key: ${idempotencyKey}`);
return { json: response };
```

### Benefits

1. **Safe Retries** - Can retry without duplicating work
2. **Cost Savings** - Avoid redundant API calls
3. **Consistency** - Same input always produces same output
4. **Debugging** - Can replay operations deterministically

---

## Checkpoint & Resume

### Checkpoint Strategy

Save workflow state at critical points to enable resume after failure.

```javascript
// Checkpoint locations:
// 1. Before API call
// 2. After context loading
// 3. Before file writes
```

### Implementation

```javascript
// NODE: Create Checkpoint
const workflowState = $input.first().json;

const checkpoint = {
  checkpoint_id: `chk_${Date.now()}`,
  workflow_version: '2.0.0',
  run_id: workflowState.run_metadata.run_id,
  stage: 'PRE_API_CALL',  // PRE_API_CALL, POST_API_CALL, PRE_WRITE
  state: workflowState,
  created_at: new Date().toISOString(),
  execution_id: $execution.id
};

// Save checkpoint
const checkpointPath = `${baseDir}/.checkpoints/${checkpoint.run_id}/${checkpoint.stage}.json`;
fs.mkdirSync(path.dirname(checkpointPath), { recursive: true });
fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));

console.log(`Checkpoint created: ${checkpoint.checkpoint_id} (${checkpoint.stage})`);

return { json: workflowState };
```

```javascript
// NODE: Resume from Checkpoint (manual recovery)
const runId = $input.first().json.run_id;
const stage = 'PRE_API_CALL';

const checkpointPath = `${baseDir}/.checkpoints/${runId}/${stage}.json`;

if (!fs.existsSync(checkpointPath)) {
  throw new Error(`CHECKPOINT_NOT_FOUND: No checkpoint for run ${runId} at stage ${stage}`);
}

const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'));

console.log(`Resuming from checkpoint: ${checkpoint.checkpoint_id}`);
console.log(`Original execution: ${checkpoint.execution_id}`);
console.log(`Stage: ${checkpoint.stage}`);

return { json: checkpoint.state };
```

### Checkpoint Cleanup

```javascript
// Clean up old checkpoints (keep last 10)
const checkpointsDir = `${baseDir}/.checkpoints`;
const runDirs = fs.readdirSync(checkpointsDir)
  .map(dir => ({
    path: path.join(checkpointsDir, dir),
    mtime: fs.statSync(path.join(checkpointsDir, dir)).mtime
  }))
  .sort((a, b) => b.mtime - a.mtime);

if (runDirs.length > 10) {
  runDirs.slice(10).forEach(dir => {
    fs.rmSync(dir.path, { recursive: true });
    console.log(`Cleaned up old checkpoint: ${dir.path}`);
  });
}
```

---

## Fallback Strategies

### 1. Cached Prompt Fallback

If API fails after max retries, use cached prompt from previous successful run.

```javascript
// NODE: Fallback to Cached Prompt
const promptData = $input.first().json;
const runId = promptData.run_metadata.run_id;

// Try to load most recent successful prompt
const cacheDir = `${baseDir}/.cache/prompts`;
const cacheFiles = fs.readdirSync(cacheDir)
  .filter(f => f.endsWith('.json'))
  .map(f => ({
    path: path.join(cacheDir, f),
    mtime: fs.statSync(path.join(cacheDir, f)).mtime
  }))
  .sort((a, b) => b.mtime - a.mtime);

if (cacheFiles.length === 0) {
  throw new Error('FALLBACK_FAILED: No cached prompts available');
}

const cachedPrompt = JSON.parse(fs.readFileSync(cacheFiles[0].path, 'utf-8'));

console.warn('⚠️ Using cached prompt from previous run (API unavailable)');
console.warn(`Cached prompt age: ${Date.now() - cacheFiles[0].mtime}ms`);

return { json: cachedPrompt };
```

### 2. Degraded Mode

Generate posts with reduced quality requirements if full validation fails.

```javascript
// NODE: Degraded Mode Validator
const posts = $input.all();
const strictMode = $('Pre-Model Guardrails').first().json.strict_mode !== false;

if (!strictMode) {
  console.warn('⚠️ Running in DEGRADED MODE - relaxed validation');

  // Relax validation rules
  const relaxedPosts = posts.map(post => {
    const issues = post.json.issues || [];

    // Ignore non-critical issues in degraded mode
    const criticalIssues = issues.filter(i => i.severity === 'CRITICAL');

    return {
      json: {
        ...post.json,
        issues: criticalIssues,
        quality_score: criticalIssues.length === 0 ? 70 : 40,
        status: criticalIssues.length === 0 ? 'APPROVED' : 'REJECTED',
        degraded_mode: true
      }
    };
  });

  return relaxedPosts;
}

return posts;
```

### 3. Partial Success Recovery

If some posts succeed but others fail, save successful posts and retry failed ones.

```javascript
// NODE: Partial Success Handler
const validationResults = $input.all();

const successful = validationResults.filter(r => r.json.status === 'APPROVED');
const failed = validationResults.filter(r => r.json.status === 'REJECTED');

if (successful.length > 0 && failed.length > 0) {
  console.log(`PARTIAL SUCCESS: ${successful.length} succeeded, ${failed.length} failed`);

  // Save successful posts
  successful.forEach(post => {
    // (continue to Write Approved node)
  });

  // Store failed posts for manual review
  const failedBatch = {
    run_id: validationResults[0].json.metadata.run_id,
    failed_count: failed.length,
    failed_posts: failed.map(f => f.json),
    timestamp: new Date().toISOString()
  };

  const failedPath = `${baseDir}/.failed-batches/${failedBatch.run_id}.json`;
  fs.mkdirSync(path.dirname(failedPath), { recursive: true });
  fs.writeFileSync(failedPath, JSON.stringify(failedBatch, null, 2));

  console.warn(`Failed posts saved to: ${failedPath}`);
}

return successful;
```

---

## Resilience Checklist

### Before Deploy

- [ ] All retry strategies implemented
- [ ] Exponential backoff configured
- [ ] Circuit breaker tested
- [ ] Idempotency keys implemented
- [ ] Checkpoints created at critical stages
- [ ] Fallback strategies defined
- [ ] Partial success handling implemented
- [ ] Error monitoring configured

### Monitoring

- [ ] Track retry rates by error type
- [ ] Monitor circuit breaker state transitions
- [ ] Alert on cache misses (idempotency)
- [ ] Track checkpoint creation/resume
- [ ] Monitor fallback usage
- [ ] Track partial success rate

---

## Related Documentation

- [ERROR_CATALOG.md](./ERROR_CATALOG.md) - Complete error reference
- [FAILURE_SCENARIOS.md](./FAILURE_SCENARIOS.md) - Detailed failure flows
- [RECOVERY_PROCEDURES.md](./RECOVERY_PROCEDURES.md) - Manual recovery steps
- [../operations/RUNBOOKS.md](../operations/RUNBOOKS.md) - Operational procedures

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
**Workflow Version:** 2.0.0
