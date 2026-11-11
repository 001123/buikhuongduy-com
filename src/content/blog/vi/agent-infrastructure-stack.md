---
title: "Bức tranh hạ tầng cho AI agent: 5 lớp cần biết"
description: "Một bản đồ nhanh về hạ tầng cho AI agent, chia thành 5 lớp: Memory, Knowledge & Retrieval, Tool Use, Sandboxes và Agent Runtime. Mỗi lớp giải quyết việc gì và có những cái tên tiêu biểu nào."
pubDate: 2026-11-11T09:05:00+07:00
category: ai
tags: [ai, agents, infrastructure]
---

:::tldr
- Một AI agent chạy thật cần nhiều hơn một model: nó cần **trí nhớ**, **kiến thức**, **công cụ**, **môi trường chạy code an toàn** và **runtime** để chạy lâu dài.
- Hệ sinh thái chia khá rõ thành 5 lớp: **Memory**, **Knowledge & Retrieval**, **Tool Use**, **Sandboxes**, **Agent Runtime**.
- Các nhà cung cấp cloud lớn (AWS, Google, Microsoft, OpenAI, Cloudflare…) đều đang có mặt ở gần như mọi lớp.
:::

Ảnh dưới đây là một snapshot về các công cụ hạ tầng cho AI agent hiện nay, xếp theo từng lớp.

![Bản đồ hạ tầng AI agent theo 5 lớp: Memory, Knowledge & Retrieval, Tool Use, Sandboxes, Agent Runtime](../../../assets/blog/agent-infrastructure-stack.webp)

## 1. Memory: agent nhớ gì

Model không tự nhớ giữa các phiên. Lớp này lưu lại sự kiện, sở thích người dùng và ngữ cảnh cũ để agent dùng lại ở lần sau.

Tiêu biểu: **Mem0**, **Zep**, **Graphiti**, **Supermemory**, **Cognee**, **memU**, cùng bản của các cloud: **AgentCore Memory** (AWS), **Google Cloud Memory Bank**, **Foundry Memory** (Microsoft).

## 2. Knowledge & Retrieval: agent biết gì

Lớp RAG: tìm kiếm và đưa đúng tài liệu vào ngữ cảnh. Gồm ba nhóm:

- **Vector database / search engine**: Pinecone, Qdrant, Milvus, Weaviate, Chroma, turbopuffer, PostgreSQL + pgvector, Elasticsearch, OpenSearch, Redis Search.
- **Framework và graph RAG**: LlamaIndex, Haystack, LightRAG, Microsoft GraphRAG, RAGFlow, Neo4j.
- **Tìm kiếm web và xử lý tài liệu**: Exa, Tavily, Brave Search, Firecrawl, Parallel, Context7, Docling, MarkItDown.

## 3. Tool Use: agent làm được gì

Agent cần gọi API, điều khiển trình duyệt và kết nối với ứng dụng khác. **MCP** gần như đã trở thành chuẩn chung ở lớp này.

- **Trình duyệt**: Playwright, Browser Use, Browserbase, Stagehand, Chrome DevTools for agents, agent-browser, Midscene.js.
- **MCP và tích hợp**: FastMCP, Composio, Zapier MCP, Pipedream Connect, Nango, Apify MCP.
- **Gateway quản lý tool**: AgentCore Gateway, Docker MCP Gateway, agentgateway, ToolHive.

## 4. Sandboxes: agent chạy code ở đâu

Code do agent sinh ra không nên chạy thẳng trên máy thật. Sandbox cô lập nó trong container hoặc micro-VM.

- **Dịch vụ sandbox**: E2B, Daytona, Modal, Vercel Sandbox, Cloudflare Sandboxes, Blaxel, OpenAI-hosted Sandboxes, Anthropic Sandbox Runtime.
- **Công nghệ cô lập nền tảng**: Firecracker, gVisor, Kubernetes Agent Sandbox, Apple container, Wasmer.

## 5. Agent Runtime: agent sống ở đâu

Lớp chạy agent lâu dài: giữ trạng thái, chịu lỗi, chạy lại khi gián đoạn, mở rộng theo tải.

- **Runtime của cloud**: AgentCore Runtime, Google Cloud Agent Runtime, Foundry Agent Service, Claude Managed Agents, OpenAI Agents API, Cloudflare Agents SDK.
- **Framework và durable execution**: LangGraph, Mastra, Agno AgentOS, Temporal, Workflow DevKit.

## Kết

Nếu mới bắt đầu, không cần dùng đủ cả 5 lớp. Một agent đơn giản thường chỉ cần **Tool Use** (qua MCP) và một ít **Retrieval**. Khi agent bắt đầu chạy code, chạy lâu hoặc phục vụ nhiều người dùng, lúc đó mới cần thêm **Sandbox**, **Memory** và **Runtime**.
