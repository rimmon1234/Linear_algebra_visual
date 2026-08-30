# TASKS.md

## How to Use This File

Work top-to-bottom. Do not start a later phase until the required previous phase is working and verified.

A phase may be split into smaller agent tasks.

---

# Phase 0 — Repository Foundation

- [x] Initialize Next.js + TypeScript project.
- [x] Configure linting/formatting.
- [x] Configure Tailwind and UI component system.
- [x] Configure testing tools.
- [x] Create documented directory architecture.
- [x] Add `AGENTS.md` and specification files.
- [x] Add CI verification pipeline.

**Exit condition:** project installs, builds, typechecks, and tests successfully. (VERIFIED)

# Phase 1 — Curriculum Foundation

- [x] Implement module registry.
- [x] Implement topic registry.
- [x] Implement topic schema validation.
- [x] Create Module I metadata.
- [x] Create initial topic content for one topic.
- [x] Implement generic module page.
- [x] Implement generic topic page.
- [x] Add topic navigation.

**Exit condition:** adding a topic requires configuration/content, not a new route component. (VERIFIED)

# Phase 2 — Visualization Foundation

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

**Exit condition:** a generic validated visualization spec can render a basic scene. (VERIFIED)

# Phase 3 — Matrix/Vector Math Foundation

- [ ] Implement vector operations.
- [ ] Implement matrix operations.
- [ ] Implement matrix × vector.
- [ ] Implement determinant.
- [ ] Implement inverse with numerical checks.
- [ ] Implement RREF/rank.
- [ ] Create comprehensive math tests.

**Exit condition:** canonical matrix/vector engine is independently tested.

# Phase 4 — First Complete Vertical Slice

Build one complete topic: **Matrix / Linear Transformation**.

- [ ] Topic content.
- [ ] Matrix editor.
- [ ] Vector editor.
- [ ] Matrix × vector calculation.
- [ ] 2D grid transformation.
- [ ] Animated identity → transformation transition.
- [ ] Reset.
- [ ] Guided experiment.
- [ ] Practice question.
- [ ] Unit tests.
- [ ] E2E test.
- [ ] Browser verification.

**Exit condition:** one student can learn, manipulate, and practice the concept end-to-end.

# Phase 5 — Module I Core

- [ ] Characteristic equations.
- [ ] Eigenvalues.
- [ ] Eigenvectors.
- [ ] Diagonalization.
- [ ] Symmetric matrices.
- [ ] Positive definite matrices.
- [ ] Similar matrices.
- [ ] Differential-equation visualization.
- [ ] SVD.
- [ ] Generalized inverse/pseudoinverse.

Each topic must be a complete vertical slice before moving to the next.

# Phase 6 — Module II

Build and verify each topic:

- [ ] Field.
- [ ] Vector spaces.
- [ ] Elementary properties.
- [ ] Subspaces.
- [ ] Linear sums.
- [ ] Spanning sets.
- [ ] Linear dependence/independence.
- [ ] Basis/dimension.
- [ ] Matrix/system applications.

# Phase 7 — Module III

- [ ] Inner product spaces.
- [ ] Norms.
- [ ] Orthogonality.
- [ ] Projections.
- [ ] Orthogonal complements.
- [ ] Orthogonal projections.
- [ ] Gram-Schmidt.
- [ ] Least squares.
- [ ] QR.

# Phase 8 — Module IV

- [ ] Linear transformations.
- [ ] Kernel/image.
- [ ] Rank-nullity.
- [ ] Matrix representation.
- [ ] Change of basis.
- [ ] Linear space of linear mappings.

# Phase 9 — Practice System

- [ ] Exercise schema.
- [ ] Hint system.
- [ ] Answer validation.
- [ ] Feedback UI.
- [ ] Topic-linked practice.
- [ ] Challenge mode.

# Phase 10 — AI Playground

- [ ] Question input.
- [ ] Classification.
- [ ] Math tool calling.
- [ ] Deterministic verification.
- [ ] Explanation generation.
- [ ] Visualization generation.
- [ ] Zod validation.
- [ ] Error/unsupported flow.
- [ ] Golden dataset.
- [ ] Rate limiting.

# Phase 11 — Persistence

- [ ] Supabase project integration.
- [ ] Auth.
- [ ] User profiles.
- [ ] Progress.
- [ ] Attempts.
- [ ] Saved visualizations.
- [ ] Saved Playground sessions.
- [ ] RLS.

# Phase 12 — Production Hardening

- [ ] Performance profiling.
- [ ] Mobile verification.
- [ ] Browser matrix.
- [ ] Accessibility audit.
- [ ] Error monitoring.
- [ ] Security review.
- [ ] Production environment validation.
- [ ] CI/CD verification.
