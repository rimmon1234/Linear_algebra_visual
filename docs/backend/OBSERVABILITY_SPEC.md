# OBSERVABILITY_SPEC.md

## Purpose

Observability should make it possible to detect technical failures, mathematical failures, visualization failures, and major product-flow failures without collecting unnecessary student data.

## Principles

1. Collect the minimum useful data.
2. Never log secrets.
3. Separate technical telemetry from educational content.
4. Prefer structured events over free-form logs.
5. Track failures with enough context to reproduce them.
6. Do not use analytics as a substitute for testing.

## Error Monitoring

Monitor at least:

```text
frontend runtime errors
server/API errors
AI provider failures
math computation failures
visualization specification validation failures
WebGL initialization/rendering failures
unhandled promise rejections
build/deployment failures
```

Use an error-monitoring provider only after the application has a clear event model. Keep provider-specific code behind a small adapter.

## Structured Logging

Logs should contain fields such as:

```text
level
timestamp
environment
requestId
route
operation
status
durationMs
errorCode
```

Add user/account identifiers only when operationally necessary and permitted. Prefer non-sensitive internal IDs over raw personal data.

## Correlation IDs

Requests crossing multiple server operations should have a correlation/request ID where practical.

Example:

```text
Playground request
  requestId = abc123
      ↓
question classification
      ↓
math verification
      ↓
visualization validation
```

This allows failures to be traced without logging the entire student interaction.

## Performance Monitoring

Track useful technical signals such as:

```text
initial page load
route transition time
API latency
AI latency
visualizer initialization time
long tasks
WebGL frame-rate degradation where practical
```

Do not prematurely optimize based on a single metric.

## Visualization Telemetry

The visualizer should be able to report aggregated technical failures such as:

```text
webgl_unavailable
scene_initialization_failed
invalid_visualization_spec
unsupported_visualization_type
resource_load_failed
```

Do not continuously stream raw camera/vector state to analytics.

## AI Telemetry

Record operational metadata such as:

```text
provider/model identifier where permitted
request latency
success/failure
validation success/failure
retry count
token/cost metadata where available
```

Avoid storing complete student questions by default. When prompts/responses must be retained for debugging, apply a documented retention policy and access control.

## Product Events

The product may eventually track aggregate events such as:

```text
module_opened
topic_opened
visualization_loaded
visualization_interacted
experiment_completed
practice_started
practice_completed
playground_submitted
playground_solution_verified
```

Events should be defined centrally rather than emitted as arbitrary strings throughout the application.

## Event Naming

Use stable `snake_case` or another single documented convention. Do not rename event names casually because dashboards and analysis depend on them.

## Privacy

Do not collect more student data than necessary for product functionality.

Provide clear retention/deletion behavior for user-owned data when persistence is introduced.

## Alerts

Prioritize alerts for:

```text
sustained 5xx errors
AI service outage
large spike in invalid visualization specs
database connectivity failures
authentication failures at unusual rates
critical deployment failures
```

Do not alert on every individual student error.

## Operational Dashboard

A minimal internal dashboard should eventually show:

```text
error rate
API latency
AI success rate
visualization failure rate
active sessions / requests
critical infrastructure health
```

## Observability Rollout

### MVP

```text
structured server logs
basic client error capture
request IDs
critical API timing
```

### Pre-launch

```text
error monitoring
alerts
AI operational metrics
visualization failure metrics
```

### Post-launch

```text
product analytics
performance monitoring
cost monitoring
cohort/retention analytics where appropriate
```

Do not block the first educational vertical slice on a full analytics stack.
