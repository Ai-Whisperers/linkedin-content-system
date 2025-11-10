# Integration Testing Guide

## Overview

Integration tests verify that workflow nodes work together correctly, covering all 6 critical flaws.

---

## Test Environment Setup

```bash
# Install test dependencies
npm install --save-dev jest supertest n8n-workflow

# Create test config
cat > jest.config.js <<EOF
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.js'],
  collectCoverageFrom: ['workflows/**/*.js'],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70 }
  }
};
EOF
```

---

## Test: End-to-End Workflow Execution

```javascript
// tests/integration/workflow-execution.test.js
const { triggerWorkflow, getExecutionStatus } = require('../helpers/n8n');

describe('Workflow Execution', () => {
  test('completes successfully with valid inputs', async () => {
    const execution = await triggerWorkflow({
      webhook: 'content-generator-linkedin'
    });

    const status = await getExecutionStatus(execution.id);

    expect(status.finished).toBe(true);
    expect(status.data.resultData.error).toBeUndefined();
  }, 60000); // 60s timeout

  test('generates expected number of posts', async () => {
    const execution = await triggerWorkflow();
    const results = execution.data.resultData.runData;

    const validatedPosts = results['Hard Validator'];
    expect(validatedPosts.length).toBe(5);
  });
});
```

---

## Test: Race Condition Prevention

```javascript
// tests/integration/race-condition.test.js
describe('Race Condition Prevention', () => {
  test('concurrent executions are queued', async () => {
    // Trigger 3 executions simultaneously
    const promises = [
      triggerWorkflow(),
      triggerWorkflow(),
      triggerWorkflow()
    ];

    const executions = await Promise.all(promises);

    // Check that only one ran, others were queued or rejected
    const statuses = await Promise.all(
      executions.map(e => getExecutionStatus(e.id))
    );

    const completed = statuses.filter(s => s.finished === true);
    expect(completed.length).toBeLessThanOrEqual(1);
  });

  test('generates unique runIds for concurrent runs', async () => {
    const exec1 = await triggerWorkflow();
    await wait(100); // 100ms delay
    const exec2 = await triggerWorkflow();

    const runId1 = exec1.data.resultData.runData['Load Context Manifest'][0].json.run_id;
    const runId2 = exec2.data.resultData.runData['Load Context Manifest'][0].json.run_id;

    expect(runId1).not.toBe(runId2);
  });
});
```

---

## Test: Context Validation

```javascript
// tests/integration/context-validation.test.js
describe('Context Validation', () => {
  test('fails fast on invalid manifest', async () => {
    const execution = await triggerWorkflow({
      manifestOverride: { version: '2.0.0' } // Missing sources
    });

    expect(execution.data.resultData.error).toContain('MANIFEST_INVALID');
    expect(execution.data.resultData.lastNodeExecuted).toBe('Validate Manifest');
  });

  test('validates before splitting sources', async () => {
    const execution = await triggerWorkflow();
    const nodeOrder = execution.data.resultData.executionOrder;

    const validateIndex = nodeOrder.indexOf('Validate Manifest');
    const splitIndex = nodeOrder.indexOf('Split Sources');

    expect(validateIndex).toBeLessThan(splitIndex);
  });
});
```

---

## Test: API Resilience

```javascript
// tests/integration/api-resilience.test.js
const nock = require('nock');

describe('API Resilience', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test('retries on rate limit', async () => {
    // Mock API to return 429 twice, then 200
    const apiMock = nock('https://api.anthropic.com')
      .post('/v1/messages')
      .reply(429, { error: { type: 'rate_limit_error' }})
      .post('/v1/messages')
      .reply(429, { error: { type: 'rate_limit_error' }})
      .post('/v1/messages')
      .reply(200, { content: [{ text: '{"posts": [...]}' }]});

    const execution = await triggerWorkflow();

    expect(execution.finished).toBe(true);
    expect(apiMock.isDone()).toBe(true); // All 3 requests made
  });

  test('uses fallback after max retries', async () => {
    nock('https://api.anthropic.com')
      .post('/v1/messages')
      .times(3)
      .reply(429, { error: { type: 'rate_limit_error' }});

    const execution = await triggerWorkflow();

    // Should complete using cached fallback
    expect(execution.finished).toBe(true);
    expect(execution.data.fallback_used).toBe(true);
  });
});
```

---

## Test: Idempotency

```javascript
// tests/integration/idempotency.test.js
describe('Idempotency', () => {
  test('same input generates same output', async () => {
    const input = { seed: 'test123', runId: '20251110' };

    const exec1 = await triggerWorkflow(input);
    const exec2 = await triggerWorkflow(input);

    const output1 = exec1.data.resultData.runData['Claude Generate'][0].json;
    const output2 = exec2.data.resultData.runData['Claude Generate'][0].json;

    expect(output1).toEqual(output2);
  });

  test('uses cached result for duplicate request', async () => {
    const input = { seed: 'test456' };

    const exec1 = await triggerWorkflow(input);
    const exec2 = await triggerWorkflow(input);

    expect(exec2.data.cache_hit).toBe(true);
    expect(exec2.executionTime).toBeLessThan(exec1.executionTime * 0.5);
  });
});
```

---

## Test Helpers

```javascript
// tests/helpers/n8n.js
const fetch = require('node-fetch');

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

async function triggerWorkflow(options = {}) {
  const response = await fetch(
    `${N8N_BASE_URL}/webhook/content-generator-linkedin`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    }
  );

  return response.json();
}

async function getExecutionStatus(executionId) {
  const response = await fetch(
    `${N8N_BASE_URL}/api/v1/executions/${executionId}`,
    { headers: { 'X-N8N-API-KEY': N8N_API_KEY }}
  );

  return response.json();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { triggerWorkflow, getExecutionStatus, wait };
```

---

## Running Tests

```bash
# Run all integration tests
npm test tests/integration/

# Run specific test file
npm test tests/integration/workflow-execution.test.js

# Run with coverage
npm test tests/integration/ -- --coverage

# Watch mode for development
npm test tests/integration/ -- --watch
```

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
