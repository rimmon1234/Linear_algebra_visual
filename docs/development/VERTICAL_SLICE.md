# VERTICAL_SLICE.md

## Purpose

The platform is engineered vertically: complete each topic from curriculum content through mathematical computation, geometric visualization, interactive UI controls, testing, and responsive verification before moving to the next topic.

---

## Academic Order vs. Implementation Order (ADR-016)

The project strictly preserves the academic syllabus ordering for students, while adopting an optimized engineering sequence:

- **Academic Syllabus Order:** Module I $\to$ Module II $\to$ Module III $\to$ Module IV
- **Development / Implementation Order:** Foundation $\to$ Visualization Foundation $\to$ Matrix Transformation Foundation $\to$ **Module I** $\to$ **Module III** $\to$ **Module IV** $\to$ **Module II** $\to$ **Final Integration**

---

## 1. First Slice: Matrix Transformation Foundation — COMPLETE & VERIFIED

The foundational vertical slice is **2D Matrix Transformation**, which establishes the reusable mathematical and visualization infrastructure for all subsequent modules.

### Capabilities Implemented & Verified
- **Content:** Complete 9-section topic lesson authored in `content/modules/module-4/index.ts`.
- **Math Engine:** Pure vector and matrix modules, $A(t) = (1-t)I + tA$ linear interpolation with floating-point tolerance safety and `Result<T, MathError>` error handling.
- **Visualization:** Fixed reference Cartesian grid & axes at $(0, 0)$ separated cleanly from the dynamic transformation layer ($Ae_1, Ae_2, Av$, unit-square parallelogram, and linearity demonstration).
- **Controls & UX:** 2D matrix editor, preset selector, custom vector input, numerical breakdown panel, determinant card, guided experiments, scrubber animation, and independent **Fit Scene** and **Reset Camera** controls.
- **Verification:** 61 unit tests, 11 Playwright E2E tests, clean browser console, responsive viewports (1280x800, 768x1024, 390x844).

---

## 2. Next Target: Module I (Matrices, Eigenvalues and Decompositions)

Following the implementation order, the next milestone is implementing all 9 topics of **Module I**:

1. **Characteristic Equations:** $\det(A - \lambda I) = 0$ polynomial curves and root-finding.
2. **Eigenvalues and Eigenvectors:** Invariant directions $(Av = \lambda v)$, invariant lines, algebraic vs geometric multiplicity.
3. **Diagonalization:** $A = PDP^{-1}$ decomposition and change of basis.
4. **Applications to Differential Equations:** $\dot{x} = Ax$ continuous dynamical systems, phase portraits, and stability.
5. **Symmetric Matrices:** Spectral Theorem ($A = Q\Lambda Q^T$), orthogonal eigenvectors, and principal axis theorem.
6. **Positive Definite Matrices:** Quadratic forms $q(x) = x^T A x$, 3D paraboloids, and energy surfaces.
7. **Similar Matrices:** $B = P^{-1}AP$ matrix similarity and invariant spectrum.
8. **Singular Value Decomposition (SVD):** Geometric SVD pipeline ($V^T \to \Sigma \to U$) transforming unit circles into ellipsoids.
9. **Generalized Inverses:** Moore-Penrose pseudoinverse $A^+$ and least-squares minimum-norm solutions.

---

## 3. Subsequent Modules

- **Module III (Inner Product Spaces & Orthogonality):** Projections, Gram-Schmidt, Least Squares, QR Decomposition.
- **Module IV (Linear Transformations):** Kernels, Images, Rank-Nullity, Matrix Representations, Change of Basis (reusing Phase 3 foundation).
- **Module II (Vector Spaces):** Subspaces, Span, Linear Independence, Basis & Dimension, Four Fundamental Subspaces.
- **Final Integration:** AI Mathematical Playground, Mastery Tests, Performance Hardening.
