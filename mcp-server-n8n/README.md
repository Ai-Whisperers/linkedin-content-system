# n8n MCP Server for AI-Whisperers Content Generator

Model Context Protocol (MCP) server that enables Claude Code to directly control and monitor n8n workflows, specifically designed for the AI-Whisperers content generation system.

## Features

### n8n Workflow Automation
- **Execute workflows** - Trigger workflows programmatically
- **Monitor executions** - Check status and retrieve results
- **Manage workflows** - Activate/deactivate scheduled workflows
- **List workflows** - View all available workflows

### Content Generation Integration
- **Read generated posts** - Access posts by batch date and status
- **Validate quality** - Check posts against brand guidelines
- **Automated monitoring** - Track workflow outputs in real-time

## Installation

### 1. Install Dependencies

```bash
cd mcp-server-n8n
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Configure n8n API Access

Create a `.env` file in the `mcp-server-n8n` directory:

```bash
cp .env.example .env
```

Edit `.env` with your n8n credentials:

```env
N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here
CONTENT_DIR=C:\Users\kyrian\Documents\contentCreator
```

**Note:** `N8N_WEBHOOK_URL` is optional and defaults to `N8N_BASE_URL`. Set it separately if your webhooks are on a different URL (e.g., production webhooks).

#### Getting Your n8n API Key

1. Open n8n in your browser (usually `http://localhost:5678`)
2. Go to **Settings** > **API**
3. Click **Create API Key**
4. Copy the generated key
5. Paste it into your `.env` file

#### Activating Workflows for Webhook Triggers

**IMPORTANT:** For webhook triggers to work, your workflows must be **ACTIVE** in n8n:

1. Open n8n in your browser
2. Import the workflow files:
   - `workflows/content-generator-daily.json`
   - `workflows/content-generator-linkedin.json`
3. For each workflow:
   - Click the **Active** toggle in the top right (it should turn green)
   - Verify the webhook trigger node shows "Waiting for webhook call"
4. Test webhook endpoints:
   ```bash
   # Daily workflow
   curl -X POST http://localhost:5678/webhook/content-generator

   # LinkedIn workflow
   curl -X POST http://localhost:5678/webhook/content-generator-linkedin
   ```

### 4. Configure Claude Code

The MCP configuration is already set up in `.claude/mcp-config.json`. You just need to set your API key as an environment variable:

**Windows (PowerShell):**
```powershell
$env:N8N_API_KEY = "your_api_key_here"
```

**Windows (Command Prompt):**
```cmd
set N8N_API_KEY=your_api_key_here
```

**For permanent configuration, add to your system environment variables.**

## Available Tools

### Workflow Management

#### `execute_workflow`
Execute an n8n workflow by ID or name using webhook triggers (compatible with n8n 1.118.2).

**Supported Workflows:**
- `content-generator-daily` or `AI-Whisperers Daily Content Generator`
- `content-generator-linkedin` or `AI-Whisperers Content Generator v2`

**Important:** Workflows must be ACTIVE in n8n for webhooks to work.

```typescript
{
  workflowId: "content-generator-daily",
  inputData: { /* optional input */ }
}
```

**How it works:**
- Uses webhook triggers instead of the `/api/v1/workflows/{id}/execute` endpoint
- Compatible with n8n version 1.118.2 (execute endpoint only available in newer versions)
- Webhook paths are automatically mapped from workflow IDs
- Returns immediately after triggering; use `list_executions` to monitor progress

#### `get_workflow_status`
Check the status of a running workflow execution.

```typescript
{
  executionId: "12345"
}
```

#### `list_workflows`
List all available workflows.

```typescript
{}
```

#### `list_executions`
View recent workflow executions.

```typescript
{
  workflowId: "content-generator-daily", // optional
  limit: 10 // optional, default: 10
}
```

#### `activate_workflow`
Enable a workflow's scheduled triggers.

```typescript
{
  workflowId: "content-generator-daily"
}
```

#### `deactivate_workflow`
Disable a workflow's scheduled triggers.

```typescript
{
  workflowId: "content-generator-daily"
}
```

### Content Management

#### `read_generated_posts`
Read generated LinkedIn posts from a batch.

```typescript
{
  batchDate: "20251107",
  status: "approved" | "needs-revision" | "all"
}
```

#### `validate_post_quality`
Validate a post against quality guidelines.

```typescript
{
  postPath: "C:\\Users\\kyrian\\Documents\\contentCreator\\generated-posts\\batch-20251107\\approved\\post-1.md"
}
```

## Usage Examples

### Example 1: Execute Daily Content Generator

```
Execute the daily content generation workflow and monitor its progress.
```

Claude will:
1. Call `execute_workflow` with workflowId: "content-generator-daily"
2. Get the execution ID
3. Poll `get_workflow_status` until completion
4. Read results with `read_generated_posts`

### Example 2: Review Generated Posts

```
Show me all approved posts from today's batch and validate their quality.
```

Claude will:
1. Determine today's date in YYYYMMDD format
2. Call `read_generated_posts` with status: "approved"
3. For each post, call `validate_post_quality`
4. Present results with quality scores

### Example 3: Workflow Health Check

```
Check the status of all recent workflow executions and report any failures.
```

Claude will:
1. Call `list_workflows` to get all workflows
2. For each workflow, call `list_executions`
3. Filter for failed executions
4. Report errors and timing information

### Example 4: Automated Daily Workflow

```
Run the daily content generator, wait for completion, validate all posts,
and create a summary report.
```

Claude will orchestrate:
1. Execute workflow
2. Monitor until complete
3. Read all generated posts
4. Validate each post
5. Generate summary with:
   - Total posts generated
   - Approval rate
   - Quality score distribution
   - Issues found

## Integration with Content Generator

This MCP server is specifically designed for the AI-Whisperers content generation workflow:

### Automated Daily Flow

```
1. Claude executes: execute_workflow("content-generator-daily")
2. Workflow runs through all steps:
   - Load manifest
   - Read context files
   - Merge contexts
   - Call Claude API for generation
   - Validate posts
   - Write to files
3. Claude monitors: get_workflow_status(executionId)
4. On completion, Claude reads: read_generated_posts(batchDate, "all")
5. Claude validates: validate_post_quality() for each post
6. Claude reports results
```

### Quality Assurance

The `validate_post_quality` tool checks:
- Word count (120-180 words)
- Emoji count (max 2)
- Hashtag count (exactly 4)
- Forbidden words detection
- Quality score calculation

### File System Integration

Posts are organized as:
```
generated-posts/
└── batch-YYYYMMDD/
    ├── approved/
    │   └── service-showcase-v2.0.0-20251107-0.md
    └── needs-revision/
        └── tool-tutorial-v2.0.0-20251107-1.md
```

## Troubleshooting

### "N8N_API_KEY environment variable is required"
- Make sure you've set the `N8N_API_KEY` environment variable
- Check that it's accessible in your current terminal session

### "Cannot connect to n8n"
- Verify n8n is running: `http://localhost:5678`
- Check the `N8N_BASE_URL` in your configuration
- Ensure your API key is valid

### "Workflow not found" or "No webhook mapping found"
- Use `list_workflows` to see available workflow IDs
- Supported workflow IDs/names:
  - `content-generator-daily` or `AI-Whisperers Daily Content Generator`
  - `content-generator-linkedin` or `AI-Whisperers Content Generator v2`
- Check that the workflow exists in n8n
- Verify the workflow ID matches exactly (case-sensitive)

### "Webhook trigger failed" or connection errors
- **Make sure the workflow is ACTIVE in n8n** (toggle in top right must be green)
- Verify webhook URL is correct: `http://localhost:5678/webhook/[path]`
- Test webhook directly with curl before using MCP
- Check n8n logs for webhook registration errors
- Ensure firewall isn't blocking webhook requests

### "Batch directory not found"
- Check the `CONTENT_DIR` path in your configuration
- Verify the batch date format is YYYYMMDD
- Ensure the workflow has run and created the batch directory

## Development

### Build and Watch

```bash
npm run watch
```

### Test the Server

```bash
npm start
```

The server communicates via stdio and is designed to be used through Claude Code's MCP integration.

## Architecture

```
Claude Code
    ↓
MCP Protocol
    ↓
n8n MCP Server (this)
    ↓
n8n REST API
    ↓
n8n Workflows
    ↓
Content Generator
```

## Related Files

- **Workflow Definition**: `workflows/content-generator-daily.json`
- **Content Manifest**: `context/manifest.json`
- **Brand Guidelines**: `context/brand/rules.md`
- **Quality Checklist**: `brand-docs/QUALITY_CHECKLIST.md`

## License

MIT

## Support

For issues or questions:
- GitHub: [AI-Whisperers/contentCreator](https://github.com/Ai-Whisperers/linkedin-content-system)
- Email: support@ai-whisperers.com
