---
title: "The AI Agent Infrastructure Stack: 5 Layers to Know"
description: "A quick map of AI agent infrastructure, split into 5 layers: Memory, Knowledge & Retrieval, Tool Use, Sandboxes, and Agent Runtime. What each layer does and the notable names in it."
pubDate: 2026-11-11T09:05:00+07:00
category: ai
tags: [ai, agents, infrastructure]
---

:::tldr
- A real AI agent needs more than a model: it needs **memory**, **knowledge**, **tools**, a **safe place to run code**, and a **runtime** to keep it running.
- The ecosystem splits cleanly into 5 layers: **Memory**, **Knowledge & Retrieval**, **Tool Use**, **Sandboxes**, **Agent Runtime**.
- The big cloud providers (AWS, Google, Microsoft, OpenAI, Cloudflare…) now show up in almost every layer.
:::

The image below is a snapshot of today's AI agent infrastructure tools, grouped by layer.

![Map of AI agent infrastructure in 5 layers: Memory, Knowledge & Retrieval, Tool Use, Sandboxes, Agent Runtime](../../../assets/blog/agent-infrastructure-stack.webp)

## 1. Memory: what the agent remembers

Models don't remember anything between sessions. This layer stores facts, user preferences, and past context so the agent can use them next time.

Notable: **Mem0**, **Zep**, **Graphiti**, **Supermemory**, **Cognee**, **memU**, plus the cloud versions: **AgentCore Memory** (AWS), **Google Cloud Memory Bank**, **Foundry Memory** (Microsoft).

## 2. Knowledge & Retrieval: what the agent knows

The RAG layer: find the right documents and put them into context. Three groups:

- **Vector databases / search engines**: Pinecone, Qdrant, Milvus, Weaviate, Chroma, turbopuffer, PostgreSQL + pgvector, Elasticsearch, OpenSearch, Redis Search.
- **Frameworks and graph RAG**: LlamaIndex, Haystack, LightRAG, Microsoft GraphRAG, RAGFlow, Neo4j.
- **Web search and document parsing**: Exa, Tavily, Brave Search, Firecrawl, Parallel, Context7, Docling, MarkItDown.

## 3. Tool Use: what the agent can do

Agents need to call APIs, drive browsers, and connect to other apps. **MCP** has become the de facto standard in this layer.

- **Browsers**: Playwright, Browser Use, Browserbase, Stagehand, Chrome DevTools for agents, agent-browser, Midscene.js.
- **MCP and integrations**: FastMCP, Composio, Zapier MCP, Pipedream Connect, Nango, Apify MCP.
- **Tool gateways**: AgentCore Gateway, Docker MCP Gateway, agentgateway, ToolHive.

## 4. Sandboxes: where the agent runs code

Agent-generated code shouldn't run directly on a real machine. Sandboxes isolate it in a container or micro-VM.

- **Sandbox services**: E2B, Daytona, Modal, Vercel Sandbox, Cloudflare Sandboxes, Blaxel, OpenAI-hosted Sandboxes, Anthropic Sandbox Runtime.
- **Underlying isolation tech**: Firecracker, gVisor, Kubernetes Agent Sandbox, Apple container, Wasmer.

## 5. Agent Runtime: where the agent lives

The layer that runs agents over time: keeps state, survives failures, resumes after interruptions, and scales with load.

- **Cloud runtimes**: AgentCore Runtime, Google Cloud Agent Runtime, Foundry Agent Service, Claude Managed Agents, OpenAI Agents API, Cloudflare Agents SDK.
- **Frameworks and durable execution**: LangGraph, Mastra, Agno AgentOS, Temporal, Workflow DevKit.

## Wrap-up

If you're just starting, you don't need all 5 layers. A simple agent usually needs only **Tool Use** (via MCP) and a bit of **Retrieval**. Once your agent starts running code, running for a long time, or serving many users, that's when you add **Sandboxes**, **Memory**, and a **Runtime**.
