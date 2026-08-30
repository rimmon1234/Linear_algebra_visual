# DEPENDENCY_PLAN.md

**Interactive Linear Algebra Learning Platform — Dependency Audit & Phased Plan**  
*Date: 2026-08-30 | Lead Software Engineer Audit Report (Updated)*

---

## 1. Overview & Policy

Per `TECH_STACK.md`, `PROJECT_RULES.md`, and **ADR-014**:
1. `npm` is the single official package manager for this repository, pinned via `"packageManager": "npm@11.13.0"` in `package.json`.
2. `package-lock.json` is the sole lockfile committed to version control.
3. Dependencies are introduced **only when required for the active implementation milestone**.
4. No unnecessary, overlapping, or speculative packages are permitted.
5. All dependencies must be documented with their purpose, rationale, and compatibility considerations.

---

## 2. Dependency Audit Matrix

| Dependency | Purpose | Required Now? (Milestone 0) | Reason | Compatibility Concerns |
|---|---|:---:|---|---|
| `next` | Core Full-stack Web Framework (App Router) | **YES** | Foundation for routing, server components, and deployment. | Ensure Node.js 20+ compatibility (host is v24.17.0). |
| `react`, `react-dom` | UI Rendering Engine | **YES** | Core UI library for Next.js and component architecture. | Check compatibility with React Three Fiber peer dependencies. |
| `typescript` | Static Typing & Type Safety | **YES** | Strict TypeScript required across all layers. | Standard compiler dependency. |
| `@types/node`, `@types/react`, `@types/react-dom` | TypeScript type declarations | **YES** | Required for typechecking Next.js and React components. | Keep aligned with React version. |
| `tailwindcss`, `postcss`, `autoprefixer` | Utility-First Styling Engine | **YES** | Core styling for application layouts, controls, cards, and navigation. | Tailwind with PostCSS configuration. |
| `clsx`, `tailwind-merge` | Utility class merging | **YES** | Required for robust shadcn/ui style utilities (`cn` helper). | Zero runtime issues; lightweight. |
| `lucide-react` | UI Iconography | **YES** | Clean iconography for controls (play, pause, reset, zoom, rotate). | Lightweight SVG icons. |
| `zod` | Runtime Schema Validation | **YES** | Mandatory validation for curriculum metadata, topic schemas, and visualization specs. | TypeScript inference; zero dependencies. |
| `vitest` | Unit & Domain Test Runner | **YES** | Testing canonical math engine, curriculum registry, and validation schemas. | Native ESM & TypeScript support; fast execution. |
| `@playwright/test` | End-to-End Test Suite | **YES** | Critical user flow and visualizer canvas browser testing. | Supports Chromium, Firefox, WebKit. |
| `three`, `@types/three` | 3D / 2D WebGL Rendering Engine | **NO (Milestone 2)** | Core graphics engine for vectors, axes, grids, and transformations. | Standard Three.js release. |
| `@react-three/fiber` | React integration for Three.js | **NO (Milestone 2)** | Declarative Three.js scene graph management in React. | Ensure peer dependency alignment with React version. |
| `@react-three/drei` | Useful Three.js / R3F Helpers | **NO (Milestone 2)** | Camera controls (`OrbitControls`), text rendering, line primitives. | Keep synchronized with `@react-three/fiber`. |
| `zustand` | Interactive Client State Management | **NO (Milestone 2)** | Shared high-frequency state for visualizer (matrix inputs, camera, animation). | Lightweight (<2kB), does not trigger unnecessary React tree re-renders. |
| `katex`, `@types/katex` | LaTeX Mathematical Notation (ADR-012) | **NO (Milestone 1)** | High-performance formula rendering for definitions and derivations. | Fast server/client math rendering. |
| `mathjs` | General Math Utility Baseline | **NO (Milestone 1)** | Auxiliary matrix/number parsing; used alongside custom domain math algorithms. | Pure JS/TS compatible. |
| `@tanstack/react-query` | Server / Async State Management | **NO (Milestone 10)** | Remote state synchronization and query caching. | Not needed until remote persistence and server data fetching arise. |
| `@supabase/supabase-js`, `@supabase/ssr` | Supabase Database & Auth Client | **NO (Milestone 10)** | User accounts, progress tracking, and session persistence. | Auth/persistence is explicitly scheduled after the core visual learning loop is proven. |
| `ai`, `@ai-sdk/openai` (or provider) | AI Streaming & Tool Orchestration | **NO (Milestone 6)** | Vercel AI SDK for Playground LLM integration. | Playground is scheduled for Milestone 6 after math engine and visualizer are mature. |

---

## 3. Immediate Installation Scope (Milestone 0 Foundation Only)

Only the following core dependencies are scheduled for Milestone 0 in `package.json`:

### Production Dependencies:
```json
{
  "next": "^15.1.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.0.0",
  "lucide-react": "^1.16.0",
  "zod": "^3.24.0"
}
```

### Development Dependencies:
```json
{
  "typescript": "^5.7.0",
  "@types/node": "^22.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "postcss": "^8.4.0",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "vitest": "^3.0.0",
  "@playwright/test": "^1.50.0"
}
```

---

## 4. Unapproved / Excluded Technologies (Do Not Install)

Per `TECH_STACK.md` and `PROJECT_RULES.md`, the following must **NOT** be installed:
- ❌ Microservices / message queues / Redis / Kafka
- ❌ Python backends / Flask / FastAPI (symbolic/SciPy math deferred until product need is demonstrated)
- ❌ Heavy CMS frameworks
- ❌ Alternative styling libraries (styled-components, Emotion, Sass)
- ❌ Unapproved component frameworks (Material UI, Chakra UI, Ant Design)
- ❌ Real-time collaboration engines
- ❌ Complex animation libraries when Three.js native animations suffice
