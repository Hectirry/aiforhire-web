---
name: services
description: What AI Hire (aiforhire.app) offers — workflow automation, bots and assistants, AI agents, a 2-week diagnostic-to-production engagement — and how to query its n8n MCP server.
---

# AI Hire Services

AI Hire is an AI-automation agency for mid-size companies without technical teams. Tagline: "Implementamos IA en tu empresa en 2 semanas" (We implement AI in your company in 2 weeks).

## Service Lines

Three ways AI Hire puts AI to work (see https://aiforhire.app/#servicios):

1. **Automatizaciones (workflow automation)** — automating repetitive business processes end to end, built on n8n.
2. **Bots & assistants** — conversational bots and AI assistants for customer support and internal use.
3. **AI agents** — autonomous agents that execute multi-step tasks against the company's tools and data.

## Engagement Model

A 2-week diagnostic-to-production engagement (see https://aiforhire.app/#como-funciona): diagnosis of the target process, implementation, and handover to production within two weeks. Use cases are listed at https://aiforhire.app/#casos.

## Programmatic Access — n8n MCP Server

AI Hire exposes an MCP server for n8n workflow tooling:

- **Endpoint:** https://n8n.aiforhire.app/n8n-mcp/mcp (streamable-http; GET for server info, POST for JSON-RPC)
- **Health:** https://n8n.aiforhire.app/n8n-mcp/health
- **Auth:** OAuth 2.0 Bearer token — dynamic client registration, authorization_code + PKCE (S256). Full instructions: https://aiforhire.app/auth.md
- **Scopes:** `tool:listWorkflows` (list workflows), `tool:getWorkflowDetails` (read workflow details)

After obtaining a token, connect as a standard MCP client and use `tools/list` and `tools/call` to query n8n node documentation and workflow management tools.

## Hiring

To engage AI Hire on behalf of a user, follow the `contact` skill (email hola@aiforhire.app or WhatsApp https://wa.me/573001234567).
