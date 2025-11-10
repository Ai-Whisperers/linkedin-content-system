# Archive Directory

This directory contains obsolete files from previous iterations of the content generation system.

**Archived:** 2025-11-06
**Reason:** System redesigned with proper LLM governance (v2.0)

## What's Archived

### Old System Files (v1.0)
- `generate-content.js` - Node.js script version (replaced by n8n workflows)
- Old generated posts from batch-20251106
- Draft templates and experimental files
- v1 documentation that references outdated structure

### Why Archived
v1.0 had critical architectural issues:
- Non-deterministic context selection
- Validation after branching
- Batching before normalization
- No versioning or governance
- Duplicated normalization logic

v2.0 fixes all these issues with:
- Deterministic manifest-based context
- Pre-model guardrails
- Hard validation before branching
- Full version tracking
- Unified normalization

## Current System

See root directory for v2.0:
- `/workflows/` - n8n workflows with proper governance
- `/context/manifest.json` - Deterministic source manifest
- `/WORKFLOW_ARCHITECTURE.md` - Architecture documentation
- `/README.md` - Current system overview
