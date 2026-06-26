import { serve } from "@hono/node-server";
import {
  CopilotRuntime,
  createCopilotEndpoint,
} from "@copilotkit/runtime/v2";
import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph";
import { Agent, setGlobalDispatcher } from "undici";

// Configure Undici to disable timeouts for slow local LLM responses
setGlobalDispatcher(
  new Agent({
    bodyTimeout: 0,
    headersTimeout: 0,
  })
);

const langGraphAgent = new LangGraphHttpAgent({
  url: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://127.0.0.1:8086",
});

const runtime = new CopilotRuntime({
  agents: {
    default: langGraphAgent,
  },
  a2ui: {
    injectA2UITool: true,
  },
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "https://mcp.excalidraw.com",
        serverId: "excalidraw_mcp",
      },
    ],
  },
  openGenerativeUI: true,
});// Server configuration completed

const app = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit",
});

serve({ fetch: app.fetch, port: 4006 }, () => {
  console.log("✓ CopilotKit API server running at http://localhost:4006");
});
