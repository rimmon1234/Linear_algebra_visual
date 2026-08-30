# ARCHITECTURE_AUDIT.md

**Interactive Linear Algebra Learning Platform — Architectural Audit & Specification Analysis**  
*Date: 2026-08-30 | Lead Software Engineer Audit Report (Updated)*

---

## Executive Summary

The project specification suite comprises 22 comprehensive documents defining product scope, pedagogical guidelines, mathematical rigor, visualization contracts, AI pipeline constraints, security controls, testing expectations, and phased milestones.

The repository currently contains only specification documents; no application code, package configurations, or runtime assets exist yet. This audit establishes architectural clarity, reconciles cross-specification nuances, catalogs key engineering risks, records formal Architecture Decision Records (ADRs), and outlines the precise sequence for bootstrap and execution without introducing unnecessary complexity.

---

## A. Confirmed Architectural Decisions

The following architectural decisions are firmly established and must not be altered during implementation:

1. **Strict 4-Layer Separation:**
   ```text
   Presentation / UI (React Server & Client Components, Tailwind CSS, shadcn/ui)
         ↓
   Feature Orchestration (Curriculum queries, visualizer controllers, playground solver)
         ↓
   Domain / Mathematics Layer (Pure TypeScript math engine, tolerance-aware, zero UI/React/Three.js imports)
         ↓
   Infrastructure (Supabase Client/Server, AI SDK, Storage, Observability adapters)
   ```
2. **Canonical Math Engine & Tolerance Authority:**
   - Mathematical calculations (`matrix`, `vector`, `eigen`, `decomposition`, `subspaces`, `projection`, `orthogonality`) reside exclusively in `features/math/**`.
   - UI and 3D visualizer components consume math engine outputs and must never reimplement mathematical algorithms.
   - `NUMERICAL_POLICY.md` is the single canonical source of truth for all numerical tolerances and floating-point comparisons. No competing tolerance definitions exist; all implementation constants derive directly from that policy.
3. **Data-Driven Topic & Curriculum Model:**
   - Topics and modules are data objects (`content/` and `features/curriculum/registry.ts`) rather than bespoke React routes.
   - Dynamic routing (`/learn/[moduleSlug]/[topicSlug]`) dynamically renders lessons from topic schemas.
   - Adding or archiving a topic requires data/preset configuration, not routing rewrites.
4. **Structured Visualization Pipeline (R3F / Three.js):**
   - Scene rendering is strictly driven by validated declarative specifications (`VisualizationSpec` validated with Zod).
   - Reusable visualization primitives (`Axes`, `Grid`, `Vector`, `Basis`, `Plane`, `Subspace`, `MatrixTransform`, `Projection`, `Surface`, `Labels`, `AnimationController`) are composed into topic scenes.
   - 2D and 3D are complementary: 2D is used for planar concepts; 3D for spatial concepts; projection/slice for $\mathbb{R}^n$ ($n > 3$).
5. **AI Playground as Controlled Orchestrator (No Code Execution):**
   - AI interprets student questions, generates pedagogical prose, and proposes structured `VisualizationSpec` JSON.
   - AI outputs are strictly validated via Zod and verified against the deterministic math engine before rendering.
   - Arbitrary model-generated code (`eval`, dynamic JS/React/WebGL strings) is strictly prohibited.
6. **Progressive Persistence & Clean Boundaries:**
   - Static curriculum content remains in version-controlled files (`content/**`).
   - Persistent user data (profiles, topic progress, attempts, saved sessions) is managed in Supabase PostgreSQL with Row Level Security (RLS).
   - Public educational content requires zero authentication.
7. **Vertical Slice Development Order:**
   - Development proceeds vertically (complete end-to-end learning loop: content → math → visualization → interaction → practice → tests) rather than horizontally across the entire syllabus.

---

## B. Specification Cross-Check & Resolutions

| # | Topic / Area | Affected Files | Specification Rule / Source of Truth | Reconciled Direction |
|---|---|---|---|---|
| 1 | **Package Manager Standardization** | `TECH_STACK.md`, `DECISIONS.md` | `TECH_STACK.md` is the source of truth for package management policy. | Formalized in **ADR-014**: Pin the chosen package manager version explicitly via `package.json` (`packageManager` field) and commit its lockfile. Never mix package managers or switch arbitrarily. |
| 2 | **First Vertical Slice vs Topic Progression** | `VERTICAL_SLICE.md`, `TASKS.md`, `implementation.md` | `VERTICAL_SLICE.md` / `TASKS.md` Phase 4 define initial execution slice. | Foundation + 2D Matrix Transformation is the prerequisite mathematical and graphical primitive (**Phase 4 / Vertical Slice 1**). Eigenvalues & Eigenvectors (**Phase 5 / Slice 2**) builds directly on top of this transformation engine. |
| 3 | **Curriculum Data Access (RSC vs API Routes)** | `API_CONTRACT.md`, `DATABASE_SPEC.md`, `PROJECT_RULES.md` | `PROJECT_RULES.md` mandates zero unnecessary client-server hops for server components. | Next.js Server Components import directly from `features/curriculum/queries.ts` (accessing registry/files directly); `/api/modules` and `/api/topics/*` route handlers expose the exact same validated data for client/external consumers. |
| 4 | **Matrix Transformation Animation Fidelity** | `VISUALIZATION_SPEC.md`, `implementation.md`, `PROJECT_RULES.md` | `VISUALIZATION_SPEC.md` requires animations to be mathematically meaningful. | The `AnimationController` and matrix visualizer must support parameter-aware geometric transitions (e.g., continuous rotation angle or polar/eigen decomposition where applicable) rather than naive component lerping when pedagogical truthfulness is at stake. |
| 5 | **React 19 / Next.js 15 & React Three Fiber Ecosystem** | `TECH_STACK.md`, `package.json` | `TECH_STACK.md` dictates clean compatibility and locked versions. | Pin compatible versions of React and Three.js during package initialization to ensure seamless WebGL canvas mounting without peer dependency collisions. |

---

## C. Formal Architecture Decisions (Documented in DECISIONS.md)

The technical decisions identified during audit have been formally recorded in `DECISIONS.md`:

1. **Standard Mathematical Coordinate System ([ADR-011](file:///c:/Users/sabit/Desktop/Projects/linear_algebra/DECISIONS.md)):**
   - Right-handed Cartesian coordinates (+X right, +Y up in 2D; +X right, +Y forward/up, +Z up/depth in 3D). Canonical constants defined centrally in the visualization layer.
2. **Formula Typesetting with KaTeX ([ADR-012](file:///c:/Users/sabit/Desktop/Projects/linear_algebra/DECISIONS.md)):**
   - Use KaTeX (`katex`) for high-performance, server-renderable LaTeX mathematical notation across content and practice.
3. **Deterministic Result Pattern for Math Engine ([ADR-013](file:///c:/Users/sabit/Desktop/Projects/linear_algebra/DECISIONS.md)):**
   - All domain math operations return typed `Result<T, MathError>` discriminated unions (`{ ok: true, value: T } | { ok: false, error: MathError }`) rather than throwing runtime exceptions for expected mathematical singularities.
4. **Pinned Package Manager Policy ([ADR-014](file:///c:/Users/sabit/Desktop/Projects/linear_algebra/DECISIONS.md)):**
   - `TECH_STACK.md` is the source of truth; package manager and version are explicitly pinned in `package.json` with a single committed lockfile.
5. **Numerical Tolerances Derived Exclusively from NUMERICAL_POLICY.md ([ADR-009](file:///c:/Users/sabit/Desktop/Projects/linear_algebra/DECISIONS.md)):**
   - `NUMERICAL_POLICY.md` is the single source of truth for numerical thresholds (`ZERO_TOLERANCE`, `RANK_TOLERANCE`, `ORTHOGONALITY_TOLERANCE`, `SINGULAR_VALUE_TOLERANCE`). Implementation constants must derive solely from this policy.

---

## D. Risk Assessment & Mitigation

| Risk Category | Potential Failure Mode | Severity | Mitigation Strategy |
|---|---|---|---|
| **3D Rendering Performance** | High-frequency React re-renders on slider/mouse drag causing canvas stutter or frame drops. | High | Isolate interactive visualizer state in Zustand; bypass React component tree for animation loops using Three.js refs and direct frame mutations (`useFrame`). |
| **Numerical Stability & Singularities** | Floating-point inaccuracies creating spurious non-zero values, division by zero during normalization, or false rank calculations. | High | Enforce centralized numerical policy with scale-aware thresholds; detect near-zero norms before division; clamp values below `ZERO_TOLERANCE` to zero. |
| **AI Hallucination in Playground** | LLM generating incorrect eigenvalues, false geometric claims, or invalid mathematical steps. | High | Pipeline verification: LLM classifies problem → deterministic math engine calculates authoritative solution → LLM builds explanation around verified result → structured JSON spec validated via Zod. |
| **Visualization Untruthfulness** | Coordinate axes, transformed grids, or vector arrows displaying misleading spatial representations. | Medium | Unit-test math-to-visualization compiler against known canonical test vectors; numeric labels derived from the exact same mathematical model state. |
| **Mobile & Touch Usability** | OrbitControls conflicting with page scrolling; canvas controls unreadable or untappable on mobile screens. | Medium | Responsive viewport architecture: dedicated canvas container with gesture isolation; collapsible bottom sheet for controls; touch-friendly sliders and inputs. |
| **WebGL Context Loss & Hardware Fallback** | Low-end mobile devices or disabled WebGL producing blank, broken screens. | Medium | Implement robust WebGL capability detection and an accessible fallback mode providing 2D canvas/SVG or structured textual/tabular representations. |
| **Database & Schema Inconsistency** | Disconnect between static repository curriculum IDs and stored user progress. | Low | Use immutable topic and module string IDs (e.g., `module-1`, `eigenvalues-eigenvectors`) across code, database migrations, and telemetry events. |
| **Security & Code Injection** | Malicious student inputs or LLM hallucinations injecting arbitrary JavaScript, HTML, or SQL. | Critical | Strict Zod validation on all API boundaries; safe expression parsing for math input; sanitized Markdown rendering; zero `eval()` or dynamic component generation. |

---

## E. Recommended Implementation Order

The development sequence strictly follows the vertical progression defined in `TASKS.md` and `implementation.md`:

```text
Phase 0: Project & Architecture Foundation
  ├── Next.js App Router + TypeScript (Strict Mode)
  ├── Tailwind CSS + shadcn/ui Design Tokens
  ├── Vitest + Playwright Testing Harness
  └── Clean Layered Directory Structure

Phase 1: Curriculum & Content Registry Foundation
  ├── Topic & Module Zod Schemas
  ├── Data-Driven Curriculum Registry (Module I definitions)
  └── Generic Dynamic Route Shell (/learn/[moduleSlug]/[topicSlug])

Phase 2: Math Engine Foundation (Pure TypeScript)
  ├── Vector Operations (add, sub, scale, dot, norm, normalize, angle)
  ├── Matrix Operations (add, multiply, transpose, det, inv, rank, rref)
  ├── Linear Systems Solver (unique, none, infinite parametric)
  └── Comprehensive Numerical Unit Test Suite

Phase 3: Visualization Core (Three.js & R3F)
  ├── Canvas Wrapper & WebGL Fallback Boundary
  ├── Primitives (Axes, Grid, Vector, Point, Line, Plane, Labels)
  ├── Camera & Interaction Controllers (Orbit, Zoom, Reset)
  └── Declarative VisualizationSpec Parser & Zod Validator

Phase 4: First Complete Vertical Slice (2D Matrix Transformation)
  ├── Interactive 2D Matrix Transformation Scene
  ├── Matrix/Vector Editor & Transformation Animation
  ├── Topic Content & Worked Examples
  ├── Integrated Practice Question & Feedback
  └── E2E Flow & Browser Verification

Phase 5+: Subsequent Topics & Modules (Eigenvalues, SVD, Vector Spaces, Orthogonality)
  ├── Topic-by-Topic Vertical Expansion
  ├── AI Playground Solver Pipeline (Structured Output + Verification)
  └── Persistence Layer (Supabase Auth, Progress, RLS)
```
