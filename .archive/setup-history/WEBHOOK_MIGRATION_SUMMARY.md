# n8n Webhook Migration Summary

## Problem

Your n8n version (1.118.2) doesn't have the `/api/v1/workflows/{id}/execute` endpoint. This endpoint was only added in a later version (PR #20234 in 2025).

## Solution

Migrated the MCP server to use webhook triggers instead of the execute API endpoint.

## Changes Made

### 1. Workflows Updated

#### `workflows/content-generator-daily.json`
- ✅ Already had webhook trigger node configured
- Webhook path: `/webhook/content-generator`

#### `workflows/content-generator-linkedin.json`
- ✅ Added webhook trigger node
- Webhook path: `/webhook/content-generator-linkedin`
- Added webhook connection to "Load Context Manifest" node

### 2. MCP Server Updated (`mcp-server-n8n/src/index.ts`)

**Added:**
- `N8nConfig.webhookUrl` - Optional webhook URL configuration
- `WorkflowWebhookConfig` interface for webhook mappings
- `webhookMappings` Map with workflow ID → webhook path mappings:
  - `content-generator-daily` → `content-generator`
  - `AI-Whisperers Daily Content Generator` → `content-generator`
  - `content-generator-linkedin` → `content-generator-linkedin`
  - `AI-Whisperers Content Generator v2` → `content-generator-linkedin`

**Modified:**
- `executeWorkflow()` method now:
  1. Looks up webhook path from workflow ID
  2. Constructs webhook URL: `{N8N_WEBHOOK_URL}/webhook/{path}`
  3. Sends POST request to webhook (no API key needed for webhooks)
  4. Returns success message with webhook details
  5. Includes helpful error messages if workflow not found

### 3. Configuration

**Created `mcp-server-n8n/.env.example`:**
```env
N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here
CONTENT_DIR=C:\Users\kyrian\Documents\contentCreator
```

**Notes:**
- `N8N_WEBHOOK_URL` is optional, defaults to `N8N_BASE_URL`
- Webhooks work with n8n 1.118.2 (no version upgrade needed)

### 4. Documentation Updated (`mcp-server-n8n/README.md`)

**Added:**
- Webhook trigger explanation in `execute_workflow` tool docs
- List of supported workflow IDs
- Instructions for activating workflows in n8n
- Webhook testing instructions with curl commands
- Troubleshooting section for webhook-specific issues

## How to Use

### Step 1: Activate Workflows in n8n

**CRITICAL:** Workflows must be ACTIVE for webhooks to work.

1. Open n8n: `http://localhost:5678`
2. Import both workflow files (if not already imported)
3. For each workflow, click the **Active** toggle (top right, should turn green)
4. Verify webhook nodes show "Waiting for webhook call"

### Step 2: Test Webhooks Directly

```bash
# Test daily workflow
curl -X POST http://localhost:5678/webhook/content-generator

# Test LinkedIn workflow
curl -X POST http://localhost:5678/webhook/content-generator-linkedin
```

Expected: Workflow should execute. Check n8n executions tab.

### Step 3: Use MCP Server

The MCP server `execute_workflow` tool now works via webhooks:

```typescript
// From Claude Code or any MCP client
execute_workflow({
  workflowId: "content-generator-daily",
  inputData: { /* optional */ }
})
```

The tool will:
1. Map `content-generator-daily` → `/webhook/content-generator`
2. POST to `http://localhost:5678/webhook/content-generator`
3. Return success message
4. Workflow executes asynchronously

Use `list_executions` to monitor progress.

## Compatibility

| Feature | Before | After |
|---------|--------|-------|
| n8n Version Required | 1.119.0+ (execute endpoint) | 1.118.2 (webhooks) ✅ |
| API Authentication | API Key required | No auth for webhooks |
| Execution Type | Synchronous | Asynchronous |
| Monitoring | Direct response | Use `list_executions` |
| Workflow State | Can be inactive | **Must be ACTIVE** |

## Troubleshooting

### Webhook not found (404)
- Workflow is not ACTIVE in n8n
- Webhook path doesn't match (check workflow file)
- Workflow not imported into n8n

### "No webhook mapping found for workflow"
- Using unsupported workflow ID
- Check supported IDs in `src/index.ts` webhookMappings

### Workflow doesn't execute
- Workflow is inactive (toggle to green in n8n)
- Webhook trigger node not connected properly
- Check n8n execution logs for errors

## Benefits of Webhook Approach

1. ✅ **Works with your current n8n version** (1.118.2)
2. ✅ **No version upgrade needed**
3. ✅ **Standard n8n feature** (webhooks available since early versions)
4. ✅ **No API authentication needed** for webhook calls
5. ✅ **Production-ready** (webhooks are stable and widely used)

## Migration Checklist

- [x] Add webhook trigger to content-generator-linkedin.json
- [x] Update MCP server to use webhooks
- [x] Create .env.example with webhook configuration
- [x] Update README documentation
- [x] Build MCP server
- [ ] Activate workflows in n8n (USER ACTION REQUIRED)
- [ ] Test webhook endpoints with curl (USER ACTION REQUIRED)
- [ ] Test MCP execute_workflow tool (USER ACTION REQUIRED)

## Next Steps

1. **Activate both workflows in n8n** (see Step 1 above)
2. **Test webhooks directly** (see Step 2 above)
3. **Test MCP integration** (see Step 3 above)
4. If everything works, you're done! 🎉

## Rollback Plan

If you need to rollback:
1. Workflows still have schedule triggers (unaffected)
2. Simply deactivate webhook triggers in n8n
3. Workflows will continue running on schedule

## Questions?

- Workflow documentation: `workflows/README.md`
- MCP server docs: `mcp-server-n8n/README.md`
- n8n webhook docs: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

---

**Migration completed:** 2025-11-10
**MCP Server Version:** 1.0.0 (webhook-based)
**n8n Version:** 1.118.2
**Status:** ✅ Ready for testing
