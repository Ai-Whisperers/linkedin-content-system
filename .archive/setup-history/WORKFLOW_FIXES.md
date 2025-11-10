# Workflow Fixes - Resolving 500 Errors

## Issues Fixed

### 1. Unrecognized Node Type Error
**Problem**: `n8n-nodes-base.files` node type not recognized
**Solution**: Changed all file operations to use `n8n-nodes-base.readWriteFile`

**Files Updated**:
- `workflows/content-generator-linkedin.json`
- `workflows/content-generator-daily.json`

### 2. Environment Variable Access Error
**Problem**: `$env.CWD` causing crashes in n8n JavaScript code
**Solution**: Replaced with hardcoded absolute path `C:/Users/kyrian/Documents/contentCreator`

**Locations Fixed**:
- Load Context Manifest node (LinkedIn workflow)
- Normalize Approved/Revision nodes (both workflows)

### 3. Missing Read File Node
**Problem**: LinkedIn workflow was missing a file read step between Split Sources and validation
**Solution**: Added `Read Context File` node using `readWriteFile` operation

## Updated Workflow Structure

### LinkedIn Workflow (content-generator-linkedin.json)
```
1. Twice Weekly Schedule (trigger every 3 days)
2. Load Context Manifest (hardcoded paths)
3. Split Sources
4. Read Context File (NEW - reads each file)
5. Read + Normalize + Validate
6. Merge All Contexts
7. Pre-Model Guardrails
8. Claude Generate
9. Hard Validator
10. Branch By Status
    ├─ Normalize Approved → Write Approved
    └─ Normalize Revision → Write Revision
```

### Daily Workflow (content-generator-daily.json)
```
1. Daily at 9 AM (trigger)
2. Load Manifest File (reads manifest.json)
3. Parse Manifest
4. Split Sources
5. Read Context File (reads each file)
6. Normalize + Validate
7. Merge All Contexts
8. Pre-Model Guardrails
9. Claude Generate
10. Hard Validator
11. Branch By Status
    ├─ Normalize Approved → Write Approved
    └─ Normalize Revision → Write Revision
```

## File Node Parameters

### Read Operations
```json
{
  "operation": "read",
  "filePath": "={{ $json.path }}",
  "options": {}
}
```

### Write Operations
```json
{
  "operation": "write",
  "fileName": "={{ $json.file_path }}",
  "dataPropertyName": "file_content",
  "options": {}
}
```

## Path Configuration

All file paths are now hardcoded to avoid environment variable issues:

**Base Directory**: `C:/Users/kyrian/Documents/contentCreator`

**Context Files**:
- `C:/Users/kyrian/Documents/contentCreator/context/services/custom-ai.md`
- `C:/Users/kyrian/Documents/contentCreator/context/services/automation.md`
- `C:/Users/kyrian/Documents/contentCreator/context/brand/voice.md`
- `C:/Users/kyrian/Documents/contentCreator/context/brand/rules.md`

**Output Directory**: `C:/Users/kyrian/Documents/contentCreator/generated-posts/`

## Next Steps

1. **Import workflows into n8n**
   - Delete old workflow versions
   - Import updated JSON files

2. **Configure Claude API credentials**
   - Go to "Claude Generate" node
   - Add HTTP Header Auth credential
   - Header: `x-api-key`
   - Value: Your Claude API key

3. **Test execution**
   - Click "Execute Workflow" button
   - Check for errors in execution log
   - Verify files are created in `generated-posts/` directory

4. **Monitor first run**
   - Watch for file read/write operations
   - Check Claude API response
   - Verify post validation and branching

## Common Errors & Solutions

### Error: "Cannot read property 'data' of undefined"
**Solution**: File read node is not returning data. Check:
- File path is correct and absolute
- File exists at that location
- Permissions allow n8n to read the file

### Error: "VALIDATION FAILED: Context too short"
**Solution**: Context file has fewer than 10 words. Check:
- File is not empty
- File contains actual content (not just whitespace)

### Error: "CRITICAL: Required context file missing"
**Solution**: One of the 4 required context files is missing. Verify all exist:
- `context/services/custom-ai.md` ✓
- `context/services/automation.md` ✓
- `context/brand/voice.md` ✓
- `context/brand/rules.md` ✓

### Error: "GUARDRAIL: Missing required category"
**Solution**: Not all context files were loaded. Check:
- All 4 files read successfully
- Categories are correct (services, brand)
- Merge node receives all inputs

## Testing Checklist

Before activating workflows:

- [ ] All 4 context files exist and have content
- [ ] Claude API credentials configured
- [ ] Manual test execution completes without errors
- [ ] Generated posts appear in `generated-posts/batch-YYYYMMDD/` folders
- [ ] Both approved and needs-revision posts are created
- [ ] Posts meet quality standards (120-180 words, 4 hashtags, etc.)

## Production Deployment

Once testing passes:

1. **Activate LinkedIn Workflow**
   - Runs every 3 days (approximately Monday/Thursday)
   - Generates 5 post variations per run

2. **Activate Daily Workflow** (optional)
   - Runs daily at 9 AM
   - More frequent content generation

3. **Monitor executions**
   - Check n8n execution history
   - Review generated posts
   - Adjust context files as needed

## Maintenance

**Weekly**:
- Review generated posts for quality
- Update context files with new achievements
- Adjust generation_config if needed

**Monthly**:
- Update manifest.json `last_updated` date
- Review and refine brand voice
- Add new proof points and projects

**As Needed**:
- Update base directory path if project moves
- Adjust schedule triggers
- Modify validation thresholds

---

**Status**: ✅ Workflows fixed and ready for import
**Last Updated**: November 7, 2025
**Version**: 2.0.1 (Fixed 500 errors)
