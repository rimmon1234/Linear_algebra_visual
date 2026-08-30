# TECH_STACK.md

## Purpose

This document defines the approved technology baseline for the Interactive Linear Algebra Learning Platform. The goal is consistency, compatibility, performance, and maintainability.

## Core Stack

| Area | Approved choice | Rule |
|---|---|---|
| Language | TypeScript | Strict mode. Avoid `any` except documented boundary adapters. |
| Framework | Next.js App Router | Prefer Server Components unless browser interactivity is required. |
| UI | React | Keep components small and composable. |
| Styling | Tailwind CSS | Use for application UI, not WebGL scene objects. |
| UI primitives | shadcn/ui | Extend rather than introducing a second component system. |
| 3D | Three.js | Core rendering engine. |
| React 3D | React Three Fiber | React integration for Three.js. |
| 3D helpers | Drei | Use where it reduces custom code without hiding important behavior. |
| Client state | Zustand | Interactive shared client state only. |
| Server state | TanStack Query | Remote/asynchronous state where caching and synchronization are useful. |
| Runtime validation | Zod | Required at untrusted/data boundaries. |
| Math | Math.js + project math modules | Use established operations where appropriate; domain-specific algorithms live in the math layer. |
| Unit tests | Vitest | Math, schemas, domain logic, utilities. |
| E2E | Playwright | Critical user flows and browser behavior. |
| Backend/data | Supabase | PostgreSQL, Auth, Storage, RLS. |
| Deployment | Vercel | Initial deployment target, while keeping application logic portable. |

## Version Policy

1. Pin or lock dependency versions through the repository package manager lockfile.
2. Do not perform major-version upgrades during ordinary feature work.
3. Do not add a dependency without checking whether the existing stack already solves the problem.
4. Major upgrades require a documented decision in `DECISIONS.md` and a regression pass.
5. Keep Node.js and package-manager versions explicit in repository tooling (`engines`, `.nvmrc`/Volta/corepack configuration, or equivalent).

The exact versions should be recorded in the repository after project bootstrap. Do not invent future versions in documentation; use the versions actually installed and tested.

## Package Management

Use one package manager consistently. Prefer `pnpm` unless the repository already standardizes on another manager.

Commit the lockfile. Never mix package managers.

## Runtime Boundaries

### Browser

Allowed:

- UI rendering
- user interaction
- WebGL visualization
- lightweight numerical computation
- client state

Not allowed:

- secret keys
- service-role credentials
- privileged database operations
- arbitrary server-side code execution

### Server

Allowed:

- privileged database operations where authorized
- AI provider calls
- server-side validation
- protected business logic
- expensive computation where appropriate

Never expose secrets to the browser.

## Mathematics Strategy

Start TypeScript-first for interactive mathematics.

The browser math layer should handle the common educational operations needed by early modules. A Python/SciPy/SymPy service may be introduced later for advanced or symbolically intensive workflows only when the product demonstrates a real need.

Do not create a second math runtime merely because it is theoretically useful.

## 3D Performance Strategy

- Lazy-load heavy visualization code where practical.
- Reuse geometries and materials.
- Avoid unnecessary object creation in animation loops.
- Avoid high-frequency React state updates for render-loop data.
- Dispose resources when ownership ends.
- Test on a mid-range mobile device, not only a development workstation.

## Browser Support

Validate critical flows in current Chromium, Firefox, and WebKit environments through Playwright where practical.

## Required Developer Tooling

The repository should expose scripts equivalent to:

```text
lint
typecheck
test
test:watch
test:e2e
build
```

A convenient aggregate verification command is strongly recommended:

```text
verify
```

which runs the appropriate static checks and test suites.

## Dependency Decision Rule

Before adding a dependency, document:

1. What problem it solves.
2. Why existing libraries cannot solve it adequately.
3. Bundle/runtime impact.
4. Maintenance/compatibility implications.
5. Whether the feature can be implemented more simply without it.

## Non-Goals

Do not introduce microservices, Kubernetes, a dedicated Python backend, a message queue, Redis, or a separate CMS in the initial product slice unless a concrete requirement in the specifications requires it.
