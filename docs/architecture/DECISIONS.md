# DECISIONS.md

## Architectural Decision Records (ADRs)

---

## ADR-001 — Framework Choice

**Status:** Accepted

**Context:** The platform requires fast rendering, server-side rendering for content, interactive client-side 3D visualization, and static content generation where possible.

**Decision:** Use Next.js App Router with TypeScript.

**Reason:** Enables modular full-stack capabilities, server components for heavy static educational content, client boundaries for Three.js/R3F canvases, and API routes for AI interactions.

**Consequences:** Clear boundary separation required between Client and Server Components.

---

## ADR-002 — Visualization Architecture

**Status:** Accepted

**Context:** Visualizations must be modular, performant, reusable across topics, and easily scriptable by AI without executing arbitrary code.

**Decision:** Build a declarative Visualization Engine using React Three Fiber and Three.js with validated Zod schemas.

**Reason:** R3F provides declarative component composition for Three.js while maintaining native performance. AI generates JSON `VisualizationSpec` objects that are validated and rendered safely.

**Consequences:** Mathematical calculations must remain decoupled from Three.js scene graphs.

---

## ADR-003 — Math Engine Architecture

**Status:** Accepted

**Context:** Numerical calculations must be accurate, tested, independent of React/Three.js, and strictly follow floating-point tolerance policies.

**Decision:** Implement a pure TypeScript mathematical engine in `features/math/` without UI or rendering dependencies.

**Reason:** Allows isolated unit testing, deterministic verification, zero UI coupling, and reuse across both 2D/3D visualizers and server-side verification pipelines.

**Consequences:** No React hooks or browser APIs may be imported into math modules.

---

## ADR-004 — Client State Management

**Status:** Accepted

**Context:** Interactive visualizers require high-frequency updates, camera controls, matrix manipulation, and animation scrubber states across sibling components.

**Decision:** Use Zustand for interactive client visualization and toolbar state; use React local state for genuinely local UI widgets.

**Reason:** Zustand provides lightweight, unopinionated store management without the boilerplate of Redux or context re-render overhead.

**Consequences:** Avoid placing server state or persistent database state directly into Zustand stores.

---

## ADR-005 — AI Playground Pipeline

**Status:** Accepted

**Context:** AI must assist students with explanations and custom visualizations without generating executable code or hallucinations.

**Decision:** Strict pipeline: Question Parsing → Problem Identification → Math Engine Computation → Step-by-Step Derivation → Structured VisualizationSpec → Zod Validation → Visualization Engine.

**Reason:** Prevents code execution vulnerabilities and ensures mathematical truthfulness before generating visual geometry.

**Consequences:** AI outputs must always conform to `VisualizationSpec` and undergo runtime Zod validation.

---

## ADR-006 — Curriculum Registry

**Status:** Accepted

**Context:** Curriculum topics must be data-driven, searchable, prerequisite-aware, and easily extensible without creating new route components for every topic.

**Decision:** Define curriculum as structured data in `content/modules/` consumed by generic dynamic routes `/learn/[moduleSlug]/[topicSlug]`.

**Reason:** Decouples educational content from routing infrastructure and allows easy progression tracking and prerequisite validation.

**Consequences:** Adding a topic requires adding structured content and registering visualization presets, not creating new pages.

---

## ADR-007 — Styling Architecture

**Status:** Accepted

**Context:** Visual design must be premium, dark-mode focused, accessible, and responsive across desktop, tablet, and mobile.

**Decision:** Use Tailwind CSS with custom utility tokens, Lucide icons, and KaTeX for LaTeX mathematical formulas.

**Reason:** High developer velocity, atomic styling, responsive utilities, and seamless dark theme support.

**Consequences:** Strict adherence to centralized design tokens in `constants.ts` and Tailwind classes.

---

## ADR-008 — Testing Strategy

**Status:** Accepted

**Context:** System requires verification across mathematical accuracy, component rendering, schema validation, and end-to-end user journeys.

**Decision:** Vitest for unit/integration tests; Playwright for cross-browser and mobile viewport E2E tests.

**Reason:** Vitest offers lightning-fast TypeScript testing compatible with Vite/Next.js; Playwright verifies WebGL canvas rendering, camera interactions, and responsive UI.

**Consequences:** All PRs and milestones must pass `npm run verify` (`typecheck && lint && test && build && test:e2e`).

---

## ADR-009 — Numerical Precision & Tolerance Policy

**Status:** Accepted

**Context:** Floating-point rounding errors can cause false negatives in rank, singularity, orthogonality, and eigenvalue checks.

**Decision:** Strictly follow `NUMERICAL_POLICY.md` with explicit epsilon thresholds (`EPSILON = 1e-10`, `ZERO_TOLERANCE = 1e-7`) and tolerance-based comparisons.

**Reason:** Prevents visual glitches, incorrect algebraic classifications, and `NaN`/`Infinity` propagation.

**Consequences:** Direct exact equality (`=== 0`) on computed floating-point numbers is strictly forbidden.

---

## ADR-010 — Package Management & Tooling

**Status:** Accepted

**Context:** Environment consistency is critical to avoid lockfile churn and non-deterministic dependency resolution.

**Decision:** Standardize strictly on `npm` as the package manager (`npm@11.x`).

**Reason:** Universal CI compatibility, reliable lockfile format, and native node ecosystem integration.

**Consequences:** Do not use `yarn`, `pnpm`, or `bun` commands.

---

## ADR-011 — Coordinate System & Visual Orientations

**Status:** Accepted

**Context:** 2D and 3D visualizers must maintain consistent Cartesian conventions.

**Decision:** Standard right-handed Cartesian coordinates:
- 2D: +X right (Red), +Y up (Green).
- 3D: +X right (Red), +Y forward/up (Green), +Z depth/up (Blue).

**Reason:** Conforms to standard university Linear Algebra pedagogy.

**Consequences:** All primitives and shaders must respect these axis conventions.

---

## ADR-012 — Scene Model Compilation Architecture

**Status:** Accepted

**Context:** The visualizer needs a lightweight bridge between raw `VisualizationSpec` data and React Three Fiber rendering components.

**Decision:** Implement `buildSceneModel` as a pure compilation layer that parses objects, normals, orientations, and colors before rendering.

**Reason:** Isolates scene graph optimization, geometric sanitization, and fallback defaults from UI components.

**Consequences:** UI components receive typed `SceneModel` structures ready for direct rendering.

---

## ADR-013 — Mathematical Error Handling Architecture

**Status:** Accepted

**Context:** Mathematical operations can fail (e.g. division by zero, non-invertible matrices, incompatible dimensions).

**Decision:** Use explicit functional `Result<T, MathError>` return types for all fallible operations in `features/math/`.

**Reason:** Eliminates unexpected runtime exceptions and forces UI and visualizer layers to handle degenerate/singular cases gracefully.

**Consequences:** Functions returning `Result<T, MathError>` must be checked with `.ok` before consuming `.value`.

---

## ADR-014 — Package Manager Standardization

**Status:** Accepted

**Context:** Maintain tooling consistency across local environments and CI pipelines.

**Decision:** Pin `packageManager: "npm@11.13.0"` in `package.json`.

**Reason:** Guarantees deterministic dependency installation and unified script invocation.

**Consequences:** All project scripts run via `npm run <script>`.

---

## ADR-015 — 2D Matrix Transformation Animation Strategy

**Status:** Accepted

**Context:** Animating the transition from standard coordinate space to transformed matrix state ($I \to A$) requires a mathematically sound trajectory.

**Decision:** Define the time-dependent operator as $A(t) = (1 - t)I + tA$ for $t \in [0, 1]$.
- Linearity is strictly preserved for every intermediate $t \in [0, 1]$.
- The origin $[0, 0]^T$ remains stationary at all times.
- Straight parallel lines remain straight and parallel.
- Area is defined as $\text{area}(t) = |\det(A(t))|$.

**Reason:** Provides an intuitive, mathematically grounded animation without fabricating artificial curves.

**Consequences:** Visualizer models and unit-square renderers consume $A(t)$ driven by animation progress.

---

## ADR-016 — Implementation Order vs. Academic Syllabus Order

**Status:** Accepted

**Context:** The academic curriculum follows the standard university syllabus (Module I: Matrices & Eigenvalues $\to$ Module II: Vector Spaces $\to$ Module III: Orthogonality $\to$ Module IV: Linear Transformations). However, optimal software engineering development requires building core matrix/eigenvalue computations and geometric inner product projections before tackling abstract vector spaces.

**Decision:** Strictly distinguish between the **Academic Syllabus Order** and the **Development / Implementation Order**:
- **Academic Syllabus Order (Student-Facing & Curriculum Registry):**
  1. Module I: Matrices, Eigenvalues and Decompositions
  2. Module II: Vector Spaces
  3. Module III: Inner Product Spaces and Orthogonality
  4. Module IV: Linear Transformations
- **Development / Implementation Order (Engineering Roadmap):**
  1. Repository Foundation (Phase 0) [COMPLETE]
  2. Curriculum Foundation (Phase 1) [COMPLETE]
  3. Visualization Foundation (Phase 2) [COMPLETE]
  4. Matrix Transformation Foundation (Phase 3) [COMPLETE]
  5. **Module I — Matrices, Eigenvalues and Decompositions [NEXT DEVELOPMENT TARGET]**
  6. **Module III — Inner Product Spaces and Orthogonality**
  7. **Module IV — Linear Transformations (Reusing Phase 3 infrastructure)**
  8. **Module II — Vector Spaces**
  9. **Final Integration / AI Playground / Production Hardening**

**Reason:** Module I and Module III provide foundational matrix algorithms, eigenvalue solvers, and orthogonal projection primitives that later abstract modules (Module IV and Module II) consume. Preserving the student-facing academic ordering ensures curriculum integrity while enabling optimal engineering sequencing.

**Consequences:** Task tracking and feature development strictly follow the implementation order without altering student-facing curriculum navigation.
