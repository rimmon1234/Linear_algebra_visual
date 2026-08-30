# DEFINITION_OF_DONE.md

A task is complete only when the applicable requirements below are satisfied.

## 1. General

- [ ] Requirement is clearly satisfied.
- [ ] Existing architecture was inspected first.
- [ ] Existing abstractions were reused where appropriate.
- [ ] No unrelated feature was modified unnecessarily.
- [ ] TypeScript/typecheck passes.
- [ ] Lint passes.
- [ ] Relevant unit tests pass.
- [ ] Relevant integration tests pass.
- [ ] Relevant E2E tests pass.
- [ ] Loading state exists where needed.
- [ ] Error state exists where needed.
- [ ] Responsive behavior considered.
- [ ] Accessibility considered.
- [ ] No new console errors.
- [ ] No secrets exposed.
- [ ] Documentation updated when architecture/contracts changed.

## 2. Mathematical Feature

- [ ] Canonical math engine is used.
- [ ] Input dimensions are validated.
- [ ] Floating-point tolerances follow `NUMERICAL_POLICY.md`.
- [ ] Degenerate cases are handled.
- [ ] Results have unit tests.
- [ ] Known examples have been verified.

## 3. Visualization Feature

- [ ] Uses existing primitives where appropriate.
- [ ] VisualizationSpec is validated.
- [ ] Rendering matches mathematical state.
- [ ] Camera works.
- [ ] Resize works.
- [ ] Relevant controls work.
- [ ] Reset works.
- [ ] Animation works where applicable.
- [ ] Numeric labels agree with math engine.
- [ ] Invalid input does not break rendering.
- [ ] Degenerate geometry is handled.
- [ ] WebGL fallback/error state exists where applicable.
- [ ] No obvious frame-rate regression was introduced.

## 4. AI Feature

- [ ] Prompt is documented/versioned.
- [ ] Structured output is validated.
- [ ] Deterministic computation is used where practical.
- [ ] AI failure is handled.
- [ ] Unsupported problems are handled honestly.
- [ ] No arbitrary model-generated code is executed.
- [ ] Golden tests updated where necessary.

## 5. Database Feature

- [ ] Migration created.
- [ ] RLS policy considered.
- [ ] User ownership enforced where applicable.
- [ ] No secrets in client code.
- [ ] Relevant API tests exist.

## 6. Before Final Report

Run the project's configured verification commands and inspect `git diff`/`git status` for accidental changes.
