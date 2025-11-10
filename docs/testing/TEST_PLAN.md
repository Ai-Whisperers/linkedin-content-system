# Comprehensive Test Plan

## Overview

Testing strategy for the AI-Whisperers Content Generator covering all 6 critical flaws and ensuring production readiness.

---

## Test Coverage Matrix

| Flaw | Unit Tests | Integration Tests | E2E Tests | Manual Tests |
|------|------------|-------------------|-----------|--------------|
| #1 Race Condition | ✅ | ✅ | ✅ | ✅ |
| #2 Context Validation | ✅ | ✅ | ✅ | ❌ |
| #3 Monolithic Operations | ✅ | ✅ | ❌ | ❌ |
| #4 API Resilience | ✅ | ✅ | ✅ | ✅ |
| #5 Status Branching | ✅ | ✅ | ✅ | ❌ |
| #6 Version Tagging | ✅ | ✅ | ✅ | ❌ |

---

## FLAW #1: Race Condition Testing

### Unit Tests

**Test: Unique runId generation**
```javascript
// tests/unit/run-id-generator.test.js
const { generateRunId } = require('../../workflows/utils/run-id');

describe('RunID Generator', () => {
  test('generates unique IDs for concurrent calls', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateRunId());
    }
    expect(ids.size).toBe(100); // All unique
  });

  test('includes millisecond precision', () => {
    const id = generateRunId();
    expect(id).toMatch(/^\d{8}-\d{6}$/); // YYYYMMDD-HHMMSS
  });
});
```

**Test: Execution queue**
```javascript
// tests/unit/execution-queue.test.js
describe('Execution Queue', () => {
  test('rejects execution when queue is full', async () => {
    const queue = new ExecutionQueue({ maxSize: 3 });

    await queue.enqueue('exec1');
    await queue.enqueue('exec2');
    await queue.enqueue('exec3');

    await expect(queue.enqueue('exec4'))
      .rejects.toThrow('QUEUE_FULL');
  });

  test('dequeues in FIFO order', async () => {
    const queue = new ExecutionQueue();
    await queue.enqueue('exec1');
    await queue.enqueue('exec2');

    expect(await queue.dequeue()).toBe('exec1');
    expect(await queue.dequeue()).toBe('exec2');
  });
});
```

### Integration Tests

**Test: Concurrent execution prevention**
```javascript
// tests/integration/race-condition.test.js
describe('Race Condition Prevention', () => {
  test('second execution waits for first to complete', async () => {
    // Start first execution
    const exec1 = triggerWorkflow();

    // Start second execution immediately
    const exec2 = triggerWorkflow();

    const results = await Promise.all([exec1, exec2]);

    // Only one should execute, other should wait
    expect(results.filter(r => r.status === 'running').length).toBe(1);
  });
});
```

### E2E Tests

**Test: Webhook + Schedule conflict**
```javascript
// tests/e2e/concurrent-triggers.test.js
test('webhook during scheduled run does not cause collision', async () => {
  // Trigger schedule
  await scheduleWorkflow(new Date('2025-11-10T10:00:00'));

  // Trigger webhook 2 seconds later
  await wait(2000);
  const webhookResult = await triggerWebhook();

  // Check both produced different runIds
  const batches = await listGeneratedBatches();
  expect(batches).toHaveLength(2);
  expect(batches[0]).not.toBe(batches[1]);
});
```

### Manual Tests

**Test: Rapid manual triggers**
```bash
# Trigger 5 times rapidly
for i in {1..5}; do
  curl -X POST http://localhost:5678/webhook/content-generator-linkedin &
done
wait

# Verify all completed without collision
curl -X GET http://localhost:5678/api/v1/executions | \
  jq '[.data[] | select(.workflowId == "content-generator-v2")] | length'

# Should be 5 successful executions
```

---

## FLAW #2: Context Validation Testing

### Unit Tests

**Test: Manifest schema validation**
```javascript
// tests/unit/manifest-validator.test.js
describe('Manifest Validator', () => {
  test('rejects manifest without sources array', () => {
    const manifest = { version: '2.0.0', run_id: '20251110' };

    expect(() => validateManifest(manifest))
      .toThrow('MANIFEST_INVALID: sources array is undefined');
  });

  test('rejects source missing required fields', () => {
    const manifest = {
      sources: [{ path: '/file.md' }] // Missing category, priority, required
    };

    expect(() => validateManifest(manifest))
      .toThrow('Source 0 missing required field "category"');
  });

  test('detects duplicate sources', () => {
    const manifest = {
      sources: [
        { path: '/brand/voice.md', category: 'brand', priority: 1, required: true },
        { path: '/brand/voice.md', category: 'brand', priority: 1, required: true }
      ]
    };

    expect(() => validateManifest(manifest))
      .toThrow('Duplicate sources: /brand/voice.md');
  });
});
```

### Integration Tests

**Test: Workflow fails fast on invalid manifest**
```javascript
// tests/integration/manifest-validation.test.js
test('workflow aborts on invalid manifest', async () => {
  // Inject invalid manifest
  const result = await triggerWorkflow({
    manifestOverride: { version: '2.0.0' } // Missing sources
  });

  expect(result.status).toBe('error');
  expect(result.error).toContain('MANIFEST_INVALID');
  expect(result.stoppedAt).toBe('Validate Manifest'); // Failed before Split
});
```

---

## FLAW #3: Monolithic Operations Testing

### Unit Tests

**Test: Separate read/normalize/validate**
```javascript
// tests/unit/content-processor.test.js
describe('Content Processor', () => {
  test('read returns raw content or error flag', () => {
    const result = readFile('/nonexistent.md');
    expect(result).toEqual({
      error: 'FILE_NOT_FOUND',
      skip_validation: true
    });
  });

  test('normalize produces structured output', () => {
    const rawContent = 'Hello world.\n\nSecond paragraph.';
    const normalized = normalizeContent(rawContent, { path: '/file.md' });

    expect(normalized.content.word_count).toBe(4);
    expect(normalized.content.sections).toHaveLength(2);
  });

  test('validate checks rules independently', () => {
    const normalized = {
      source: { required: true },
      content: { word_count: 5 } // Too short
    };

    expect(() => validateContent(normalized))
      .toThrow('VALIDATION_FAILED: Content too short');
  });
});
```

---

## FLAW #4: API Resilience Testing

### Unit Tests

**Test: Exponential backoff calculation**
```javascript
// tests/unit/backoff.test.js
describe('Exponential Backoff', () => {
  test('calculates correct delays', () => {
    expect(calculateBackoff(1)).toBe(1000);  // 1s
    expect(calculateBackoff(2)).toBe(2000);  // 2s
    expect(calculateBackoff(3)).toBe(4000);  // 4s
    expect(calculateBackoff(4)).toBe(8000);  // 8s
  });

  test('caps at max delay', () => {
    expect(calculateBackoff(10, 1000, 30000)).toBe(30000);
  });
});
```

**Test: Retry logic**
```javascript
// tests/unit/retry.test.js
describe('Retry Handler', () => {
  test('retries up to max attempts', async () => {
    let attempts = 0;
    const failingFn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('rate_limit_error');
      return 'success';
    };

    const result = await retryWithBackoff(failingFn, { maxAttempts: 3 });

    expect(attempts).toBe(3);
    expect(result).toBe('success');
  });

  test('gives up after max attempts', async () => {
    const alwaysFailFn = async () => { throw new Error('rate_limit_error'); };

    await expect(retryWithBackoff(alwaysFailFn, { maxAttempts: 3 }))
      .rejects.toThrow('FATAL_API_ERROR');
  });
});
```

### Integration Tests

**Test: API error handling**
```javascript
// tests/integration/api-resilience.test.js
describe('Claude API Resilience', () => {
  test('retries on 429 rate limit', async () => {
    // Mock API to return 429 twice, then 200
    mockClaudeAPI
      .onCall(1).reply(429, { error: { type: 'rate_limit_error' }})
      .onCall(2).reply(429, { error: { type: 'rate_limit_error' }})
      .onCall(3).reply(200, { content: [...] });

    const result = await triggerWorkflow();

    expect(result.status).toBe('success');
    expect(mockClaudeAPI.callCount).toBe(3);
  });

  test('uses fallback after max retries', async () => {
    mockClaudeAPI.reply(429); // Always 429

    const result = await triggerWorkflow();

    expect(result.status).toBe('success');
    expect(result.data.fallback_used).toBe(true);
  });
});
```

### E2E Tests

**Test: Real API rate limiting**
```javascript
// tests/e2e/api-rate-limit.test.js
test('handles real rate limit gracefully', async () => {
  // Trigger many requests to hit rate limit
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(triggerWorkflow());
  }

  const results = await Promise.allSettled(promises);

  // Some should succeed, some should retry
  const succeeded = results.filter(r => r.status === 'fulfilled');
  expect(succeeded.length).toBeGreaterThan(0);

  // Check logs for retry attempts
  const logs = await getWorkflowLogs();
  expect(logs).toContain('RETRY: rate_limit_error');
});
```

---

## FLAW #5: Status Branching Testing

### Unit Tests

**Test: Validation contract**
```javascript
// tests/unit/validation-contract.test.js
describe('Validation Contract', () => {
  test('rejects post with forbidden words', () => {
    const post = {
      hook: 'This revolutionary AI will transform your business',
      body: 'Content',
      cta: 'Click here'
    };

    const result = validateAgainstContract(post);

    expect(result.status).toBe('REJECTED');
    expect(result.validation.critical_issues).toContainEqual(
      expect.objectContaining({ rule: 'no_forbidden_words' })
    );
  });

  test('approves post meeting all criteria', () => {
    const post = {
      variation: 'service-showcase',
      hook: 'Practical guide to AI automation',
      body: 'Content...',
      cta: 'Want to learn more?',
      hashtags: ['AI', 'Automation', 'n8n', 'Claude'],
      word_count: 150
    };

    const result = validateAgainstContract(post);

    expect(result.status).toBe('APPROVED');
    expect(result.validation.critical_issues).toHaveLength(0);
  });
});
```

---

## FLAW #6: Version Tagging Testing

### Unit Tests

**Test: Content hash generation**
```javascript
// tests/unit/version-tagging.test.js
describe('Version Tagging', () => {
  test('generates consistent hash for same content', () => {
    const content = 'Test post content';

    const hash1 = generateContentHash(content);
    const hash2 = generateContentHash(content);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(8);
  });

  test('generates different hash for different content', () => {
    const hash1 = generateContentHash('Content A');
    const hash2 = generateContentHash('Content B');

    expect(hash1).not.toBe(hash2);
  });
});
```

### Integration Tests

**Test: Collision detection**
```javascript
// tests/integration/version-collision.test.js
describe('Version Collision Prevention', () => {
  test('same content generates same filename', async () => {
    const result1 = await generatePost({ seed: 'test123' });
    const result2 = await generatePost({ seed: 'test123' }); // Same seed = same content

    expect(result1.filename).toBe(result2.filename);
    expect(result2.action).toBe('SKIPPED'); // Detected duplicate
  });

  test('different content generates different filename', async () => {
    const result1 = await generatePost({ seed: 'test123' });
    const result2 = await generatePost({ seed: 'test456' });

    expect(result1.filename).not.toBe(result2.filename);
  });
});
```

---

## Test Execution Plan

### Phase 1: Unit Tests (1-2 hours)
```bash
npm test tests/unit/
```

**Pass Criteria:**
- All unit tests pass
- Code coverage > 80%
- No skipped tests

### Phase 2: Integration Tests (2-4 hours)
```bash
npm test tests/integration/
```

**Pass Criteria:**
- All integration tests pass
- n8n workflow nodes tested
- Database transactions verified

### Phase 3: E2E Tests (4-8 hours)
```bash
npm test tests/e2e/
```

**Pass Criteria:**
- Full workflow executes successfully
- Generated content meets quality standards
- Error scenarios recover correctly

### Phase 4: Manual Tests (2-4 hours)

**Manual Test Checklist:**
- [ ] Trigger workflow via webhook
- [ ] Trigger workflow via schedule
- [ ] Simulate API rate limit
- [ ] Simulate file missing
- [ ] Simulate concurrent triggers
- [ ] Verify all checkpoints created
- [ ] Verify content quality
- [ ] Test recovery procedures

---

## Continuous Testing

### Pre-Commit Tests
```bash
# Run before every commit
npm run test:unit
npm run lint
```

### Pre-Deploy Tests
```bash
# Run before deploying to production
npm run test:all
npm run test:coverage
npm run test:e2e
```

### Production Monitoring
- Monitor error rates
- Track retry success rates
- Alert on repeated failures
- Log all executions

---

## Test Data & Fixtures

Location: `tests/fixtures/`

**Required Fixtures:**
- `sample-context.json` - Valid context manifest
- `invalid-manifest.json` - Malformed manifest
- `sample-posts.json` - Example generated posts
- `api-responses/` - Mock Claude API responses
  - `success-response.json`
  - `rate-limit-error.json`
  - `invalid-response.json`

---

## Related Documentation

- [INTEGRATION_TESTS.md](./INTEGRATION_TESTS.md) - Integration testing details
- [E2E_TESTS.md](./E2E_TESTS.md) - End-to-end testing guide
- [../error-handling/ERROR_CATALOG.md](../error-handling/ERROR_CATALOG.md) - Errors to test

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
**Workflow Version:** 2.0.0
