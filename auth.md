# Agent Authentication — aiforhire.app

This document describes how automated agents can authenticate against the public API surface of AI Hire. It follows the [auth.md convention](https://workos.com/auth-md) for agent-readable authentication documentation.

## Overview

The public API surface of aiforhire.app is the **n8n MCP server**:

```
https://n8n.aiforhire.app/n8n-mcp/mcp
```

- **Protocol:** Model Context Protocol (MCP), streamable-http transport. `GET` returns server info; `POST` accepts JSON-RPC requests.
- **Health check:** `https://n8n.aiforhire.app/n8n-mcp/health` (no auth required)
- **Authorization:** OAuth 2.0 Bearer tokens, sent in the `Authorization: Bearer <token>` header.

No API keys are issued manually. Agents obtain credentials through OAuth 2.0 dynamic client registration and the authorization code flow described below.

## Discovery

| Document | URL |
|----------|-----|
| Authorization Server Metadata (RFC 8414) | `https://n8n.aiforhire.app/.well-known/oauth-authorization-server` |
| Protected Resource Metadata (RFC 9728) | `https://aiforhire.app/.well-known/oauth-protected-resource` |
| MCP Server Card | `https://aiforhire.app/.well-known/mcp/server-card.json` |
| API Catalog (RFC 9727) | `https://aiforhire.app/.well-known/api-catalog` |

Issuer: `https://n8n.aiforhire.app`

## Step 1 — Dynamic Client Registration (RFC 7591)

Register a client by POSTing to the registration endpoint:

```
POST https://n8n.aiforhire.app/mcp-oauth/register
Content-Type: application/json
```

```json
{
  "client_name": "your-agent-name",
  "redirect_uris": ["https://your-agent.example/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_method": "none"
}
```

The response contains your `client_id` (and `client_secret` if you chose a confidential auth method). Supported token endpoint auth methods: `none`, `client_secret_post`, `client_secret_basic`.

## Step 2 — Authorization (authorization_code + PKCE)

```
GET https://n8n.aiforhire.app/mcp-oauth/authorize
```

Required parameters:

- `response_type=code`
- `client_id` — from registration
- `redirect_uri` — one of your registered URIs
- `code_challenge` + `code_challenge_method=S256` — **PKCE with S256 is required**
- `scope` — space-separated scopes (see below)
- `state` — recommended

## Step 3 — Token Exchange

```
POST https://n8n.aiforhire.app/mcp-oauth/token
Content-Type: application/x-www-form-urlencoded
```

With `grant_type=authorization_code`, the `code`, your `redirect_uri`, `client_id`, and the PKCE `code_verifier`. Refresh tokens are supported via `grant_type=refresh_token`.

## Token Revocation

```
POST https://n8n.aiforhire.app/mcp-oauth/revoke
```

Revoke access or refresh tokens when your agent no longer needs them.

## Scopes

| Scope | Grants |
|-------|--------|
| `tool:listWorkflows` | List available n8n workflows on the MCP server |
| `tool:getWorkflowDetails` | Read the details of a specific workflow |

Request only the scopes you need.

## Using the Token

```
POST https://n8n.aiforhire.app/n8n-mcp/mcp
Authorization: Bearer <access_token>
Content-Type: application/json
```

Send standard MCP JSON-RPC messages (`initialize`, `tools/list`, `tools/call`, ...).

## Elevated Access & Human Contact

For elevated access, additional scopes, partnership inquiries, or anything not covered by the self-service flow above, contact a human at **hola@aiforhire.app**.
