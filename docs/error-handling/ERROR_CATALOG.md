# Error Catalog - AI-Whisperers Content Generator

## Overview

Comprehensive catalog of all errors, failure modes, and edge cases in the content generator workflow. Each error includes severity, impact, detection method, and mitigation strategy.

---

## Critical Flaws (Production Blockers)

### FLAW-001: Double Trigger Race Condition

**Severity:** CRITICAL
**Impact:** Data corruption, file overwrites, version desync
**Location:** `content-generator-linkedin.json:18-37` (Webhook + Schedule triggers)

#### Description
Two independent triggers (Webhook + Twice Weekly Schedule) both feed into the same execution chain without synchronization. If both fire simultaneously, they create concurrent executions with identical `runId` values, leading to file collisions.

#### Technical Details
```javascript
// Line 40: Both triggers generate same runId
const runId = new Date().toISOString().split('T')[0].replace(/-/g, '');
// Example: "20251110" for both executions on same day
```

#### Failure Scenarios
1. **Scenario A:** Manual webhook trigger at 9:58am, schedule fires at 10:00am
   - Both create `batch-20251110/` directory
   - Both write to same files
   - Last writer wins, first batch data lost

2. **Scenario B:** Webhook retry during scheduled run
   - If webhook has retry logic and retries during schedule
   - Same race condition

3. **Scenario C:** Multiple manual triggers in same day
   - Developer triggers twice for testing
   - Second run overwrites first

#### Error Symptoms
- Missing generated posts from earlier run
- Partial content in output files
- Inconsistent post counts (expected 5, got 3)
- Frontmatter version mismatches

#### Detection
```bash
# Check for concurrent workflow executions
curl -X GET http://localhost:5678/api/v1/executions \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '[.data[] | select(.workflowId == "content-generator-v2" and .status == "running")]'

# If length > 1, race condition is occurring
```

#### Mitigation Strategy

**Option 1: Execution Queue (RECOMMENDED)**
```javascript
// NEW NODE: Deduplication Guard (before Load Context Manifest)
const executionId = $execution.id;
const workflowId = $workflow.id;

// Check for running executions
const runningExecutions = await fetch(
  `http://localhost:5678/api/v1/executions?workflowId=${workflowId}&status=running`,
  { headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY }}
).then(r => r.json());

if (runningExecutions.data.length > 1) {
  throw new Error('QUEUE: Another execution is running. Aborting to prevent race condition.');
}
```

**Option 2: Distributed Lock**
```javascript
// Use file-based lock
const lockFile = `${baseDir}/.workflow-lock`;
const fs = require('fs');

try {
  // Try to create lock file (fails if exists)
  fs.writeFileSync(lockFile, executionId, { flag: 'wx' });
} catch (error) {
  throw new Error('LOCK: Another execution holds the lock');
}

// Continue execution...
// At end: fs.unlinkSync(lockFile);
```

**Option 3: Unique RunID with Timestamp**
```javascript
// Use millisecond-precision timestamp
const runId = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').split('.')[0];
// Example: "20251110-100315" (YYYYMMDD-HHMMSS)
```

#### Prevention Checklist
- [ ] Add deduplication guard node
- [ ] Implement execution queue
- [ ] Add unique timestamp to runId
- [ ] Monitor concurrent executions
- [ ] Add alerting for race conditions

---

### FLAW-002: Context Validation After Split

**Severity:** CRITICAL
**Impact:** Entire batch fails silently with garbage data
**Location:** `content-generator-linkedin.json:54-81`

#### Description
Context manifest is split into individual sources (line 54) BEFORE the manifest itself is validated. If the manifest structure is invalid, the split operation produces garbage that propagates through the entire workflow.

#### Technical Details
```javascript
// Line 54: Split happens BEFORE validation
"Split Sources" → extracts manifest.sources array
// But manifest was NEVER validated!

// Line 75: Validation happens per-source, not per-manifest
"Read + Normalize + Validate" → validates individual files
```

#### Failure Scenarios

**Scenario A: Missing sources array**
```javascript
// Malformed manifest
const contextManifest = {
  version: '2.0.0',
  run_id: '20251110',
  // sources: [] <-- MISSING!
};

// Split Sources tries to iterate undefined
sources = manifest.sources || [];  // Returns []
// Workflow continues with ZERO sources!
```

**Scenario B: Invalid source structure**
```javascript
// sources array has wrong structure
sources: [
  { file: '/path/to/file.md' }  // Missing: category, priority, required
]

// Later nodes expect .path but get .file
// Fails at read step with cryptic error
```

**Scenario C: Duplicate sources**
```javascript
sources: [
  { path: '/brand/voice.md', category: 'brand' },
  { path: '/brand/voice.md', category: 'brand' }  // DUPLICATE
]

// Reads same file twice, wastes tokens
```

#### Error Symptoms
- Workflow completes but generates 0 posts
- "Cannot read property 'path' of undefined"
- Unexpected token count in Claude API call
- Missing context categories in final output

#### Detection
```javascript
// Add before Split Sources node
function validateManifest(manifest) {
  const errors = [];

  if (!manifest.sources) {
    errors.push('CRITICAL: manifest.sources is undefined');
  }

  if (!Array.isArray(manifest.sources)) {
    errors.push('CRITICAL: manifest.sources is not an array');
  }

  if (manifest.sources.length === 0) {
    errors.push('CRITICAL: manifest.sources is empty');
  }

  const requiredFields = ['path', 'category', 'priority', 'required'];
  manifest.sources.forEach((source, i) => {
    requiredFields.forEach(field => {
      if (!(field in source)) {
        errors.push(`Source ${i}: missing required field "${field}"`);
      }
    });
  });

  // Check for duplicates
  const paths = manifest.sources.map(s => s.path);
  const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (duplicates.length > 0) {
    errors.push(`Duplicate sources: ${duplicates.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new Error('MANIFEST VALIDATION FAILED:\n' + errors.join('\n'));
  }

  return manifest;
}
```

#### Mitigation Strategy

**Insert new node: "Validate Manifest" between Load Context Manifest and Split Sources**

```javascript
// NEW NODE: Validate Manifest (after Load Context Manifest, before Split Sources)
const manifest = $input.first().json;

// Schema validation
const schema = {
  required: ['version', 'run_id', 'sources', 'created_at'],
  sources: {
    minItems: 1,
    items: {
      required: ['path', 'category', 'priority', 'required'],
      properties: {
        path: { type: 'string', minLength: 5 },
        category: { type: 'string', enum: ['services', 'brand', 'projects', 'team'] },
        priority: { type: 'number', minimum: 1, maximum: 5 },
        required: { type: 'boolean' }
      }
    }
  }
};

// Run validation
validateManifest(manifest);  // Throws if invalid

return { json: manifest };
```

#### Prevention Checklist
- [ ] Add "Validate Manifest" node before Split
- [ ] Validate schema structure
- [ ] Check for required fields
- [ ] Detect duplicates
- [ ] Verify file paths exist
- [ ] Add unit tests for manifest validation

---

### FLAW-003: Monolithic Read+Normalize+Validate

**Severity:** HIGH
**Impact:** Cannot distinguish error types, no granular recovery
**Location:** `content-generator-linkedin.json:72-81` (109-line code block)

#### Description
Three distinct operations (Read, Normalize, Validate) are combined into a single node with unified error handling. This makes it impossible to distinguish between file read errors, normalization failures, and validation failures.

#### Technical Details
```javascript
// Lines 73-81: ALL operations in one try-catch
const rawContent = fileData.data || '';  // READ
const normalized = { /* ... */ };         // NORMALIZE
if (normalized.content.word_count < 10) { // VALIDATE
  throw new Error(...);
}
```

#### Failure Scenarios

**Scenario A: File not found**
```javascript
// File doesn't exist
const rawContent = fileData.data || '';  // Returns empty string
// Normalization continues with empty content
// Validation fails with "Context too short"
// BUT root cause was file not found!
```

**Scenario B: Malformed content**
```javascript
// File contains binary data or null bytes
const sections = rawContent.split('\n\n');  // May produce garbage
// Normalization produces invalid structure
// Validation may pass despite bad data
```

**Scenario C: Content below threshold**
```javascript
// File exists but only has 5 words
// Validation throws error
// BUT we lose the normalized data structure
// Cannot retry with lower threshold
```

#### Error Symptoms
- Generic "VALIDATION FAILED" errors
- Cannot distinguish read vs validation failures
- No partial recovery (all-or-nothing)
- Debugging requires reading logs manually

#### Detection
Check error messages for ambiguity:
```bash
# Bad error message (current)
"VALIDATION FAILED: Context too short: /path/to/file.md"

# Was it:
# - File not found?
# - File empty?
# - File too short but valid?
# - File corrupted?
```

#### Mitigation Strategy

**Split into 3 separate nodes:**

**Node 1: Read File**
```javascript
// Read Context File (EXISTING - keep as-is)
// Already isolated, just reads file
```

**Node 2: Normalize Content (NEW)**
```javascript
// NEW NODE: Normalize Content
const sourceInfo = $('Split Sources').item.json;
const fileData = $input.first().json;
const rawContent = fileData.data || '';

// Check if file was read
if (!rawContent || rawContent.length === 0) {
  return {
    json: {
      source: sourceInfo,
      error: 'FILE_EMPTY',
      error_message: `File is empty or not found: ${sourceInfo.path}`,
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

**Node 3: Validate Content (NEW)**
```javascript
// NEW NODE: Validate Content
const normalized = $input.first().json;

// Skip validation if normalization failed
if (normalized.error) {
  return { json: { ...normalized, validation_status: 'SKIPPED' }};
}

const issues = [];

// Validation rules
if (normalized.content.word_count < 10) {
  issues.push('Content too short (< 10 words)');
}

if (normalized.content.sections.length === 0) {
  issues.push('No sections found');
}

// Required file validation
if (normalized.source.required && issues.length > 0) {
  throw new Error(`REQUIRED FILE VALIDATION FAILED: ${normalized.source.path}\n${issues.join('\n')}`);
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

#### Prevention Checklist
- [ ] Split into 3 separate nodes
- [ ] Add distinct error types (FILE_EMPTY, NORMALIZE_FAILED, VALIDATION_FAILED)
- [ ] Implement granular error handling per node
- [ ] Add recovery paths for each error type
- [ ] Test each operation independently

---

### FLAW-004: Claude API - Zero Resilience

**Severity:** CRITICAL
**Impact:** Total workflow failure on API issues
**Location:** `content-generator-linkedin.json:106-138`

#### Description
Single HTTP request to Claude API with no retry logic, no rate limit handling, no timeout management, and no fallback strategy. Any API issue causes complete workflow failure.

#### Technical Details
```javascript
// Line 106-138: Direct HTTP request with NO error handling
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    // NO retry, NO timeout, NO fallback
  }
}
```

#### Failure Scenarios

**Scenario A: Rate Limit (429)**
```
Response: HTTP 429 Too Many Requests
{
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded"
  }
}

Result: Workflow fails, entire week's content lost
```

**Scenario B: Timeout**
```
Request hangs for 120+ seconds (n8n default timeout)
Result: Workflow fails with timeout error
```

**Scenario C: API Degradation**
```
Response time: 30+ seconds
Status: 200 but slow
Result: Workflow completes but takes too long
```

**Scenario D: Invalid Response**
```
Status: 200
Body: HTML error page instead of JSON
Result: JSON parse error in Hard Validator
```

**Scenario E: Overloaded Error (529)**
```
Response: HTTP 529 Overloaded
Message: "API is temporarily overloaded"
Result: Workflow fails
```

#### Error Symptoms
- "Request failed with status code 429"
- "ETIMEDOUT" errors
- "JSON parse error" in validator
- Workflow stuck in "running" state
- No generated content despite successful context loading

#### Detection
```javascript
// Check Claude API response status
const response = $input.first().json;

if (response.error) {
  const errorType = response.error.type;
  console.log(`Claude API Error: ${errorType}`);
  console.log(`Message: ${response.error.message}`);
}

// Check response time
const responseTime = $execution.data.metadata.responseTime;
if (responseTime > 10000) {
  console.warn(`Slow API response: ${responseTime}ms`);
}
```

#### Mitigation Strategy

**Wrap Claude Generate with error handling and retry logic:**

**Node 1: Pre-API Checkpoint**
```javascript
// NEW NODE: Pre-API Checkpoint (before Claude Generate)
const promptData = $input.first().json;

// Store state for potential retry
const checkpoint = {
  prompt: promptData,
  attempt: 1,
  max_attempts: 3,
  timestamp: new Date().toISOString()
};

// Write checkpoint to disk
const fs = require('fs');
const checkpointPath = `${baseDir}/.checkpoints/pre-api-${promptData.run_metadata.run_id}.json`;
fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));

return { json: checkpoint };
```

**Node 2: Claude Generate with Timeout**
```javascript
// MODIFIED: Claude Generate
// Add timeout and error handling
{
  "parameters": {
    "timeout": 30000,  // 30 second timeout
    "ignoreResponseCode": true,  // Don't auto-fail on non-200
    // ... rest of config
  }
}
```

**Node 3: API Response Handler (NEW)**
```javascript
// NEW NODE: API Response Handler (after Claude Generate)
const response = $input.first().json;
const checkpoint = $('Pre-API Checkpoint').first().json;

// Check for errors
if (response.error || !response.content) {
  const errorType = response.error?.type || 'UNKNOWN';
  const errorMessage = response.error?.message || 'No content in response';

  // Determine if retriable
  const retriableErrors = [
    'rate_limit_error',
    'overloaded_error',
    'timeout_error',
    'api_error'
  ];

  const isRetriable = retriableErrors.includes(errorType);

  if (isRetriable && checkpoint.attempt < checkpoint.max_attempts) {
    // Calculate backoff
    const backoffMs = Math.pow(2, checkpoint.attempt) * 1000; // 2s, 4s, 8s

    throw new Error(`RETRY: ${errorType} - Attempt ${checkpoint.attempt}/${checkpoint.max_attempts}. Waiting ${backoffMs}ms`);
  } else {
    // Non-retriable or max attempts reached
    throw new Error(`FATAL: ${errorType} - ${errorMessage}`);
  }
}

// Success - return response
return { json: response };
```

**Node 4: Retry Handler (NEW)**
```javascript
// NEW NODE: Retry Handler (error path from API Response Handler)
const error = $input.first().error;
const checkpoint = $('Pre-API Checkpoint').first().json;

// Increment attempt
checkpoint.attempt += 1;

// Wait for backoff period
const backoffMs = Math.pow(2, checkpoint.attempt - 1) * 1000;
await new Promise(resolve => setTimeout(resolve, backoffMs));

// Return to Pre-API Checkpoint
return { json: checkpoint };
```

#### Retry Strategy Details

| Error Type | Retry? | Backoff | Max Attempts |
|------------|--------|---------|--------------|
| rate_limit_error (429) | Yes | Exponential (2s, 4s, 8s) | 3 |
| overloaded_error (529) | Yes | Exponential (2s, 4s, 8s) | 3 |
| timeout_error | Yes | Exponential | 3 |
| invalid_request_error (400) | No | - | 0 |
| authentication_error (401) | No | - | 0 |
| permission_error (403) | No | - | 0 |
| not_found_error (404) | No | - | 0 |

#### Prevention Checklist
- [ ] Add Pre-API Checkpoint node
- [ ] Add API Response Handler node
- [ ] Implement retry logic with exponential backoff
- [ ] Add timeout configuration
- [ ] Store checkpoints for recovery
- [ ] Add monitoring for API errors
- [ ] Implement fallback to cached prompts
- [ ] Add cost monitoring

---

### FLAW-005: Status Branching Logic (Backwards)

**Severity:** MEDIUM
**Impact:** Arbitrary quality thresholds, no clear validation contract
**Location:** `content-generator-linkedin.json:144-167`

#### Description
Validator creates the status field based on arbitrary quality score (>= 70), then branches on that status. This is backwards - the status should be determined by explicit validation rules against a schema contract, not a magic number.

#### Technical Details
```javascript
// Line 164: Arbitrary threshold
const qualityScore = Math.max(0, 100 - (issues.length * 20));
const status = qualityScore >= 70 ? 'APPROVED' : 'NEEDS_REVISION';

// WHY 70? Why not 65? Why not 80?
// Why does each issue = -20 points?
```

#### Failure Scenarios

**Scenario A: Unclear Pass/Fail Criteria**
```javascript
// Post with 1 issue gets 80 (APPROVED)
// Post with 2 issues gets 60 (NEEDS_REVISION)

// But what if:
// - Issue 1: Minor formatting (should approve)
// - Issue 2: Contains forbidden word (should reject)

// Current logic treats all issues equally
```

**Scenario B: Threshold Drift**
```javascript
// Developer changes threshold from 70 to 60
// Now more posts auto-approve
// Quality degrades over time
// No audit trail of why threshold changed
```

**Scenario C: Edge Case at Threshold**
```javascript
// Post scores exactly 70
// Is it approved?
// >= 70 says yes, but borderline quality
```

#### Error Symptoms
- Inconsistent quality in approved posts
- No clear reason why posts are rejected
- Cannot explain approval logic to stakeholders
- Quality drift over time

#### Detection
```bash
# Analyze approved vs rejected posts
grep -r "status: APPROVED" generated-posts/ | wc -l
grep -r "status: NEEDS_REVISION" generated-posts/ | wc -l

# Check quality scores
grep -r "quality_score:" generated-posts/ | awk '{print $2}' | sort -n
```

#### Mitigation Strategy

**Replace arbitrary scoring with explicit validation contract:**

```javascript
// NEW: Validation Contract (before Hard Validator)
const VALIDATION_CONTRACT = {
  // CRITICAL: Must pass or reject
  critical: {
    has_required_fields: {
      rule: post => post.variation && post.hook && post.body && post.cta && post.hashtags,
      message: 'Missing required fields'
    },
    no_forbidden_words: {
      rule: post => {
        const forbidden = ['revolutionary', 'game-changing', 'disruptive', 'transform your'];
        const text = `${post.hook} ${post.body} ${post.cta}`.toLowerCase();
        return !forbidden.some(word => text.includes(word));
      },
      message: 'Contains forbidden words'
    },
    valid_word_count: {
      rule: post => post.word_count >= 120 && post.word_count <= 180,
      message: 'Word count outside range (120-180)'
    }
  },

  // IMPORTANT: Should pass but can override
  important: {
    correct_hashtag_count: {
      rule: post => Array.isArray(post.hashtags) && post.hashtags.length === 4,
      message: 'Must have exactly 4 hashtags'
    },
    emoji_limit: {
      rule: post => {
        const emojiRegex = /[\p{Emoji}]/gu;
        const text = `${post.hook} ${post.body} ${post.cta}`;
        const count = (text.match(emojiRegex) || []).length;
        return count <= 2;
      },
      message: 'Too many emojis (max 2)'
    }
  },

  // NICE_TO_HAVE: Informational only
  nice_to_have: {
    has_cta_question: {
      rule: post => post.cta.includes('?'),
      message: 'CTA should include a question'
    },
    sections_balanced: {
      rule: post => {
        const hookLen = post.hook.length;
        const bodyLen = post.body.length;
        return bodyLen > hookLen * 2;  // Body should be 2x hook
      },
      message: 'Body should be longer than hook'
    }
  }
};

// MODIFIED: Hard Validator
function validatePost(post, contract) {
  const results = {
    critical: [],
    important: [],
    nice_to_have: []
  };

  // Run validations
  for (const [level, rules] of Object.entries(contract)) {
    for (const [ruleName, validation] of Object.entries(rules)) {
      const passed = validation.rule(post);
      if (!passed) {
        results[level].push({
          rule: ruleName,
          message: validation.message
        });
      }
    }
  }

  // Determine status based on CONTRACT, not arbitrary score
  let status;
  if (results.critical.length > 0) {
    status = 'REJECTED';  // Critical failures = hard reject
  } else if (results.important.length > 0) {
    status = 'NEEDS_REVISION';  // Important issues = needs review
  } else {
    status = 'APPROVED';  // Passes all critical + important
  }

  return {
    status: status,
    validation: {
      critical_issues: results.critical,
      important_issues: results.important,
      suggestions: results.nice_to_have
    },
    contract_version: '1.0.0'
  };
}
```

#### Prevention Checklist
- [ ] Define explicit validation contract
- [ ] Replace quality score with contract-based validation
- [ ] Separate critical, important, and nice-to-have rules
- [ ] Document why each rule exists
- [ ] Version the validation contract
- [ ] Add unit tests for each validation rule
- [ ] Track contract changes over time

---

### FLAW-006: Version Tagging Incomplete

**Severity:** HIGH
**Impact:** File overwrites on collision, no atomic writes
**Location:** `content-generator-linkedin.json:170-213`

#### Description
Version tags are generated correctly but not used in filenames. Instead, filenames use post_id which can collide on concurrent runs or retries. No content hashing, no collision detection, no atomic writes.

#### Technical Details
```javascript
// Line 167: Version is generated
const versionTag = `v2.0.0-20251110-0`;

// Line 171: But filename uses post_id instead
const filePath = `batch-20251110/approved/${post.post_id}.md`;
// Should use: `batch-20251110/approved/${versionTag}-${contentHash}.md`
```

#### Failure Scenarios

**Scenario A: Same-day Retry**
```javascript
// Run 1: Generates service-showcase-v2.0.0-20251110-0.md
// Run 2 (same day): Generates service-showcase-v2.0.0-20251110-0.md
// Result: Run 2 OVERWRITES Run 1 with no warning
```

**Scenario B: Concurrent Writes**
```javascript
// Webhook run writes file
// Schedule run writes same file simultaneously
// Result: Corrupted file or partial write
```

**Scenario C: Lost History**
```javascript
// Developer reruns generator to improve prompt
// New output overwrites old output
// Cannot compare old vs new
// Cannot rollback to previous version
```

#### Error Symptoms
- Mysteriously missing posts
- Content changes without explanation
- Cannot track which version is deployed
- No audit trail of content changes

#### Detection
```bash
# Check for duplicate post_ids
find generated-posts/ -name "*.md" -exec basename {} \; | sort | uniq -d

# Check for missing versions
grep -r "version:" generated-posts/ | cut -d: -f3 | sort | uniq -c
```

#### Mitigation Strategy

**Use version tag + content hash in filename:**

```javascript
// MODIFIED: Normalize Approved / Normalize Revision
const crypto = require('crypto');

const post = $input.first().json;
const batchDate = post.metadata.run_id;
const isApproved = post.status === 'APPROVED';
const subdir = isApproved ? 'approved' : 'needs-revision';

// Generate content hash
const contentHash = crypto
  .createHash('sha256')
  .update(post.full_text)
  .digest('hex')
  .substring(0, 8);  // First 8 chars

// Use version tag + content hash in filename
const filename = `${post.version}-${contentHash}.md`;
const filePath = `${baseDir}/generated-posts/batch-${batchDate}/${subdir}/${filename}`;

// Check if file exists
const fs = require('fs');
if (fs.existsSync(filePath)) {
  // Read existing file
  const existingContent = fs.readFileSync(filePath, 'utf-8');
  const existingHash = crypto
    .createHash('sha256')
    .update(existingContent.match(/## READY TO POST\n\n([\s\S]*)/)?.[1] || '')
    .digest('hex')
    .substring(0, 8);

  if (existingHash === contentHash) {
    console.log(`SKIP: Identical content already exists at ${filePath}`);
    return {
      json: {
        action: 'SKIPPED',
        reason: 'Identical content already exists',
        file_path: filePath
      }
    };
  } else {
    // Different content - create new version
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const uniqueFilename = `${post.version}-${contentHash}-${timestamp}.md`;
    filePath = `${baseDir}/generated-posts/batch-${batchDate}/${subdir}/${uniqueFilename}`;
  }
}

// Build content with versioning
let content = `---
post_id: ${post.post_id}
version: ${post.version}
content_hash: ${contentHash}
variation: ${post.variation}
status: ${post.status}
quality_score: ${post.quality_score}
word_count: ${post.word_count}
emoji_count: ${post.emoji_count}
manifest_version: ${post.metadata.manifest_version}
run_id: ${post.metadata.run_id}
generated_at: ${post.metadata.validated_at}
validation_passed: ${post.metadata.validation_passed}
---

${post.full_text}
`;

return {
  json: {
    file_path: filePath,
    file_content: content,
    post_id: post.post_id,
    version: post.version,
    content_hash: contentHash,
    action: 'WRITE'
  }
};
```

**Add Atomic Write Logic:**

```javascript
// MODIFIED: Write Approved / Write Revision
const data = $input.first().json;

if (data.action === 'SKIPPED') {
  return { json: data };
}

const fs = require('fs');
const path = require('path');

// Ensure directory exists
const dir = path.dirname(data.file_path);
fs.mkdirSync(dir, { recursive: true });

// Atomic write: write to temp file, then rename
const tempPath = `${data.file_path}.tmp`;
fs.writeFileSync(tempPath, data.file_content, 'utf-8');
fs.renameSync(tempPath, data.file_path);

// Verify write
const verifyContent = fs.readFileSync(data.file_path, 'utf-8');
if (verifyContent !== data.file_content) {
  throw new Error(`WRITE VERIFICATION FAILED: ${data.file_path}`);
}

return {
  json: {
    ...data,
    write_successful: true,
    write_verified: true,
    written_at: new Date().toISOString()
  }
};
```

#### Prevention Checklist
- [ ] Use version tag + content hash in filename
- [ ] Check for existing files before write
- [ ] Implement atomic write (temp file + rename)
- [ ] Add write verification
- [ ] Detect duplicate content
- [ ] Add collision handling
- [ ] Store version history

---

## Error Classification

### By Severity

**CRITICAL** (Production blockers)
- FLAW-001: Double Trigger Race Condition
- FLAW-002: Context Validation After Split
- FLAW-004: Claude API - Zero Resilience

**HIGH** (Major issues)
- FLAW-003: Monolithic Read+Normalize+Validate
- FLAW-006: Version Tagging Incomplete

**MEDIUM** (Important improvements)
- FLAW-005: Status Branching Logic

### By Category

**Concurrency Issues**
- FLAW-001: Double Trigger Race Condition
- FLAW-006: Version Tagging Incomplete (concurrent writes)

**Data Validation Issues**
- FLAW-002: Context Validation After Split
- FLAW-003: Monolithic Read+Normalize+Validate
- FLAW-005: Status Branching Logic

**External Dependency Issues**
- FLAW-004: Claude API - Zero Resilience

---

## Quick Reference: Error Response Matrix

| Error | Severity | Retry? | Alert? | Manual Intervention? |
|-------|----------|--------|--------|---------------------|
| FLAW-001 | CRITICAL | No | Yes | Yes |
| FLAW-002 | CRITICAL | No | Yes | Yes |
| FLAW-003 | HIGH | Partial | No | No |
| FLAW-004 | CRITICAL | Yes | After 3 failures | After 3 failures |
| FLAW-005 | MEDIUM | No | No | No |
| FLAW-006 | HIGH | No | No | No |

---

## Version History

- **v1.0.0** (2025-11-10) - Initial error catalog
- Based on workflow version: **2.0.0**
- Critical flaws identified: **6**

---

## Related Documentation

- [FAILURE_SCENARIOS.md](./FAILURE_SCENARIOS.md) - Detailed failure flows
- [RETRY_STRATEGIES.md](./RETRY_STRATEGIES.md) - Retry and resilience patterns
- [RECOVERY_PROCEDURES.md](./RECOVERY_PROCEDURES.md) - How to recover from errors
- [../operations/TROUBLESHOOTING.md](../operations/TROUBLESHOOTING.md) - Diagnostic procedures
