# Content Generation Workflow Architecture v2.0

## Critical Architectural Principles

### 1. DETERMINISM
**Problem**: Original workflow had non-deterministic file discovery that could drift over time.

**Solution**:
- Hardcoded manifest file (`context/manifest.json`) defines ALL sources
- Each source has priority, category, required flag
- Run ID based on date ensures stable batching
- Version tags: `v{manifest_version}-{run_id}-{post_index}`

### 2. VALIDATION SEQUENCE
**Problem**: Original workflow validated AFTER branching, allowing invalid data into storage.

**Solution**:
```
Context → Normalize → Merge → Guardrails → Model → HARD VALIDATE → Branch → Store
```

- **Pre-Model Guardrails**: Size limits, sanitization, required categories
- **Hard Validator**: Schema enforcement, forbidden words, scoring BEFORE branch
- Validation failures throw errors (fail fast)

### 3. BATCHING POSITION
**Problem**: Original workflow batched before context normalization.

**Solution**:
- Merge ALL contexts first
- Single model call with full merged context
- Batch output AFTER validation

### 4. UNIFIED NORMALIZATION
**Problem**: Separate logic for approved vs revision caused spec drift.

**Solution**:
- Same normalizer function for both branches
- Only difference: storage path (`approved/` vs `needs-revision/`)
- Eliminates duplication

### 5. VERSIONING
**Problem**: No version tracking for LLM governance.

**Solution**:
```yaml
version: v2.0.0-20250106-0
manifest_version: 2.0.0
run_id: 20250106
post_index: 0
```

Every post has:
- Manifest version
- Run ID
- Generation timestamp
- Validation results
- Quality score

### 6. CADENCE SEPARATION
**Problem**: 2-week cycle too slow for active development.

**Solution**:
- **Bi-weekly**: Archive/batch cycle (original workflow)
- **Daily**: Active generation at 9 AM (`content-generator-daily.json`)
- Different workflows for different governance needs

## File Structure

```
contentCreator/
├── context/
│   ├── manifest.json           # DETERMINISTIC SOURCE OF TRUTH
│   ├── services/
│   │   ├── custom-ai.md
│   │   └── automation.md
│   └── brand/
│       ├── voice.md
│       └── rules.md
├── workflows/
│   ├── content-generator-linkedin.json    # Bi-weekly archive
│   └── content-generator-daily.json        # Daily active
└── generated-posts/
    └── batch-{YYYYMMDD}/
        ├── approved/
        │   └── {variation}-v{version}.md
        └── needs-revision/
            └── {variation}-v{version}.md
```

## Workflow Nodes (v2.0)

### 1. Load Context Manifest
- Reads `context/manifest.json` (deterministic)
- No dynamic file discovery
- Returns pinned source list

### 2. Split Sources
- Extracts individual sources from manifest
- Preserves version metadata

### 3. Read + Normalize + Validate
- **Combined operation** (no sequential dependencies)
- Reads file
- Enforces schema
- Validates required files
- Fails fast on errors

### 4. Merge All Contexts
- Waits for ALL sources
- Groups by category
- Calculates total word count
- **Batching happens HERE** (after normalization)

### 5. Pre-Model Guardrails
- Token budget enforcement
- Required category checks
- Content sanitization (injection prevention)
- Builds structured prompt with JSON schema

### 6. Claude Generate
- Single API call with merged context
- Structured system prompt
- JSON schema enforcement

### 7. Hard Validator
- **CRITICAL**: Validates BEFORE branching
- Schema validation
- Word count checks
- Hashtag count
- Forbidden words
- Emoji count
- Calculates quality score
- Throws error if invalid

### 8. Branch By Status
- Routes to approved/revision based on validation
- Validation already complete

### 9. Normalize (Approved/Revision)
- **UNIFIED CODE** (same function, different path)
- Builds file path with version
- Formats markdown
- Returns normalized output

### 10. Write (Approved/Revision)
- Uses n8n Files node
- Writes to versioned path

## Key Improvements Over v1

| Issue | v1 | v2 |
|-------|----|----|
| Context Selection | Dynamic file search | Hardcoded manifest |
| Batching | Before normalization | After merge |
| Validation | After split | Before split |
| Guardrails | None | Pre-model + hard validator |
| Normalization | Duplicated | Unified |
| Versioning | None | Full version tracking |
| Error Handling | Silent failures | Fail fast |
| Injection Safety | None | Sanitization |

## Usage

### Bi-Weekly Archive
Use `content-generator-linkedin.json` for batch archiving every 2 weeks.

### Daily Active
Use `content-generator-daily.json` for daily generation at 9 AM.

### Modifying Context
1. Update `context/manifest.json`
2. Add/modify source files
3. Increment `manifest.version`
4. All runs will use new version

## Governance

- Every post has full provenance (manifest version, run ID, validation results)
- Failed validations block the pipeline (no silent failures)
- Versioned outputs support auditing
- Unified normalization prevents spec drift
- Hard validator ensures quality before storage

## Next Steps

1. Add actual file reading in "Read + Normalize + Validate" node
2. Test with real context files
3. Add error notification (webhook/email on failure)
4. Add metrics collection (track quality scores over time)
5. Consider adding A/B testing splits
