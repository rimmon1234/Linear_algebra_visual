# DECISIONS.md

Architecture Decision Record (ADR) log.

## ADR-001 — Data-Driven Curriculum

**Status:** Accepted

Modules and topics are represented as structured data rather than hard-coded page implementations.

**Reason:** topics must be easy to add, reorder, archive, and maintain.

## ADR-002 — Math/Rendering Separation

**Status:** Accepted

The math engine is independent from React and Three.js.

**Reason:** deterministic testing, reuse, and prevention of duplicated mathematics.

## ADR-003 — Structured AI Visualization Output

**Status:** Accepted

AI returns validated visualization specifications, never renderer code.

**Reason:** security, maintainability, deterministic rendering, and consistency.

## ADR-004 — React Three Fiber + Three.js

**Status:** Accepted for initial implementation

Use R3F for React integration and Three.js as the rendering engine.

## ADR-005 — TypeScript-First Math Engine

**Status:** Accepted for initial implementation

Start with browser-compatible TypeScript mathematics for interactive operations. Add a Python numerical/symbolic service only when requirements justify it.

## ADR-006 — Supabase for Persistent User Data

**Status:** Accepted for the persistence phase

Use Supabase/Postgres/Auth/Storage/RLS for user-specific persistent data.

## ADR-007 — Progressive Infrastructure

**Status:** Accepted

Do not block the initial learning/visualization experience on authentication, advanced backend services, or a full CMS.

## ADR-008 — 2D and 3D as Complementary

**Status:** Accepted

Do not force every concept into 3D. Choose the representation that best communicates the mathematical idea.

## ADR-009 — Tolerance-Based Numerical Policy

**Status:** Accepted

All floating-point comparisons and numerical rank/decomposition decisions follow a centralized tolerance policy.

## ADR-010 — Vertical Slices

**Status:** Accepted

Build complete end-to-end slices before expanding horizontally across the curriculum.

## ADR-011 — Standard Mathematical Coordinate System

**Status:** Accepted

**Context:** The 3D and 2D visualization system requires a consistent coordinate system mapping across all primitives (axes, grids, vectors, planes, transformations).

**Decision:** Standardize on standard right-handed Cartesian coordinates (+X right, +Y up in 2D; +X right, +Y forward/up, +Z up/depth depending on projection convention). Define coordinate constants centrally in the visualization layer.

**Reason:** Mathematical consistency with university textbook conventions and predictable vector rendering.

**Consequences:** Visualizer primitives and camera controllers must use this canonical mapping uniformly.

## ADR-012 — Formula Typesetting with KaTeX

**Status:** Accepted

**Context:** Mathematical formulas, derivations, and practice problems require clear LaTeX typesetting in both Server and Client Components.

**Decision:** Use KaTeX (`katex`) for fast, server-renderable LaTeX mathematical notation.

**Reason:** Zero-runtime client overhead for static formulas, fast rendering performance, and complete coverage of standard Linear Algebra LaTeX syntax.

**Consequences:** Content files and UI components use standardized LaTeX strings rendered through a dedicated KaTeX component.

## ADR-013 — Deterministic Result Pattern for Math Engine

**Status:** Accepted

**Context:** The canonical math engine must handle expected mathematical singularities (e.g. non-invertible matrices, zero-norm vectors, dimension mismatches) safely without uncaught runtime exceptions.

**Decision:** All domain math operations return a typed `Result<T, MathError>` discriminated union (`{ ok: true, value: T } | { ok: false, error: MathError }`).

**Reason:** Eliminates unexpected runtime crashes, enforces explicit error handling at UI/service boundaries, and provides clean diagnostic reasons for AI/practice feedback.

**Consequences:** Callers must explicitly check `result.ok` before accessing computation values.

## ADR-014 — npm as the Official Repository Package Manager

**Status:** Accepted

**Context:** Having ambiguity between `pnpm` and `npm` creates risks of divergent dependency hoisting and duplicate lockfiles.

**Decision:** Standardize on `npm` as the single official package manager for this repository (pinned via `"packageManager": "npm@11.13.0"` in `package.json`). Commit `package-lock.json` exclusively.

**Reason:** Aligns directly with the host environment runtime, eliminates tooling ambiguity, ensures deterministic dependency resolution across local development and CI, and guarantees a single canonical lockfile.

**Consequences:** All installation, execution, and CI scripts must use `npm` (`npm install`, `npm test`, `npm run build`, etc.). Alternative package managers are not permitted.

## ADR-015 — Matrix Transformation Linear Interpolation Strategy for Pedagogical Animations

**Status:** Accepted

**Context:** Animating the transition from the standard coordinate system to a transformed matrix state ($I \to A$) requires a mathematically coherent trajectory that can be scrubbed and visualized continuously.

**Decision:** Define the time-dependent operator as $A(t) = (1 - t)I + tA$ for $t \in [0, 1]$.
* **Preserved Invariants:**
  * Linearity is strictly preserved for every intermediate $t \in [0, 1]$ (i.e. $A(t)(c u + v) = c A(t)u + A(t)v$).
  * The origin $[0, 0]^T$ remains stationary at all times ($A(t) \mathbf{0} = \mathbf{0}$).
  * Straight parallel grid lines remain straight and parallel at every intermediate frame.
* **Important Mathematical Caveats:**
  * Invertibility is NOT guaranteed at intermediate times (e.g. reflections or shears may pass through singular rank-deficient states where $\det(A(t)) = 0$).
  * Orientation and determinant sign may change continuously during the transition.
  * The visual area is defined strictly as $\text{area}(t) = |\det(A(t))|$, derived from the mathematical model rather than pixel estimations.

**Reason:** Provides an intuitive, mathematically grounded animation where each intermediate frame represents a valid linear operator without fabricating artificial curves or non-linear screen-space offsets.

**Consequences:** The visualization model, grid primitive, and basis vector renderers directly consume $A(t)$ driven by the animation progress state.

## ADR Template

When adding a decision:

```text
## ADR-XXX — Title

Status: Proposed | Accepted | Superseded

Context:

Decision:

Reason:

Alternatives considered:

Consequences:
```
