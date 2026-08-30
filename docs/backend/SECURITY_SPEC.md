# SECURITY_SPEC.md

## Purpose

Security must be designed into the platform from the beginning, especially because the application accepts arbitrary student input and uses AI services.

## Security Principles

1. Treat all client input as untrusted.
2. Treat all AI output as untrusted until validated.
3. Keep secrets server-side.
4. Use least privilege.
5. Validate at every trust boundary.
6. Never execute arbitrary user- or AI-generated code.
7. Prefer deterministic computation for mathematical verification.
8. Fail closed for authorization failures.
9. Do not leak sensitive information through logs or errors.

## Trust Boundaries

```text
Browser
  ↓ untrusted input
Next.js server/API
  ↓ validated data
Domain services
  ↓ controlled operations
Database / AI provider / storage
```

AI output follows a separate boundary:

```text
LLM output
   ↓
Zod validation
   ↓
semantic validation
   ↓
math verification where applicable
   ↓
trusted application model
```

## Authentication

Use Supabase Auth when account functionality is enabled.

Requirements:

- secure session handling,
- server-side authorization checks for protected operations,
- no trust in user IDs supplied by the client,
- explicit handling of signed-out state.

Do not require authentication for the basic learning experience unless product requirements change.

## Authorization

Authorization must be enforced server-side.

Never rely solely on hidden UI controls to protect data.

For user-owned resources, verify ownership before read/update/delete operations.

## Supabase Row Level Security

RLS must be enabled for user-owned tables.

Policies should follow least privilege:

- users can access only their own private data,
- public curriculum can be publicly readable where intended,
- writes require explicit authorization,
- service-role access is server-only.

Never ship the Supabase service-role key to the client.

## Secrets

Never commit secrets.

Never put private keys into `NEXT_PUBLIC_*` variables.

Use `.env.local` for development and the deployment platform's encrypted environment variables for production.

Maintain `.env.example` with names only.

## API Security

Validate:

- request body,
- route parameters,
- query parameters,
- uploaded metadata,
- AI outputs,
- external API responses.

Reject malformed requests with safe error messages.

Do not expose stack traces, provider secrets, SQL details, or internal filesystem paths.

## Rate Limiting

AI and other expensive endpoints must have a rate-limiting strategy before public launch.

At minimum, plan limits around:

- requests per user/session,
- request size,
- concurrency,
- expensive computation frequency.

## AI Prompt Injection

Student content must be considered untrusted text.

Never allow user content to override system/developer instructions or tool permissions.

Keep system instructions separate from user content.

Use allowlisted tools/actions instead of letting the model invoke arbitrary capabilities.

## Arbitrary Code Execution

Absolutely forbidden:

```text
user input → eval()
AI output → eval()
user input → shell command
AI output → shell command
AI output → generated React/Three.js execution
```

Mathematical expressions must be parsed using a safe parser with an allowlist of permitted syntax/functions.

## File Uploads

If file uploads are enabled:

- validate file type and size,
- do not trust MIME type alone,
- store files outside executable paths,
- scan/process safely where appropriate,
- generate safe filenames/keys,
- enforce per-user authorization,
- never render uploaded HTML as trusted application markup.

## XSS

Do not inject raw HTML from users or AI responses without a deliberate sanitization policy.

Prefer structured Markdown/rendering components with safe URL handling.

## CSRF / Session Protection

Use framework/provider-recommended secure session patterns. Any state-changing endpoint must rely on authenticated session validation and appropriate browser protections.

## Database Security

Use parameterized queries / official client abstractions.

Never concatenate untrusted values into SQL.

Never expose database credentials to the client.

## Logging

Never log:

- passwords,
- tokens,
- API keys,
- service-role credentials,
- sensitive authentication data.

Minimize logging of full student questions when not required.

## Error Handling

User-facing errors should be safe and actionable.

Internal details belong in protected logs/telemetry, not browser responses.

## Security Review Gates

Before public launch:

```text
[ ] Secrets scan passes
[ ] RLS policies tested
[ ] Authorization tests pass
[ ] AI endpoints rate-limited
[ ] Input validation present
[ ] No arbitrary code execution paths
[ ] File upload policy enforced if uploads exist
[ ] Dependency audit reviewed
[ ] Production error responses do not leak internals
```
