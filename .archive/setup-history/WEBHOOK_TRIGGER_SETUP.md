# Adding Webhook Trigger to n8n Workflow

## What I Did

I added a **Webhook Trigger** node to your content generator workflow, allowing you to execute it via HTTP POST instead of relying on the `/api/v1/workflows/{id}/execute` endpoint (which isn't available in your n8n version).

## How to Apply the Changes

### Step 1: Re-import the Updated Workflow

1. Open n8n in your browser: `http://localhost:5678`
2. Navigate to your workflow: **AI-Whisperers Daily Content Generator**
3. Click the **...** menu → **Duplicate** (to keep a backup)
4. Now go back to the original workflow
5. Click **...** menu → **Settings**
6. Delete the workflow
7. Click **Workflows** → **Import from File**
8. Select: `workflows/content-generator-daily.json`
9. Click **Import**

### Step 2: Activate the Workflow

1. Click **Save** in the workflow editor
2. Toggle **Active** to ON (this enables the webhook endpoint)

### Step 3: Get the Webhook URL

1. Click on the **Webhook Trigger** node (top left, above the schedule trigger)
2. Look for the **Webhook URLs** section
3. You'll see two URLs:
   - **Test URL**: `http://localhost:5678/webhook-test/content-generator`
   - **Production URL**: `http://localhost:5678/webhook/content-generator`
4. Copy the **Production URL**

## Testing the Workflow

Once you've activated the workflow, test it with:

```bash
curl -X POST "http://localhost:5678/webhook/content-generator" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Or from PowerShell:

```powershell
Invoke-WebRequest -Uri "http://localhost:5678/webhook/content-generator" -Method POST -ContentType "application/json" -Body "{}"
```

## Expected Behavior

### If It Works ✅

You'll see the workflow execute in real-time in the n8n UI, and after completion it will return:

```json
{
  "success": true,
  "message": "Content generation completed",
  "timestamp": "2025-11-07T..."
}
```

Generated posts will appear in `generated-posts/batch-YYYYMMDD/`

### If It Fails ❌

The workflow will stop at the first error and show you:
- Which node failed
- The error message
- The data that was being processed

This is what we want to see to debug the actual issue!

## Common Issues and Debugging

### Issue 1: "Load Manifest File" Fails

**Error**: `ENOENT: no such file or directory, open '.../context/manifest.json'`

**Cause**: The workflow doesn't have access to your file system or the path is wrong.

**Solution**:
- Check the "Load Manifest File" node configuration
- Update the `filePath` parameter to use absolute path:
  ```
  C:\Users\kyrian\Documents\contentCreator\context\manifest.json
  ```

### Issue 2: "context/manifest.json" Missing

**Error**: File not found

**Cause**: The manifest file doesn't exist

**Solution**:
- Check if file exists: `ls context/manifest.json`
- If missing, we need to create it

### Issue 3: Context Files Not Found

**Error**: `CRITICAL: Required context file missing: ...`

**Cause**: One of the context files specified in manifest.json doesn't exist

**Solution**:
- Review `context/manifest.json`
- Verify all `path` entries point to existing files
- Create missing files or remove them from manifest

### Issue 4: Claude API Credentials Missing

**Error**: `401 Unauthorized` at "Claude Generate" node

**Cause**: n8n doesn't have your Anthropic API credentials

**Solution**:
1. In n8n, click **Settings** (gear icon) → **Credentials**
2. Click **Add Credential** → **HTTP Header Auth**
3. Name: `Claude API`
4. Header Name: `x-api-key`
5. Header Value: (paste your Anthropic API key from `.env`)
6. Click **Save**
7. Go back to workflow → Click "Claude Generate" node
8. Under "Credentials", select "Claude API"

## Updating the MCP Server

Once the webhook works, update the MCP server to use webhooks instead of the `/execute` endpoint:

Edit `mcp-server-n8n/src/index.ts`, find the `executeWorkflow` method, and change:

```typescript
// OLD (doesn't work):
const response = await this.client.post(
  `/api/v1/workflows/${workflowId}/execute`,
  inputData || {}
);

// NEW (webhook-based):
const response = await this.client.post(
  `/webhook/${workflowId}`,
  inputData || {}
);
```

Then rebuild: `cd mcp-server-n8n && npm run build`

## Next Steps After Setup

1. **Test the webhook manually** to see what fails
2. **Fix the file path issues** (likely the first problem)
3. **Verify context files exist** and are readable
4. **Set up Claude API credentials** in n8n
5. **Test end-to-end** and watch it either succeed or show the real error
6. **Report back** what error you see!

---

**The whole point of this**: We want to see the actual workflow failure so we can fix the real issues (file paths, missing files, API credentials, etc.)
