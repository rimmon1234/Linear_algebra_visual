# TASKS.md

## How to Use This File

Work top-to-bottom according to the authoritative **Implementation Order** (ADR-016). Do not start a later phase until the required previous phase is working and verified.

---

## Academic Order vs. Implementation Order

### Academic Syllabus Order (Student-Facing & Navigation)
1. **Module I:** Matrices, Eigenvalues and Decompositions
2. **Module II:** Vector Spaces
3. **Module III:** Inner Product Spaces and Orthogonality
4. **Module IV:** Linear Transformations

### Development / Implementation Order (Authoritative Engineering Roadmap)
1. **Phase 0:** Repository Foundation — **COMPLETE**
2. **Phase 1:** Curriculum Foundation — **COMPLETE**
3. **Phase 2:** Visualization Foundation — **COMPLETE**
4. **Phase 3:** Matrix Transformation Foundation — **COMPLETE**
5. **Phase 4:** **MODULE I — COMPLETE [CURRENT ACTIVE TARGET]**
6. **Phase 5:** **MODULE III — COMPLETE**
7. **Phase 6:** **MODULE IV — COMPLETE**
8. **Phase 7:** **MODULE II — COMPLETE**
9. **Phase 8:** **Final Integration / AI Playground / Production Hardening**

---

# Phase 0 — Repository Foundation — COMPLETE & VERIFIED

- [x] Initialize Next.js + TypeScript project.
- [x] Configure linting/formatting.
- [x] Configure Tailwind and UI component system.
- [x] Configure testing tools.
- [x] Create documented directory architecture.
- [x] Add `AGENTS.md` and specification files.
- [x] Add CI verification pipeline.

---

# Phase 1 — Curriculum Foundation — COMPLETE & VERIFIED

- [x] Implement module registry.
- [x] Implement topic registry.
- [x] Implement topic schema validation.
- [x] Create Module I metadata.
- [x] Create initial topic content for one topic.
- [x] Implement generic module page.
- [x] Implement generic topic page.
- [x] Add topic navigation.

---

# Phase 2 — Visualization Foundation — COMPLETE & VERIFIED

- [x] Add Three.js/R3F canvas.
- [x] Add camera controls.
- [x] Add axes.
- [x] Add grid.
- [x] Add point primitive.
- [x] Add vector primitive.
- [x] Add labels.
- [x] Add reset controls.
- [x] Add 2D/3D scene abstraction.
- [x] Add visualization schema.
- [x] Add visualization-spec validation.

---

# Phase 3 — Matrix Transformation Foundation — COMPLETE & VERIFIED

- [x] Implement pure vector operations (`add`, `subtract`, `scale`, `dot`, `norm`, `normalize`, `angle`, `linearCombination`).
- [x] Implement pure matrix operations (`multiply`, `transpose`, `determinant`, `matrixVectorMultiply`, `rank`, `rref`, `inverse`).
- [x] Implement 2D transformation evaluation engine ($A(t) = (1-t)I + tA$).
- [x] Strict layer separation (Fixed Reference Layer vs Dynamic Transformation Layer).
- [x] 2D Matrix Editor with instant validation.
- [x] Preset Selector (Shear, Rotation, Reflection, Scaling, Projection onto x-axis).
- [x] Custom Vector input ($v \to Av$).
- [x] Transformed Basis Vectors ($Ae_1, Ae_2$) with Column Invariant verification.
- [x] Transformed Unit-Square Parallelogram with area $= |\det(A)|$.
- [x] Linearity Demonstration mode ($A(u+v) = Au + Av$).
- [x] Numerical Panel with mathematical derivations.
- [x] Independent camera framing controls (**Fit Scene** and **Reset Camera** with zero jitter).
- [x] Clean single-grid visual layout.
- [x] 61 Vitest unit tests & 11 Playwright E2E tests passing.

---

# Phase 4 — MODULE I: Matrices, Eigenvalues & Decompositions (CURRENT TARGET)

Complete every topic vertically with content, math engine algorithms, visualizer presets, worked examples, practice problems, and tests:

- [x] **Topic 1: Characteristic Equations — COMPLETE & VERIFIED**
  - [x] Characteristic polynomial computation $\det(A - \lambda I) = 0$ with trace-determinant form $\lambda^2 - \text{tr}(A)\lambda + \det(A) = 0$.
  - [x] Discriminant classification $\Delta = \text{tr}(A)^2 - 4\det(A)$ for distinct real, repeated real, and complex conjugate roots.
  - [x] Step-by-step symbolic derivation engine with LaTeX formatting.
  - [x] 2D SVG Polynomial Curve Visualizer ($p(\lambda)$ vs $\lambda$) with real root intercepts and vertex calculation.
  - [x] Interactive Matrix Editor with 6 guided presets (Diagonal, Symmetric, Shear, Rotation, Singular, Generic Golden).
  - [x] Contextual navigation card to Module IV Linear Transformations explaining $Av = \lambda v \iff (A - \lambda I)v = 0$.
  - [x] Full 9-section topic lesson, 4 worked examples, 7 common misconceptions, and 5 interactive practice problems with solutions.
  - [x] KaTeX mathematical typesetting engine with `<MathFormula>` and `<MathText>` abstractions.
  - [x] 75 Vitest unit tests & 14 Playwright E2E tests passing with 0 console errors.
- [ ] **Topic 2: Eigenvalues and Eigenvectors**
  - [ ] Invariant direction visualizer: $(A - \lambda I)v = 0$.
  - [ ] Vector transformation showing direction preservation ($Av = \lambda v$).
  - [ ] Algebraic vs geometric multiplicity.
- [ ] **Topic 3: Diagonalization**
  - [ ] $A = PDP^{-1}$ transformation decomposition visualizer.
  - [ ] Change of basis to eigenvector coordinates.
- [ ] **Topic 4: Applications to Differential Equations**
  - [ ] Phase portraits and trajectory visualizer for $\dot{x} = Ax$.
  - [ ] Stability analysis based on eigenvalue signs.
- [ ] **Topic 5: Symmetric Matrices**
  - [ ] Spectral theorem visualizer: orthogonal eigenvectors ($A = Q\Lambda Q^T$).
  - [ ] Orthogonal transformation decomposition.
- [ ] **Topic 6: Positive Definite Matrices**
  - [ ] Quadratic form visualizer: $q(x) = x^T A x$.
  - [ ] 3D paraboloid / ellipsoid surface rendering.
- [ ] **Topic 7: Similar Matrices**
  - [ ] Matrix similarity $B = P^{-1}AP$ and invariant eigenvalues.
- [ ] **Topic 8: Singular Value Decomposition (SVD)**
  - [ ] Geometric SVD visualizer: Unit Circle $\to$ Rotation $V^T$ $\to$ Scaling $\Sigma$ $\to$ Rotation $U$ $\to$ Ellipsoid.
- [ ] **Topic 9: Generalized Inverses**
  - [ ] Moore-Penrose pseudoinverse $A^+$ and least squares minimum norm solution.

**Exit condition:** All 9 Module I topics fully implemented, tested, verified, and passing `npm run verify`.

---

# Phase 5 — MODULE III: Inner Product Spaces & Orthogonality

- [ ] Topic 1: Inner Product Spaces
- [ ] Topic 2: Norms
- [ ] Topic 3: Orthogonality
- [ ] Topic 4: Projections and Subspaces
- [ ] Topic 5: Orthogonal Complementary Subspaces
- [ ] Topic 6: Orthogonal Projections
- [ ] Topic 7: Gram-Schmidt Orthogonalization Process
- [ ] Topic 8: Least Square Approximations
- [ ] Topic 9: QR Decomposition

**Exit condition:** All 9 Module III topics fully implemented, tested, verified, and passing `npm run verify`.

---

# Phase 6 — MODULE IV: Linear Transformations

- [ ] Topic 1: Linear Transformations (reusing Phase 3 foundation)
- [ ] Topic 2: Kernels and Images
- [ ] Topic 3: Rank-Nullity Theorem
- [ ] Topic 4: Matrix Representation of a Linear Transformation
- [ ] Topic 5: Change of Basis
- [ ] Topic 6: Linear Space of Linear Mappings

**Exit condition:** All 6 Module IV topics fully implemented, tested, verified, and passing `npm run verify`.

---

# Phase 7 — MODULE II: Vector Spaces

- [ ] Topic 1: Vector Spaces
- [ ] Topic 2: Subspaces
- [ ] Topic 3: Linear Combinations and Span
- [ ] Topic 4: Linear Independence
- [ ] Topic 5: Basis and Dimension
- [ ] Topic 6: Four Fundamental Subspaces
- [ ] Topic 7: Rank and Nullity
- [ ] Topic 8: Coordinate Systems
- [ ] Topic 9: Direct Sums

**Exit condition:** All 9 Module II topics fully implemented, tested, verified, and passing `npm run verify`.

---

# Phase 8 — Final Integration, AI Playground & Production Hardening

- [ ] AI Playground with mathematical derivation, step-by-step verification, and dynamic `VisualizationSpec` generator.
- [ ] Cross-module mastery tests and progress tracking.
- [ ] Performance optimizations, bundle analysis, and accessibility audit.
- [ ] Final end-to-end production verification.
