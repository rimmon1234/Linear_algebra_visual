# API_CONTRACT.md

## 1. API Principles

- Validate every request.
- Validate structured responses.
- Keep secrets server-side.
- Use stable DTOs.
- Return useful error codes.
- Do not expose internal stack traces.

## 2. Topic APIs

### GET /api/modules

Returns published curriculum modules in navigation order.

### GET /api/modules/:moduleSlug

Returns module metadata and published topic summaries.

### GET /api/topics/:topicSlug

Returns a complete published topic payload suitable for rendering.

## 3. Playground API

### POST /api/playground/solve

Request:

```json
{
  "question": "string",
  "context": {
    "moduleId": "optional",
    "topicId": "optional"
  }
}
```

Response conceptually:

```json
{
  "topicId": "optional",
  "problemType": "string",
  "answer": "string",
  "steps": [],
  "verification": {},
  "visualization": {}
}
```

The exact schema is versioned in code.

## 4. Visualization API

### POST /api/visualize

Used when a server-side service must transform a validated mathematical state into a visualization specification.

Input must contain structured mathematical state, not arbitrary executable code.

## 5. Progress API

### GET /api/progress

Returns authenticated user's progress.

### POST /api/progress

Records a progress event or completion state.

The exact persistence model is defined in `DATABASE_SPEC.md`.

## 6. Error Contract

Use a structured error shape:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Human-readable safe message"
  }
}
```

Potential codes:

```text
INVALID_INPUT
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
UNSUPPORTED_PROBLEM
MATH_ERROR
NUMERICAL_ERROR
AI_ERROR
RATE_LIMITED
INTERNAL_ERROR
```

## 7. Versioning

Avoid breaking an existing endpoint unnecessarily.

When a breaking contract is required, use an explicit migration/versioning strategy.

## 8. Authentication

Public learning content may be available without authentication.

User-specific endpoints require authentication where defined.

## 9. Rate Limiting

AI endpoints must have rate protection appropriate to deployment.

Do not allow a client to bypass limits by repeatedly opening new requests without server-side checks.
