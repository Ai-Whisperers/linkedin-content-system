#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (parent directory)
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

interface N8nConfig {
  baseUrl: string;
  apiKey: string;
  webhookUrl?: string;
}

interface WorkflowWebhookConfig {
  workflowId: string;
  webhookPath: string;
}

interface WorkflowExecution {
  id: string;
  finished: boolean;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  status: "running" | "success" | "error" | "waiting";
  data?: any;
}

class N8nMCPServer {
  private server: Server;
  private client: AxiosInstance;
  private config: N8nConfig;
  private webhookMappings: Map<string, string>;

  constructor() {
    this.config = {
      baseUrl: process.env.N8N_BASE_URL || "http://localhost:5678",
      apiKey: process.env.N8N_API_KEY || "",
      webhookUrl: process.env.N8N_WEBHOOK_URL || process.env.N8N_BASE_URL || "http://localhost:5678",
    };

    if (!this.config.apiKey) {
      throw new Error("N8N_API_KEY environment variable is required");
    }

    // Map workflow IDs/names to webhook paths
    this.webhookMappings = new Map([
      ["content-generator-daily", "content-generator"],
      ["AI-Whisperers Daily Content Generator", "content-generator"],
      ["content-generator-linkedin", "content-generator-linkedin"],
      ["AI-Whisperers Content Generator v2", "content-generator-linkedin"],
    ]);

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-N8N-API-KEY": this.config.apiKey,
      },
    });

    this.server = new Server(
      {
        name: "n8n-automation-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "execute_workflow":
          return await this.executeWorkflow(args);
        case "get_workflow_status":
          return await this.getWorkflowStatus(args);
        case "list_workflows":
          return await this.listWorkflows();
        case "get_execution_data":
          return await this.getExecutionData(args);
        case "list_executions":
          return await this.listExecutions(args);
        case "activate_workflow":
          return await this.activateWorkflow(args);
        case "deactivate_workflow":
          return await this.deactivateWorkflow(args);
        case "read_generated_posts":
          return await this.readGeneratedPosts(args);
        case "validate_post_quality":
          return await this.validatePostQuality(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: "execute_workflow",
        description:
          "Execute an n8n workflow by ID or name. Optionally provide input data.",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "The workflow ID or name to execute",
            },
            inputData: {
              type: "object",
              description: "Optional input data to pass to the workflow",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "get_workflow_status",
        description: "Get the current status of a workflow execution",
        inputSchema: {
          type: "object",
          properties: {
            executionId: {
              type: "string",
              description: "The execution ID to check",
            },
          },
          required: ["executionId"],
        },
      },
      {
        name: "list_workflows",
        description: "List all available n8n workflows",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_execution_data",
        description: "Get detailed execution data including outputs",
        inputSchema: {
          type: "object",
          properties: {
            executionId: {
              type: "string",
              description: "The execution ID to retrieve data for",
            },
          },
          required: ["executionId"],
        },
      },
      {
        name: "list_executions",
        description: "List recent workflow executions",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Optional workflow ID to filter by",
            },
            limit: {
              type: "number",
              description: "Maximum number of executions to return (default: 10)",
            },
          },
        },
      },
      {
        name: "activate_workflow",
        description: "Activate a workflow to enable scheduled triggers",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "The workflow ID to activate",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "deactivate_workflow",
        description: "Deactivate a workflow to disable scheduled triggers",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "The workflow ID to deactivate",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "read_generated_posts",
        description: "Read generated LinkedIn posts from a specific batch",
        inputSchema: {
          type: "object",
          properties: {
            batchDate: {
              type: "string",
              description: "Batch date in YYYYMMDD format (e.g., 20251107)",
            },
            status: {
              type: "string",
              enum: ["approved", "needs-revision", "all"],
              description: "Filter by post status (default: all)",
            },
          },
          required: ["batchDate"],
        },
      },
      {
        name: "validate_post_quality",
        description:
          "Validate a post against quality criteria and return detailed feedback",
        inputSchema: {
          type: "object",
          properties: {
            postPath: {
              type: "string",
              description: "Path to the post markdown file",
            },
          },
          required: ["postPath"],
        },
      },
    ];
  }

  private async executeWorkflow(args: any): Promise<any> {
    try {
      const { workflowId, inputData } = args;

      // Get webhook path from mapping
      const webhookPath = this.webhookMappings.get(workflowId);

      if (!webhookPath) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: `No webhook mapping found for workflow: ${workflowId}`,
                  hint: `Available workflows: ${Array.from(this.webhookMappings.keys()).join(", ")}`,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      // Trigger via webhook
      const webhookUrl = `${this.config.webhookUrl}/webhook/${webhookPath}`;

      const response = await axios.post(webhookUrl, inputData || {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: `Workflow ${workflowId} triggered via webhook`,
                webhookPath: webhookPath,
                webhookUrl: webhookUrl,
                response: response.data,
                note: "Workflow execution started. Use list_executions to monitor progress.",
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
                details: error.response?.data,
                hint: "Make sure the workflow is active and the webhook trigger is configured correctly.",
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async getWorkflowStatus(args: any): Promise<any> {
    try {
      const { executionId } = args;

      const response = await this.client.get(
        `/api/v1/executions/${executionId}`
      );

      const execution = response.data;
      const status: WorkflowExecution = {
        id: execution.id,
        finished: execution.finished,
        mode: execution.mode,
        startedAt: execution.startedAt,
        stoppedAt: execution.stoppedAt,
        workflowId: execution.workflowId,
        status: execution.finished
          ? execution.data?.resultData?.error
            ? "error"
            : "success"
          : "running",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                execution: status,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async listWorkflows(): Promise<any> {
    try {
      const response = await this.client.get("/api/v1/workflows");

      const workflows = response.data.data.map((w: any) => ({
        id: w.id,
        name: w.name,
        active: w.active,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                count: workflows.length,
                workflows,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async getExecutionData(args: any): Promise<any> {
    try {
      const { executionId } = args;

      const response = await this.client.get(
        `/api/v1/executions/${executionId}`
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                execution: response.data,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async listExecutions(args: any): Promise<any> {
    try {
      const { workflowId, limit = 10 } = args;

      const params: any = { limit };
      if (workflowId) {
        params.workflowId = workflowId;
      }

      const response = await this.client.get("/api/v1/executions", { params });

      const executions = response.data.data.map((e: any) => ({
        id: e.id,
        workflowId: e.workflowId,
        finished: e.finished,
        mode: e.mode,
        startedAt: e.startedAt,
        stoppedAt: e.stoppedAt,
        status: e.finished
          ? e.data?.resultData?.error
            ? "error"
            : "success"
          : "running",
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                count: executions.length,
                executions,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async activateWorkflow(args: any): Promise<any> {
    try {
      const { workflowId } = args;

      const response = await this.client.patch(
        `/api/v1/workflows/${workflowId}`,
        { active: true }
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: `Workflow ${workflowId} activated successfully`,
                workflow: {
                  id: response.data.id,
                  name: response.data.name,
                  active: response.data.active,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async deactivateWorkflow(args: any): Promise<any> {
    try {
      const { workflowId } = args;

      const response = await this.client.patch(
        `/api/v1/workflows/${workflowId}`,
        { active: false }
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: `Workflow ${workflowId} deactivated successfully`,
                workflow: {
                  id: response.data.id,
                  name: response.data.name,
                  active: response.data.active,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async readGeneratedPosts(args: any): Promise<any> {
    try {
      const { batchDate, status = "all" } = args;
      const baseDir = process.env.CONTENT_DIR || process.cwd();
      const batchDir = path.join(baseDir, "generated-posts", `batch-${batchDate}`);

      if (!fs.existsSync(batchDir)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: `Batch directory not found: ${batchDir}`,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      const posts: any[] = [];
      const statusDirs = status === "all"
        ? ["approved", "needs-revision"]
        : [status];

      for (const statusDir of statusDirs) {
        const dir = path.join(batchDir, statusDir);
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

        for (const file of files) {
          const filePath = path.join(dir, file);
          const content = fs.readFileSync(filePath, "utf-8");

          // Parse frontmatter
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          const frontmatter: any = {};

          if (frontmatterMatch) {
            const lines = frontmatterMatch[1].split("\n");
            for (const line of lines) {
              const [key, ...valueParts] = line.split(": ");
              if (key && valueParts.length > 0) {
                frontmatter[key] = valueParts.join(": ").trim();
              }
            }
          }

          posts.push({
            file: file,
            path: filePath,
            status: statusDir,
            metadata: frontmatter,
            content: content,
          });
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                batchDate,
                count: posts.length,
                posts,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  private async validatePostQuality(args: any): Promise<any> {
    try {
      const { postPath } = args;

      if (!fs.existsSync(postPath)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: `Post file not found: ${postPath}`,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      const content = fs.readFileSync(postPath, "utf-8");

      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const metadata: any = {};

      if (frontmatterMatch) {
        const lines = frontmatterMatch[1].split("\n");
        for (const line of lines) {
          const [key, ...valueParts] = line.split(": ");
          if (key && valueParts.length > 0) {
            metadata[key] = valueParts.join(": ").trim();
          }
        }
      }

      // Extract post content
      const postContent = content.replace(/^---\n[\s\S]*?\n---\n/, "");

      // Load forbidden words from context
      const contextDir = process.env.CONTENT_DIR || process.cwd();
      const rulesPath = path.join(contextDir, "context", "brand", "rules.md");
      let forbiddenWords: string[] = [
        "revolutionary",
        "game-changing",
        "disruptive",
        "paradigm shift",
        "synergy",
      ];

      if (fs.existsSync(rulesPath)) {
        const rulesContent = fs.readFileSync(rulesPath, "utf-8");
        const forbiddenMatch = rulesContent.match(
          /forbidden[_\s]words[:\s]*\[(.*?)\]/i
        );
        if (forbiddenMatch) {
          forbiddenWords = forbiddenMatch[1]
            .split(",")
            .map((w) => w.trim().replace(/['"]/g, ""));
        }
      }

      // Validation checks
      const issues: string[] = [];
      const fullText = postContent.toLowerCase();

      // Check forbidden words
      const foundForbidden = forbiddenWords.filter((word) =>
        fullText.includes(word.toLowerCase())
      );
      if (foundForbidden.length > 0) {
        issues.push(`Contains forbidden words: ${foundForbidden.join(", ")}`);
      }

      // Check word count
      const wordCount = postContent.split(/\s+/).filter((w) => w.length > 0)
        .length;
      if (wordCount < 120 || wordCount > 180) {
        issues.push(
          `Word count ${wordCount} outside recommended range (120-180)`
        );
      }

      // Check emojis
      const emojiRegex = /[\p{Emoji}]/gu;
      const emojiCount = (postContent.match(emojiRegex) || []).length;
      if (emojiCount > 2) {
        issues.push(`Too many emojis: ${emojiCount} (max 2)`);
      }

      // Check hashtags
      const hashtagRegex = /#\w+/g;
      const hashtags = postContent.match(hashtagRegex) || [];
      if (hashtags.length !== 4) {
        issues.push(`Must have exactly 4 hashtags, found ${hashtags.length}`);
      }

      const qualityScore = Math.max(0, 100 - issues.length * 20);
      const passed = qualityScore >= 70;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                validation: {
                  passed,
                  qualityScore,
                  metadata,
                  checks: {
                    wordCount,
                    emojiCount,
                    hashtagCount: hashtags.length,
                    forbiddenWordsFound: foundForbidden,
                  },
                  issues,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("n8n MCP server running on stdio");
  }
}

const server = new N8nMCPServer();
server.run().catch(console.error);
