# End-to-End Testing Guide

## Overview

E2E tests verify the complete workflow from trigger to final output file generation.

---

## Test Scenarios

### 1. Happy Path - Complete Workflow

```javascript
// tests/e2e/happy-path.test.js
describe('Happy Path E2E', () => {
  test('generates and writes 5 approved posts', async () => {
    const execution = await triggerWorkflow();

    // Wait for completion
    await waitForExecution(execution.id, 60000);

    // Verify execution succeeded
    const status = await getExecutionStatus(execution.id);
    expect(status.finished).toBe(true);
    expect(status.data.resultData.error).toBeUndefined();

    // Verify files were created
    const runId = status.data.runId;
    const approvedDir = `generated-posts/batch-${runId}/approved`;

    const files = fs.readdirSync(approvedDir);
    expect(files.length).toBeGreaterThanOrEqual(5);

    // Verify file content
    files.forEach(file => {
      const content = fs.readFileSync(`${approvedDir}/${file}`, 'utf-8');
      expect(content).toContain('## READY TO POST');
      expect(content).toContain('post_id:');
      expect(content).toContain('version:');
    });
  }, 120000); // 2 minute timeout
});
```

### 2. Error Recovery - API Rate Limit

```javascript
// tests/e2e/api-rate-limit.test.js
describe('API Rate Limit Recovery E2E', () => {
  test('recovers from rate limit with retry', async () => {
    // Mock API to simulate rate limit
    mockClaudeAPI.onFirstCall().reply(429);
    mockClaudeAPI.onSecondCall().reply(200, validResponse);

    const execution = await triggerWorkflow();
    await waitForExecution(execution.id, 120000);

    const status = await getExecutionStatus(execution.id);

    // Should succeed after retry
    expect(status.finished).toBe(true);
    expect(status.data.retriesPerformed).toBeGreaterThan(0);
  });
});
```

### 3. Validation - Rejected Posts

```javascript
// tests/e2e/validation-rejection.test.js
describe('Post Validation E2E', () => {
  test('rejects posts with forbidden words', async () => {
    const execution = await triggerWorkflow({
      promptOverride: 'Generate a revolutionary post...'
    });

    await waitForExecution(execution.id);

    const runId = execution.data.runId;
    const rejectedDir = `generated-posts/batch-${runId}/needs-revision`;

    const files = fs.readdirSync(rejectedDir);
    expect(files.length).toBeGreaterThan(0);

    // Verify rejection reason
    const content = fs.readFileSync(`${rejectedDir}/${files[0]}`, 'utf-8');
    expect(content).toContain('⚠️ NEEDS REVISION');
    expect(content).toContain('Contains forbidden words');
  });
});
```

---

## Performance Tests

```javascript
// tests/e2e/performance.test.js
describe('Performance E2E', () => {
  test('completes within 60 seconds', async () => {
    const startTime = Date.now();

    const execution = await triggerWorkflow();
    await waitForExecution(execution.id);

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(60000); // 60 seconds
  });

  test('handles 10 concurrent requests within 5 minutes', async () => {
    const startTime = Date.now();

    const executions = await Promise.all(
      Array(10).fill().map(() => triggerWorkflow())
    );

    await Promise.all(
      executions.map(e => waitForExecution(e.id, 300000))
    );

    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(300000); // 5 minutes
  });
});
```

---

## Running E2E Tests

```bash
# Run all E2E tests
npm test tests/e2e/

# Run specific scenario
npm test tests/e2e/happy-path.test.js

# Run in CI/CD
npm run test:e2e:ci
```

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
