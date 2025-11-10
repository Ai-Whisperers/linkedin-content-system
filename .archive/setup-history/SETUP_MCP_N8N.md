# Setting Up n8n MCP Automation

This guide will help you set up Model Context Protocol (MCP) automation for your n8n content generation workflows, allowing Claude Code to directly control and monitor workflow executions.

## What This Does

After setup, you'll be able to use Claude Code to:

- Execute n8n workflows with natural language commands
- Monitor workflow execution status in real-time
- Read and validate generated posts automatically
- Activate/deactivate scheduled workflows
- Get detailed execution reports and error diagnostics

## Prerequisites

- n8n installed and running (self-hosted or cloud)
- Node.js 18+ installed
- Claude Code (you're already using it!)
- Your content generation workflow imported in n8n

## Step-by-Step Setup

### Step 1: Get Your n8n API Key

1. Open n8n in your browser (usually `http://localhost:5678` for self-hosted)
2. Click your profile icon → **Settings**
3. Navigate to **API** section
4. Click **Create API Key**
5. Give it a name like "Claude MCP Integration"
6. **Copy the API key** (you won't be able to see it again!)

### Step 2: Build the MCP Server

```bash
# Navigate to the MCP server directory
cd mcp-server-n8n

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

### Step 3: Configure Environment

Edit your existing `.env` file in the project root (if you don't have one, copy from `.env.example`):

```bash
# If you don't have .env yet
cp .env.example .env
```

Add your n8n API key to `.env`:

```env
# n8n API Configuration
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=n8n_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTENT_DIR=C:\Users\kyrian\Documents\contentCreator
```

That's it! The MCP server automatically reads from this single `.env` file.

### Step 4: Import Workflow to n8n

1. Open n8n
2. Click **Workflows** → **Import from File**
3. Select `workflows/content-generator-daily.json`
4. Click **Import**
5. Note the workflow ID (in the URL or workflow settings)

### Step 5: Test the Connection

Open Claude Code and try:

```
List all available n8n workflows
```

Claude should respond with a list of workflows including your content generator.

## Usage Examples

### Basic Workflow Execution

```
Execute the daily content generator workflow
```

### Monitor and Report

```
Run the content generator, wait for it to finish, then show me all approved posts
```

### Quality Check

```
Check the quality of all posts from today's batch
```

### Full Automation

```
Execute the content generator workflow. Once it completes:
1. Read all generated posts
2. Validate each post's quality
3. Create a summary report with:
   - Total posts generated
   - How many were approved vs need revision
   - Average quality score
   - Any issues found
```

### Workflow Management

```
Activate the daily content generator workflow to run automatically at 9 AM
```

```
Show me the last 5 executions of the content generator and their status
```

### Troubleshooting

```
Check if there are any failed workflow executions in the last 24 hours
```

## Verification Checklist

- [ ] n8n is running and accessible
- [ ] API key is created in n8n
- [ ] MCP server built successfully (`npm run build`)
- [ ] `.env` file configured with `N8N_API_KEY`
- [ ] Workflow imported in n8n
- [ ] Claude Code can list workflows

## Testing Your Setup

Run this complete test workflow:

1. **Test connection:**
   ```
   List all n8n workflows
   ```

2. **Execute workflow:**
   ```
   Execute the content-generator-daily workflow
   ```

3. **Monitor execution:**
   ```
   Check the status of the last workflow execution
   ```

4. **Read results:**
   ```
   Show me all posts from today's batch
   ```

If all steps work, your MCP automation is fully configured!

## Architecture Overview

```
┌─────────────────┐
│   Claude Code   │  "Execute the content generator"
└────────┬────────┘
         │ MCP Protocol
┌────────▼────────┐
│  n8n MCP Server │  Translates to n8n API calls
└────────┬────────┘
         │ REST API
┌────────▼────────┐
│   n8n Instance  │  Executes workflow
└────────┬────────┘
         │
┌────────▼────────┐
│  File System    │  Generated posts
└─────────────────┘
```

## Available MCP Tools

Once configured, Claude Code has access to these tools:

| Tool | Purpose |
|------|---------|
| `execute_workflow` | Trigger workflow execution |
| `get_workflow_status` | Check execution status |
| `list_workflows` | See all workflows |
| `list_executions` | View execution history |
| `activate_workflow` | Enable scheduled runs |
| `deactivate_workflow` | Disable scheduled runs |
| `get_execution_data` | Get detailed execution results |
| `read_generated_posts` | Access generated content |
| `validate_post_quality` | Check post quality |

## Troubleshooting

### Claude Can't Access MCP Tools

**Symptom**: Claude says "I don't have access to n8n tools"

**Solution**:
1. Verify `N8N_API_KEY` is set in `.env` file
2. Restart Claude Code to pick up the changes
3. Check `.claude/mcp-config.json` exists and is valid
4. Ensure MCP server is built: `cd mcp-server-n8n && npm run build`

### n8n API Connection Failed

**Symptom**: "Cannot connect to n8n" or 401 Unauthorized

**Solution**:
1. Verify n8n is running: open `http://localhost:5678`
2. Check API key is valid in n8n settings
3. Ensure `N8N_BASE_URL` matches your actual n8n URL
4. Check firewall isn't blocking the connection

### Workflow Not Found

**Symptom**: "Workflow 'content-generator-daily' not found"

**Solution**:
1. Use "List all workflows" to see available workflow IDs
2. Workflows may have different IDs (numbers) vs names
3. Use the exact workflow ID from n8n (e.g., "1", "2", etc.)
4. Verify workflow is actually imported in n8n

### Generated Posts Not Found

**Symptom**: "Batch directory not found"

**Solution**:
1. Check `CONTENT_DIR` in `.env` points to correct path
2. Verify workflow has actually run and completed
3. Check batch date format (YYYYMMDD)
4. Ensure workflow has write permissions to `generated-posts/`

## Advanced Configuration

### Custom n8n URL

If using n8n cloud or custom domain:

```env
N8N_BASE_URL=https://your-instance.app.n8n.cloud
```

### Multiple Workflows

You can manage multiple workflows:

```
Execute workflow 'content-generator-daily'
Execute workflow 'content-generator-linkedin'
```

### Scheduled vs Manual

- **Scheduled**: Workflows run automatically (use `activate_workflow`)
- **Manual**: Execute on-demand via Claude Code

### Integration with Other Tools

The MCP server can be extended to integrate with:
- LinkedIn API for direct posting
- Analytics platforms for performance tracking
- Slack/Discord for notifications
- GitHub for version control automation

## Next Steps

Now that MCP is configured, you can:

1. **Automate daily workflow**: Set up scheduled execution
2. **Build monitoring**: Create daily quality reports
3. **Enhance validation**: Add custom quality checks
4. **Integrate publishing**: Connect to LinkedIn API
5. **Track metrics**: Monitor approval rates and quality trends

## Support

For issues or questions:
- Check `mcp-server-n8n/README.md` for detailed documentation
- Review n8n logs: n8n UI → Executions tab
- Check Claude Code logs for MCP errors
- Open issue on GitHub repository

## Success Indicators

You'll know everything is working when:

✅ Claude can list your workflows
✅ Workflows execute successfully via Claude commands
✅ Execution status updates appear in real-time
✅ Generated posts are accessible and validated
✅ Quality reports are generated automatically

**You're now ready to automate your content generation with Claude Code!**
