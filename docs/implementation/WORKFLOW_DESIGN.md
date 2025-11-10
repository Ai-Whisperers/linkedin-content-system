# Workflow Design - Corrected Architecture

## Overview

Comprehensive workflow design for the AI-Whisperers Content Generator with all 6 critical flaws addressed. This document provides the blueprint for production-ready implementation.

---

## Architecture Principles

1. **Fail Fast** - Validate early, abort on critical errors
2. **Idempotency** - Same input always produces same output
3. **Resilience** - Retry transient failures, fail gracefully on permanent errors
4. **Observability** - Log all decisions, checkpoint critical state
5. **Atomicity** - All-or-nothing operations with rollback capability

---

## Corrected Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ TRIGGER LAYER (with deduplication)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────────┐                    │
│  │  Webhook     │      │ Schedule Trigger │                    │
│  │  Trigger     │      │ (Every 3.5 days) │                    │
│  └──────┬───────┘      └────────┬─────────┘                    │
│         │                       │                               │
│         └───────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌─────────────────────┐                                │
│          │ Deduplication Guard │  ◄── NEW: Prevents race       │
│          │ (Check for running  │                                │
│          │  executions)        │                                │
│          └──────────┬──────────┘                                │
│                     │                                           │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ CONTEXT LOADING LAYER (with early validation)                   │
├─────────────────────────────────────────────────────────────────┤
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Load Context Manifest │                              │
│          │ (Generate runId with │                               │
│          │  millisecond precision)│                             │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Validate Manifest    │  ◄── NEW: Validate BEFORE    │
│          │ (Schema check before │      split                    │
│          │  split)              │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Split Sources        │                               │
│          │ (One item per source)│                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Read Context File    │  ◄── SEPARATED                │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Normalize Content    │  ◄── SEPARATED                │
│          │ (Structure data)     │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Validate Content     │  ◄── SEPARATED                │
│          │ (Check rules)        │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Merge All Contexts   │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ GENERATION LAYER (with resilience)                              │
├─────────────────────────────────────────────────────────────────┤
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Pre-Model Guardrails │                               │
│          │ (Sanitize, validate) │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Generate Idempotency │  ◄── NEW                      │
│          │ Key (Check cache)    │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ├─ Cache hit? ──► Use cached result         │
│                     │                                           │
│                     ▼ Cache miss                                │
│          ┌──────────────────────┐                               │
│          │ Create Checkpoint    │  ◄── NEW: Save state          │
│          │ (PRE_API_CALL)       │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ Circuit Breaker Check│  ◄── NEW: Check API health    │
│          └──────────┬───────────┘                               │
│                     │                                           │
│                     ▼                                           │
│     ┌───────────────────────────────┐                           │
│     │   Claude Generate (with retry)│                           │
│     │   ├─ Timeout: 30s             │                           │
│     │   ├─ Max attempts: 3          │                           │
│     │   └─ Exponential backoff      │                           │
│     └───────────────┬───────────────┘                           │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                               │
│          │ API Response Handler │  ◄── NEW: Error handling      │
│          │ (Check for errors,   │                               │
│          │  validate response)  │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│         ┌───────────┴───────────┐                               │
│         │                       │                               │
│         ▼ Success               ▼ Retriable error               │
│   ┌─────────────┐      ┌────────────────┐                      │
│   │Circuit      │      │ Retry Handler  │                      │
│   │Breaker:     │      │ (Backoff, retry)│                      │
│   │Success      │      └───────┬────────┘                      │
│   └─────┬───────┘              │                               │
│         │                      │                               │
│         │                      └──► (Loop back to Generate)     │
│         │                                                       │
│         ▼                                                       │
│   ┌──────────────────────┐                                     │
│   │ Cache Result         │  ◄── NEW: Store for idempotency     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
└──────────────┼──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ VALIDATION LAYER (contract-based)                               │
├─────────────────────────────────────────────────────────────────┤
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Hard Validator       │  ◄── MODIFIED: Contract-based       │
│   │ (Apply validation    │                                     │
│   │  contract)           │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Branch By Status     │                                     │
│   │ (APPROVED/REJECTED/  │                                     │
│   │  NEEDS_REVISION)     │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│      ┌───────┴───────┐                                         │
│      │               │                                         │
└──────┼───────────────┼─────────────────────────────────────────┘
       │               │
       ▼ APPROVED      ▼ NEEDS_REVISION
┌─────────────────────────────────────────────────────────────────┐
│ PERSISTENCE LAYER (with collision prevention)                   │
├─────────────────────────────────────────────────────────────────┤
│      │               │                                          │
│      ▼               ▼                                          │
│  ┌────────┐    ┌────────┐                                      │
│  │Normalize│    │Normalize│                                     │
│  │Approved │    │Revision │                                     │
│  │         │    │         │                                     │
│  │◄── MODIFIED:│ ◄──────────► Generate content hash            │
│  │Add content│  │Add content│                                  │
│  │hash to   │  │hash to    │                                  │
│  │filename  │  │filename   │                                  │
│  └────┬─────┘  └────┬──────┘                                  │
│       │             │                                          │
│       ▼             ▼                                          │
│  ┌──────────┐  ┌──────────┐                                  │
│  │Check for │  │Check for │  ◄── NEW: Collision detection     │
│  │existing  │  │existing  │                                   │
│  │file      │  │file      │                                   │
│  └────┬─────┘  └────┬──────┘                                  │
│       │             │                                          │
│       ▼             ▼                                          │
│  ┌──────────┐  ┌──────────┐                                  │
│  │Atomic    │  │Atomic    │  ◄── MODIFIED: Atomic writes      │
│  │Write     │  │Write     │                                   │
│  │Approved  │  │Revision  │                                   │
│  └────┬─────┘  └────┬──────┘                                  │
│       │             │                                          │
│       ▼             ▼                                          │
│  ┌──────────────────────┐                                     │
│  │ Create Checkpoint    │  ◄── NEW: Save final state          │
│  │ (POST_WRITE)         │                                     │
│  └──────────┬───────────┘                                     │
│             │                                                  │
└─────────────┼──────────────────────────────────────────────────┘
              │
              ▼
        ┌──────────┐
        │ Complete │
        └──────────┘
```

---

## Key Design Changes

### 1. Deduplication Guard (Fixes FLAW #1)

**Purpose:** Prevent concurrent executions from creating race conditions

**Implementation:**
```javascript
// Node: Deduplication Guard
const workflowId = 'content-generator-v2';
const executionId = $execution.id;

// Check for running executions
const runningExecutions = await fetch(
  `http://localhost:5678/api/v1/executions?workflowId=${workflowId}&status=running`,
  { headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY }}
).then(r => r.json());

if (runningExecutions.data.length > 1) {
  // Another execution is running
  const otherExecution = runningExecutions.data.find(e => e.id !== executionId);
  throw new Error(
    `QUEUE: Another execution (${otherExecution.id}) is running. ` +
    `Aborting to prevent race condition.`
  );
}

// Also implement distributed lock for extra safety
const fs = require('fs');
const lockFile = `${baseDir}/.workflow-lock`;

try {
  fs.writeFileSync(lockFile, executionId, { flag: 'wx' });
} catch (error) {
  throw new Error('LOCK: Another execution holds the lock');
}

// Continue execution
return { json: { execution_id: executionId }};
```

**Cleanup (at workflow end):**
```javascript
// Remove lock file
const fs = require('fs');
const lockFile = `${baseDir}/.workflow-lock`;
if (fs.existsSync(lockFile)) {
  fs.unlinkSync(lockFile);
}
```

---

### 2. Early Manifest Validation (Fixes FLAW #2)

**Purpose:** Validate manifest structure before splitting into parallel streams

**Implementation:**
```javascript
// Node: Validate Manifest (NEW - between Load Context Manifest and Split Sources)
const manifest = $input.first().json;

// Validation functions
function validateManifest(manifest) {
  const errors = [];

  // Check required top-level fields
  if (!manifest.version) errors.push('Missing: version');
  if (!manifest.run_id) errors.push('Missing: run_id');
  if (!manifest.created_at) errors.push('Missing: created_at');

  // Check sources array
  if (!manifest.sources) {
    throw new Error('MANIFEST_INVALID: sources array is undefined');
  }

  if (!Array.isArray(manifest.sources)) {
    throw new Error('MANIFEST_INVALID: sources is not an array');
  }

  if (manifest.sources.length === 0) {
    throw new Error('MANIFEST_INVALID: sources array is empty');
  }

  // Validate each source
  const requiredFields = ['path', 'category', 'priority', 'required'];
  manifest.sources.forEach((source, index) => {
    requiredFields.forEach(field => {
      if (!(field in source)) {
        errors.push(`Source ${index}: missing required field "${field}"`);
      }
    });

    // Validate types
    if (source.path && typeof source.path !== 'string') {
      errors.push(`Source ${index}: path must be string`);
    }

    if (source.category && !['services', 'brand', 'projects', 'team'].includes(source.category)) {
      errors.push(`Source ${index}: invalid category "${source.category}"`);
    }

    if (source.priority && (source.priority < 1 || source.priority > 5)) {
      errors.push(`Source ${index}: priority must be 1-5`);
    }
  });

  // Check for duplicates
  const paths = manifest.sources.map(s => s.path);
  const uniquePaths = new Set(paths);
  if (paths.length !== uniquePaths.size) {
    const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
    errors.push(`Duplicate sources: ${duplicates.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new Error('MANIFEST_INVALID:\n' + errors.join('\n'));
  }

  return manifest;
}

// Run validation
validateManifest(manifest);

return { json: manifest };
```

---

### 3. Separated Read/Normalize/Validate (Fixes FLAW #3)

**Purpose:** Separate concerns for granular error handling

**Node 1: Read Context File** (existing, no changes)

**Node 2: Normalize Content** (NEW)
```javascript
const sourceInfo = $('Split Sources').item.json;
const fileDataInput = $input.all();

// Check if read failed
if (fileDataInput.length === 0 || !fileDataInput[0].json.data) {
  return {
    json: {
      source: sourceInfo,
      error: 'FILE_NOT_FOUND',
      error_message: `File does not exist: ${sourceInfo.path}`,
      skip_validation: true
    }
  };
}

const rawContent = fileDataInput[0].json.data;

// Check for empty content
if (!rawContent || rawContent.trim().length === 0) {
  return {
    json: {
      source: sourceInfo,
      error: 'FILE_EMPTY',
      error_message: `File is empty: ${sourceInfo.path}`,
      skip_validation: true,
      content: { raw: '', word_count: 0, char_count: 0, sections: [] }
    }
  };
}

// Check for binary content
const containsBinary = /[\x00-\x08\x0E-\x1F]/.test(rawContent);
if (containsBinary) {
  return {
    json: {
      source: sourceInfo,
      error: 'FILE_INVALID',
      error_message: `File contains binary data: ${sourceInfo.path}`,
      skip_validation: true
    }
  };
}

// Normalize structure
const normalized = {
  source: { ...sourceInfo },
  content: {
    raw: rawContent,
    word_count: rawContent.split(/\s+/).filter(w => w.length > 0).length,
    char_count: rawContent.length,
    sections: rawContent.split('\n\n').filter(s => s.trim().length > 0)
  },
  metadata: {
    processed_at: new Date().toISOString(),
    file_exists: true,
    normalized: true
  }
};

return { json: normalized };
```

**Node 3: Validate Content** (NEW)
```javascript
const normalized = $input.first().json;

// Skip validation if previous error
if (normalized.error && normalized.skip_validation) {
  return { json: { ...normalized, validation_status: 'SKIPPED' }};
}

const issues = [];

// Validation rules
if (normalized.content.word_count < 10) {
  issues.push({
    rule: 'MIN_WORD_COUNT',
    message: `Content too short: ${normalized.content.word_count} words (min 10)`,
    severity: 'ERROR'
  });
}

if (normalized.content.sections.length === 0) {
  issues.push({
    rule: 'MIN_SECTIONS',
    message: 'No sections found in content',
    severity: 'WARNING'
  });
}

// For required files, throw error
if (normalized.source.required && issues.filter(i => i.severity === 'ERROR').length > 0) {
  throw new Error(
    `VALIDATION_FAILED: ${normalized.source.path}\n` +
    issues.map(i => `  - ${i.message}`).join('\n')
  );
}

// Return with validation metadata
return {
  json: {
    ...normalized,
    validation: {
      passed: issues.length === 0,
      issues: issues,
      validated_at: new Date().toISOString()
    }
  }
};
```

---

### 4. API Resilience Layer (Fixes FLAW #4)

**4.1: Generate Idempotency Key**
```javascript
const crypto = require('crypto');
const promptData = $input.first().json;

const idempotencyInput = JSON.stringify({
  run_id: promptData.run_metadata.run_id,
  manifest_version: promptData.run_metadata.manifest_version,
  context_hash: crypto.createHash('sha256')
    .update(JSON.stringify(promptData.context_sources))
    .digest('hex')
});

const idempotencyKey = crypto.createHash('sha256')
  .update(idempotencyInput)
  .digest('hex');

// Check cache
const resultCachePath = `${baseDir}/.cache/results/${idempotencyKey}.json`;
if (fs.existsSync(resultCachePath)) {
  console.log('CACHE HIT: Using cached result');
  const cachedResult = JSON.parse(fs.readFileSync(resultCachePath, 'utf-8'));
  return { json: cachedResult };
}

return { json: { ...promptData, idempotency_key: idempotencyKey }};
```

**4.2: Create Checkpoint**
```javascript
const workflowState = $input.first().json;

const checkpoint = {
  checkpoint_id: `chk_${Date.now()}`,
  workflow_version: '2.0.0',
  run_id: workflowState.run_metadata.run_id,
  stage: 'PRE_API_CALL',
  state: workflowState,
  created_at: new Date().toISOString(),
  execution_id: $execution.id
};

const checkpointPath = `${baseDir}/.checkpoints/${checkpoint.run_id}/${checkpoint.stage}.json`;
fs.mkdirSync(path.dirname(checkpointPath), { recursive: true });
fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));

return { json: workflowState };
```

**4.3: Circuit Breaker Check**
(See RETRY_STRATEGIES.md for full implementation)

**4.4: Claude Generate** (with timeout)
```javascript
// Add timeout parameter
{
  "parameters": {
    "timeout": 30000,  // 30 seconds
    "ignoreResponseCode": true  // Handle errors manually
  }
}
```

**4.5: API Response Handler**
(See RETRY_STRATEGIES.md for full implementation)

---

### 5. Contract-Based Validation (Fixes FLAW #5)

**Purpose:** Replace arbitrary scoring with explicit validation contract

**Implementation:**
```javascript
// Define validation contract
const VALIDATION_CONTRACT = {
  version: '1.0.0',

  critical: {
    has_required_fields: {
      rule: post => post.variation && post.hook && post.body && post.cta && post.hashtags && post.word_count !== undefined,
      message: 'Missing required fields',
      severity: 'CRITICAL'
    },
    no_forbidden_words: {
      rule: post => {
        const forbidden = ['revolutionary', 'game-changing', 'disruptive', 'transform your'];
        const text = `${post.hook} ${post.body} ${post.cta}`.toLowerCase();
        return !forbidden.some(word => text.includes(word));
      },
      message: 'Contains forbidden marketing hype words',
      severity: 'CRITICAL'
    },
    valid_word_count: {
      rule: post => post.word_count >= 120 && post.word_count <= 180,
      message: 'Word count outside range (120-180)',
      severity: 'CRITICAL'
    }
  },

  important: {
    correct_hashtag_count: {
      rule: post => Array.isArray(post.hashtags) && post.hashtags.length === 4,
      message: 'Must have exactly 4 hashtags',
      severity: 'IMPORTANT'
    },
    emoji_limit: {
      rule: post => {
        const emojiRegex = /[\p{Emoji}]/gu;
        const text = `${post.hook} ${post.body} ${post.cta}`;
        const count = (text.match(emojiRegex) || []).length;
        return count <= 2;
      },
      message: 'Too many emojis (max 2)',
      severity: 'IMPORTANT'
    }
  }
};

// Apply contract
function validatePost(post, contract) {
  const results = { critical: [], important: [] };

  for (const [level, rules] of Object.entries(contract)) {
    if (level === 'version') continue;

    for (const [ruleName, validation] of Object.entries(rules)) {
      const passed = validation.rule(post);
      if (!passed) {
        results[level].push({
          rule: ruleName,
          message: validation.message,
          severity: validation.severity
        });
      }
    }
  }

  // Determine status based on CONTRACT
  let status;
  if (results.critical.length > 0) {
    status = 'REJECTED';
  } else if (results.important.length > 0) {
    status = 'NEEDS_REVISION';
  } else {
    status = 'APPROVED';
  }

  return {
    status: status,
    validation: {
      contract_version: contract.version,
      critical_issues: results.critical,
      important_issues: results.important
    }
  };
}
```

---

### 6. Content Hash Versioning (Fixes FLAW #6)

**Purpose:** Prevent file collisions using content-based hashing

**Implementation:**
```javascript
// In Normalize Approved/Revision nodes
const crypto = require('crypto');
const post = $input.first().json;

// Generate content hash
const contentHash = crypto.createHash('sha256')
  .update(post.full_text)
  .digest('hex')
  .substring(0, 8);

// Build filename with version + content hash
const filename = `${post.version}-${contentHash}.md`;
const filePath = `${baseDir}/generated-posts/batch-${batchDate}/${subdir}/${filename}`;

// Check if file exists
if (fs.existsSync(filePath)) {
  const existingContent = fs.readFileSync(filePath, 'utf-8');
  const existingFullText = existingContent.match(/## READY TO POST\n\n([\s\S]*)/)?.[1] || '';
  const existingHash = crypto.createHash('sha256')
    .update(existingFullText)
    .digest('hex')
    .substring(0, 8);

  if (existingHash === contentHash) {
    // Identical content, skip write
    return {
      json: {
        action: 'SKIPPED',
        reason: 'Identical content already exists',
        file_path: filePath,
        content_hash: contentHash
      }
    };
  }

  // Different content with same version, add timestamp
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  filename = `${post.version}-${contentHash}-${timestamp}.md`;
  filePath = `${baseDir}/generated-posts/batch-${batchDate}/${subdir}/${filename}`;
}

// Proceed with write
```

**Atomic Write Implementation:**
```javascript
// In Write Approved/Revision nodes
const data = $input.first().json;

if (data.action === 'SKIPPED') {
  return { json: data };
}

// Ensure directory exists
const dir = path.dirname(data.file_path);
fs.mkdirSync(dir, { recursive: true });

// Atomic write: write to temp file, then rename
const tempPath = `${data.file_path}.tmp.${process.pid}`;
fs.writeFileSync(tempPath, data.file_content, 'utf-8');
fs.renameSync(tempPath, data.file_path);

// Verify write
const verifyContent = fs.readFileSync(data.file_path, 'utf-8');
if (verifyContent !== data.file_content) {
  throw new Error(`WRITE_VERIFICATION_FAILED: ${data.file_path}`);
}

return { json: { ...data, write_successful: true, write_verified: true }};
```

---

## Configuration

### Environment Variables

```bash
# Required
N8N_API_KEY=your_api_key_here
ANTHROPIC_API_KEY=your_claude_api_key_here
BASE_DIR=/path/to/contentCreator

# Optional (with defaults)
WORKFLOW_MAX_QUEUE_SIZE=3
WORKFLOW_QUEUE_TIMEOUT=600000  # 10 minutes
API_RETRY_MAX_ATTEMPTS=3
API_TIMEOUT_MS=30000
CIRCUIT_BREAKER_THRESHOLD=5
CIRCUIT_BREAKER_TIMEOUT_MS=60000
```

### Workflow Settings

```json
{
  "settings": {
    "executionOrder": "v1",
    "executionTimeout": 3600,  // 1 hour max
    "timezone": "America/Los_Angeles",
    "saveExecutionProgress": true,
    "saveManualExecutions": true,
    "saveExecutionOnError": "all"
  }
}
```

---

## Performance Considerations

- **Context Loading:** ~5-10 seconds for 4 files
- **API Call:** ~20-30 seconds for Claude generation
- **Validation:** ~1-2 seconds
- **File Writes:** ~1 second

**Total Execution Time:** ~30-45 seconds per run

---

## Related Documentation

- [ERROR_CATALOG.md](../error-handling/ERROR_CATALOG.md) - All errors addressed
- [FAILURE_SCENARIOS.md](../error-handling/FAILURE_SCENARIOS.md) - Non-happy paths
- [RETRY_STRATEGIES.md](../error-handling/RETRY_STRATEGIES.md) - Resilience patterns
- [TEST_PLAN.md](../testing/TEST_PLAN.md) - Testing strategy

---

**Version:** 2.0.0
**Last Updated:** 2025-11-10
**Status:** Design Complete - Ready for Implementation
