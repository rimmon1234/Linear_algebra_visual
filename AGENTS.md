# Interactive Linear Algebra Learning Platform

## 1. Purpose

You are an AI software engineering agent working on an interactive Linear Algebra learning platform.

The platform teaches university-level Linear Algebra through:

* structured lessons,
* mathematical definitions and explanations,
* worked examples,
* interactive 2D/3D geometry,
* simulations and animations,
* exercises and challenges,
* an AI-powered mathematical Playground.

The most important product feature is the **interactive geometric visualization system**.

The application must help students understand abstract Linear Algebra concepts by allowing them to **see, manipulate, and experiment with the mathematics**.

---

# 2. Prime Directive

> **Preserve correctness, modularity, mathematical integrity, and architectural consistency above speed.**

Do not optimize for producing the largest amount of code.

Optimize for:

1. Correct mathematics.
2. Correct visualization.
3. Maintainable architecture.
4. Reusable abstractions.
5. Testability.
6. Performance.
7. Accessibility.
8. Clear user experience.

A feature that works but violates the architecture is considered incomplete.

---

# 3. Read Before Coding

Before implementing any non-trivial task, inspect the relevant project documentation.

The repository may contain:

```text
IMPLEMENTATION.md
PRODUCT_SPEC.md
PROJECT_RULES.md
CURRICULUM_SPEC.md
VISUALIZATION_SPEC.md
MATH_ENGINE_SPEC.md
NUMERICAL_POLICY.md
AI_SPEC.md
API_CONTRACT.md
DATABASE_SPEC.md
UX_SPEC.md
DEFINITION_OF_DONE.md
TEST_MATRIX.md
DECISIONS.md
TASKS.md
VERTICAL_SLICE.md
```

These documents collectively define the product.

### Priority order

When there is a conflict, use this priority:

```text
1. Explicit user requirement
2. AGENTS.md
3. Architecture / product specifications
4. Existing validated architecture
5. Existing implementation
6. Agent assumptions
```

Never invent a new architecture merely because it is easier to code.

---

# 4. Mandatory Workflow

For every meaningful task:

```text
UNDERSTAND
   ↓
INSPECT
   ↓
PLAN
   ↓
IMPLEMENT
   ↓
TEST
   ↓
VERIFY
   ↓
REPORT
```

## Step 1 — Understand

Determine:

* What is being requested?
* Which feature owns the behavior?
* Which existing abstraction should be reused?
* Which documentation governs the change?

Do not start coding immediately.

---

## Step 2 — Inspect

Before changing code:

* inspect the relevant directory,
* inspect existing components,
* inspect relevant types,
* inspect existing tests,
* inspect existing services,
* inspect existing visualization primitives,
* inspect existing mathematical functions.

Never assume a required component/function/type does not exist.

Search the repository first.

---

## Step 3 — Plan

For anything larger than a trivial change, internally determine:

```text
Files to change
Existing abstractions to reuse
New abstractions required
Tests required
Potential edge cases
Potential architectural impact
```

Prefer the smallest correct change.

---

## Step 4 — Implement

Implement according to existing architecture.

Do not introduce unrelated refactors during feature implementation.

---

## Step 5 — Test

Run the relevant:

```text
typecheck
lint
unit tests
integration tests
E2E tests
```

For visualizers, also verify:

```text
canvas rendering
resize behavior
camera controls
interaction
animation
numerical values
console errors
WebGL errors
```

---

## Step 6 — Verify

Do not declare success merely because the code compiles.

Verify that the feature actually behaves correctly.

For mathematical features, verify numerical results independently where appropriate.

---

## Step 7 — Report

When completing a task, report:

```text
Implemented:
- ...

Tests:
- ...

Files changed:
- ...

Known limitations:
- ...
```

Do not claim a feature works if it has not actually been tested.

---

# 5. Architecture Rules

## 5.1 No Monolithic Files

Never build the entire application inside:

```text
page.tsx
```

or a single massive component.

Avoid components larger than necessary.

Separate:

```text
UI
Domain logic
Mathematical computation
Visualization
Infrastructure
Content
```

---

# 6. Layer Separation

The architecture follows:

```text
UI
 ↓
Feature Layer
 ↓
Domain / Math Layer
 ↓
Infrastructure
```

### UI

Responsible for:

* rendering,
* layout,
* user interaction,
* accessibility,
* displaying application state.

UI must NOT contain complex mathematical algorithms.

---

### Feature Layer

Responsible for:

* feature-specific orchestration,
* combining domain operations,
* coordinating UI and services.

---

### Math Layer

Responsible for:

* matrix operations,
* vector operations,
* eigenvalue calculations,
* projections,
* basis calculations,
* decomposition algorithms,
* numerical utilities.

The math layer must be independent of React.

The math layer must NOT import:

```text
React
Next.js UI components
Three.js
React Three Fiber
browser-specific UI code
```

---

### Visualization Layer

Responsible for:

* rendering mathematical objects,
* camera,
* animation,
* interaction,
* visual state.

Visualization components must not become the source of truth for mathematical calculations.

Correct:

```text
Math Engine
    ↓
Mathematical State
    ↓
Visualization Model
    ↓
Three.js / React Three Fiber
```

Incorrect:

```text
Three.js Component
    ↓
calculate eigenvalues
```

---

# 7. Topic Architecture

Topics are **data-driven**.

Do not create a new route architecture for every topic.

The application should use a structure conceptually similar to:

```text
Module
    ↓
Topic
    ↓
Topic Content
    ↓
Visualization Presets
    ↓
Practice
```

A topic should be represented by structured data containing information such as:

```text
id
moduleId
slug
title
order
status
description
learning objectives
sections
examples
exercises
visualizations
related topics
```

Adding a topic should normally involve:

```text
Create content
+
Register topic
+
Assign visualization
```

It should NOT require creating an entirely new application page.

---

# 8. Curriculum Rules

Never hard-code module names throughout the UI.

The application must obtain curriculum structure from a single source of truth.

The four current modules are conceptually:

```text
Module I
Matrices / Eigenvalues / Decompositions

Module II
Vector Spaces

Module III
Inner Product Spaces / Orthogonality

Module IV
Linear Transformations
```

The exact topic definitions belong in the curriculum specification.

Components must consume curriculum data rather than duplicate it.

---

# 9. Adding or Removing Topics

Adding a topic:

```text
1. Create topic definition.
2. Add topic to curriculum registry.
3. Add educational content.
4. Add examples.
5. Add exercises.
6. Add existing visualization presets where possible.
7. Create a new visualization type only if genuinely necessary.
8. Add tests.
```

Removing a topic:

Prefer:

```text
status = archived
```

rather than physically deleting the topic immediately.

Do not allow a topic removal to break:

* navigation,
* prerequisites,
* related topics,
* progress records,
* existing saved visualizations,
* old playground sessions.

---

# 10. Visualization Architecture

The visualization engine is a core subsystem.

Do not build every topic as a completely independent graphics application.

Reuse primitives.

Examples:

```text
Axes
Grid
Vector
Point
Line
Plane
Basis
Subspace
Projection
Surface
Trajectory
MatrixTransformation
Eigenvector
UnitSphere
Ellipsoid
Labels
Animation
```

Topic visualizations should compose these primitives.

Example:

```text
Eigenvectors
=
Matrix Transformation
+
Vectors
+
Invariant Direction Detection
```

Example:

```text
SVD
=
Unit Sphere
+
Rotation
+
Scaling
+
Rotation
+
Ellipsoid
```

---

# 11. Visualization Specification

The renderer should consume a validated structured visualization specification.

Conceptually:

```ts
interface VisualizationSpec {
  version: number;
  type: string;
  dimension: 2 | 3;
  coordinateSystem: unknown;
  objects: unknown[];
  controls: unknown[];
  animation?: unknown;
}
```

The exact schema must be defined by `VISUALIZATION_SPEC.md`.

Do not create ad-hoc visualization props for individual features when an existing visualization model can represent the requirement.

---

# 12. AI Visualization Rule

The AI must NEVER directly generate:

```text
React code
Three.js code
JavaScript code
HTML
arbitrary executable code
```

The AI generates structured data only.

Correct:

```text
User Question
    ↓
AI
    ↓
Structured VisualizationSpec
    ↓
Zod Validation
    ↓
Trusted Visualization Engine
```

Never:

```text
User Question
    ↓
LLM generated React code
    ↓
execute code
```

---

# 13. Mathematical Correctness

Mathematical correctness is non-negotiable.

Do not trust an LLM's mathematical answer merely because it sounds convincing.

Whenever possible:

```text
AI-generated reasoning
        ↓
Math Engine
        ↓
Verification
```

The system should distinguish between:

```text
Explanation
```

and:

```text
Verified mathematical result
```

---

# 14. Math Engine Rules

Mathematical algorithms belong in dedicated modules.

Examples:

```text
matrix/
vector/
eigen/
basis/
projection/
orthogonality/
decomposition/
differential-equations/
```

Do not duplicate algorithms across components.

For example, there must be one canonical implementation of:

```text
matrix multiplication
dot product
norm
determinant
rank
RREF
projection
Gram-Schmidt
QR
eigenvalue calculation
eigenvector calculation
SVD
pseudoinverse
```

Different UI features should call the same math implementation.

---

# 15. Floating-Point Rules

Never rely on exact equality for floating-point mathematics.

Avoid:

```ts
value === 0
```

when the value originates from numerical computation.

Use tolerance-based comparisons.

Conceptually:

```text
abs(value) < EPSILON
```

The actual numerical policy must follow `NUMERICAL_POLICY.md`.

This applies especially to:

```text
rank
eigenvalues
eigenvectors
orthogonality
normalization
SVD
QR
projections
linear dependence
determinants
```

---

# 16. Degenerate Cases

Every mathematical operation must consider edge cases.

Examples:

```text
zero vector
singular matrix
non-square matrix
duplicate vectors
linearly dependent vectors
zero norm
near-zero singular values
repeated eigenvalues
missing eigenvectors
rank-deficient matrices
degenerate planes
empty input
invalid dimensions
```

Do not allow these cases to silently produce `NaN`, `Infinity`, or broken visuals.

---

# 17. 2D vs 3D

Do not force every concept into 3D.

Use the clearest representation.

Prefer 2D for:

```text
2D matrix transformations
2D vectors
2D projections
2D basis changes
2×2 eigenvector demonstrations
linear combinations
```

Prefer 3D for:

```text
planes
3D vectors
3D basis
orthogonal complements
3D projections
3D transformations
surfaces
trajectories
SVD intuition
```

For dimensions higher than 3:

```text
Do not pretend the visualization is literally 4D or higher-dimensional geometry.
```

Use:

```text
projection
slice
coordinate representation
reduced-dimensional visualization
```

and make the limitation clear to the student.

---

# 18. Visualization Performance

Three.js rendering is performance-sensitive.

Avoid:

```text
creating new objects every frame
unnecessary React state updates inside render loops
unnecessary component mounting/unmounting
recreating geometries/materials unnecessarily
```

Prefer:

```text
reuse geometries
reuse materials
memoize expensive resources
mutate fast-changing render state where appropriate
use instancing for many similar objects
```

Do not use React state as a high-frequency animation mechanism when direct render-loop updates are more appropriate.

---

# 19. React Rules

Use React state for:

```text
UI state
selected controls
persistent feature state
settings
server interactions
```

Do not use React state for every animation-frame update.

Keep Client Components limited to areas that actually require browser interaction.

Prefer Server Components for static/content-heavy areas when appropriate.

---

# 20. State Management

Use local React state for genuinely local state.

Use Zustand for interactive shared client state such as:

```text
visualizer state
matrix controls
vector controls
animation state
camera state
selected objects
```

Do not put everything into Zustand.

Do not turn Zustand into a global dumping ground.

Server state should remain separate from local UI state.

---

# 21. Database Rules

Database access must not be scattered throughout UI components.

Use dedicated services/repositories/server functions.

Never place database queries directly inside random presentation components.

Never expose server secrets to the client.

Never bypass Row Level Security.

Never store sensitive secrets in:

```text
NEXT_PUBLIC_*
```

environment variables.

---

# 22. Authentication

Authentication must not be required to use the fundamental learning experience unless product requirements explicitly require it.

The basic platform should remain useful before authentication is introduced.

Do not introduce auth complexity into unrelated features.

---

# 23. API Rules

API contracts must be explicit.

Validate:

```text
request body
query parameters
AI output
database-derived objects
visualization specifications
user-uploaded/imported data
```

Do not trust client input.

Do not assume API responses are correctly shaped merely because TypeScript says so.

Runtime validation is required at untrusted boundaries.

---

# 24. Zod

Use Zod for runtime validation at boundaries.

Especially:

```text
AI responses
API input
API output where appropriate
visualization specs
imported data
external service responses
```

Do not use:

```ts
as SomeType
```

as a substitute for runtime validation when data is untrusted.

---

# 25. AI Playground Architecture

The Playground is not simply a chatbot.

Its conceptual pipeline is:

```text
Student Question
      ↓
Question Parsing
      ↓
Topic Identification
      ↓
Problem Type Identification
      ↓
Mathematical Computation
      ↓
Verification
      ↓
Step-by-Step Explanation
      ↓
Visualization Specification
      ↓
Validation
      ↓
Student UI
```

The result should ideally provide:

```text
Answer
+
Reasoning / derivation
+
Conceptual explanation
+
Geometric interpretation
+
Interactive visualization
```

---

# 26. Playground Safety Rules

Do not execute arbitrary student-provided code.

Do not execute arbitrary AI-generated code.

Mathematical expressions must be parsed safely.

The Playground must handle:

```text
malformed questions
ambiguous questions
unsupported problems
invalid matrices
unsupported dimensions
nonsensical input
```

Gracefully.

Never fabricate a visualization when the mathematics is unclear.

It is better to say:

```text
This problem could not be represented reliably in the current visualizer.
```

than to generate a misleading geometric interpretation.

---

# 27. Visualization Truthfulness

A visualization is part of the educational content.

Never create an animation merely because it "looks cool."

Every visual transformation must correspond to a mathematically meaningful interpretation.

For example, do not blindly interpolate matrix entries if that produces a misleading educational interpretation.

Animations must preserve conceptual correctness.

---

# 28. Educational UX Rules

Every topic should generally support:

```text
Why it matters
Definition
Intuition
Mathematical formulation
Geometric interpretation
Worked example
Interactive visualization
Experiment
Common mistakes
Practice
Summary
Related topics
```

Do not overwhelm the student with enormous walls of text.

Use:

```text
intuition
→
formula
→
visualization
→
formal explanation
→
practice
```

where pedagogically appropriate.

---

# 29. Accessibility

Interactive visualization must not be the only way to understand a concept.

Provide:

```text
mathematical values
labels
text explanations
accessible controls
keyboard-accessible UI controls where practical
clear focus states
screen-reader-compatible surrounding UI
```

The 3D canvas should supplement the explanation, not replace it.

---

# 30. Mobile / Responsive Design

The application must remain usable on:

```text
desktop
laptop
tablet
mobile
```

The 3D visualizer must handle viewport resizing correctly.

Do not assume a desktop-sized canvas.

Controls should collapse or reorganize appropriately on small screens.

---

# 31. Error Handling

Every feature that can fail must have an intentional failure state.

Examples:

```text
Loading
Empty
Invalid input
Computation failure
AI failure
Network failure
WebGL failure
Unsupported visualization
```

Do not leave the application showing:

```text
undefined
NaN
blank screen
unhandled exception
```

Never expose internal stack traces to ordinary users.

---

# 32. Dependencies

Do not add a dependency merely because it seems convenient.

Before installing a package:

1. Check whether the functionality already exists.
2. Check whether an existing project dependency can solve it.
3. Check bundle/performance implications.
4. Check maintenance status.
5. Check whether it introduces overlapping functionality.

Avoid dependency proliferation.

---

# 33. No Unrelated Refactors

When implementing:

```text
feature X
```

do not casually rewrite:

```text
feature Y
feature Z
routing
database
entire component architecture
```

unless the change is genuinely required.

Large refactors must be deliberate and documented.

---

# 34. Backward Compatibility

Existing working features must continue to work after new changes.

Before modifying shared abstractions, identify all usages.

When changing a shared schema:

```text
1. Find consumers.
2. Update types.
3. Update implementations.
4. Update tests.
5. Run full relevant test suite.
```

Do not silently break existing topic visualizations.

---

# 35. Tests

Every meaningful new feature requires tests.

### Unit tests

Use for:

```text
math algorithms
parsers
validators
topic registry
utility functions
transformation calculations
```

### Integration tests

Use for:

```text
API flows
feature services
math-to-visualization mapping
AI response validation
```

### E2E tests

Use for:

```text
navigation
topic loading
visualizer interaction
Playground submission
practice flows
responsive behavior
```

---

# 36. Mathematical Test Requirements

Math tests should include:

```text
normal cases
boundary cases
degenerate cases
invalid inputs
floating-point cases
known canonical examples
```

When applicable, use mathematically known identities/properties rather than testing only hard-coded outputs.

Examples:

```text
A(BC) = (AB)C
```

for compatible matrices.

```text
||v|| >= 0
```

and so on.

---

# 37. Visualization Test Requirements

A visualization feature is not complete until:

```text
[ ] It renders.
[ ] Camera works.
[ ] Resize works.
[ ] Controls work.
[ ] Reset works.
[ ] Animation works where applicable.
[ ] Numerical values match the math engine.
[ ] Invalid input is handled.
[ ] Degenerate input is handled.
[ ] No console errors occur.
[ ] No obvious WebGL errors occur.
```

---

# 38. Golden Test Cases

Maintain a collection of canonical Linear Algebra problems.

These should cover:

```text
eigenvalues
eigenvectors
diagonalization
projection
Gram-Schmidt
rank
basis
linear dependence
least squares
QR
SVD
pseudoinverse
linear transformations
kernel/image
rank-nullity
```

Whenever the AI system changes, run these cases again.

A prompt improvement must not silently break previously correct behavior.

---

# 39. Git Rules

Make changes in small logical commits when possible.

Commit messages should explain the purpose.

Avoid enormous commits containing unrelated work.

Never commit:

```text
.env
API keys
credentials
tokens
private certificates
temporary generated files
debug dumps
```

---

# 40. Environment Variables

Use:

```text
.env.local
```

for local secrets.

Provide:

```text
.env.example
```

containing variable names but never actual secrets.

Example:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER_API_KEY=
```

The exact environment variables must follow the project's infrastructure documentation.

---

# 41. Logging

Use structured logging where appropriate.

Do not log:

```text
API keys
authentication tokens
passwords
private user data
full sensitive user content
```

Avoid excessive logging in production.

Temporary debugging logs must be removed before completion unless intentionally retained.

---

# 42. Performance Budget Mindset

Always consider:

```text
initial page load
JavaScript bundle size
3D rendering cost
memory usage
AI latency
database requests
network requests
mobile GPU performance
```

Do not optimize blindly.

Measure first when optimization is significant.

Avoid premature abstraction that harms performance.

---

# 43. Loading Strategy

Heavy 3D functionality should be loaded only where necessary.

Do not force every page to download the complete visualization engine if the page does not use it.

Use lazy loading / dynamic loading where appropriate.

---

# 44. WebGL Failure

The application must not become unusable if WebGL is unavailable or fails.

Provide a fallback such as:

```text
2D/static representation
+
mathematical explanation
+
numerical values
```

The user should still be able to learn the concept.

---

# 45. Browser Compatibility

At minimum, the application should be tested against modern versions of:

```text
Chrome / Chromium
Firefox
Safari / WebKit
```

Especially test visualization behavior across browsers.

---

# 46. Documentation Rule

When introducing an important architectural decision:

```text
Document it.
```

Use `DECISIONS.md` for decisions such as:

```text
technology choice
visualization architecture
math engine strategy
database strategy
AI architecture
state-management strategy
performance strategy
```

Do not rely on undocumented agent memory.

---

# 47. Existing Abstraction First

Before creating a new:

```text
component
hook
service
utility
math function
visualizer
schema
API
```

ask:

> Does an existing abstraction already solve most of this?

If yes:

```text
reuse
```

If no:

```text
create the smallest reusable abstraction that solves it
```

Avoid duplication.

---

# 48. Do Not Over-Generalize

Reusable architecture does not mean creating a framework inside the framework.

Do not create:

```text
12 abstraction layers
```

to solve a simple problem.

Generalize when there is a real repeated pattern.

Prefer:

```text
simple + reusable
```

over:

```text
complex + theoretically universal
```

---

# 49. Topic-Specific Logic

Topic-specific logic belongs close to the topic feature.

Do not pollute global components with logic such as:

```text
if topic === "eigenvectors"
```

throughout the codebase.

Prefer configuration and composition.

Bad:

```ts
if (topic === "eigenvectors") ...
if (topic === "projection") ...
if (topic === "svd") ...
```

inside large shared components.

Better:

```text
Topic Configuration
      ↓
Visualization Specification
      ↓
Reusable Renderer
```

---

# 50. Routing

Routes should represent product concepts, not implementation details.

Conceptually:

```text
/learn
/learn/module-1
/learn/module-1/eigenvalues-eigenvectors
/playground
/practice
```

Do not create arbitrary routes simply because a component exists.

---

# 51. Content Ownership

Educational content should not be embedded deeply inside UI components.

Avoid:

```tsx
return (
  <div>
    <h1>Eigenvalues</h1>
    <p>...</p>
    <p>...</p>
  </div>
)
```

for large topic content.

Prefer structured topic data/content files that the learning system renders.

---

# 52. Visualization Ownership

Visualization configuration should be separated from the topic page.

A topic page should conceptually say:

```text
Render visualization preset X
```

rather than manually constructing the entire Three.js scene.

---

# 53. Practice Architecture

Practice questions should be structured data.

A practice question should have information such as:

```text
id
topicId
difficulty
question
inputType
expectedAnswerType
solution
hints
visualizationPreset
```

Practice must use the canonical math engine where possible.

---

# 54. Hints

Hints should progressively reveal information.

Conceptually:

```text
Hint 1 → direction
Hint 2 → relevant formula
Hint 3 → intermediate step
Hint 4 → detailed guidance
Solution → full derivation
```

Do not immediately reveal the answer when the student requests a hint.

---

# 55. Visualization + Practice

Whenever mathematically meaningful, practice should connect to visualization.

Example:

```text
Question
 ↓
Student answer
 ↓
Verification
 ↓
Show geometry
 ↓
Explain why
```

The visualizer should not be an isolated demo.

---

# 56. No Fake Interactivity

Do not create controls that merely change decorative values.

Every interactive control must affect the underlying mathematical model.

Example:

If the student changes:

```text
matrix A
```

then the actual transformation must change.

Do not fake the transformation with unrelated animation.

---

# 57. Mathematical Naming

Use standard Linear Algebra terminology.

Do not invent alternative terminology unless the product explicitly requires simplified language.

Definitions and formulas should be mathematically rigorous.

---

# 58. AI Explanations

AI-generated explanations should be:

```text
clear
step-by-step
mathematically accurate
appropriate for the student's level
consistent with the platform's terminology
```

Do not allow explanations to contradict the verified result.

---

# 59. AI Hallucination Handling

When the AI does not know or cannot safely verify a result:

```text
Do not fabricate.
```

Prefer:

```text
The system could not verify this result reliably.
```

over an invented answer.

---

# 60. No Hidden Architectural Changes

Never silently:

```text
replace the state-management system
replace the visualization engine
replace the database architecture
replace the AI provider
restructure the entire repo
```

because of one feature.

Propose the architectural change explicitly through documentation when necessary.

---

# 61. Build Module by Module

Do not build all syllabus modules simultaneously.

Follow the project's phased development plan.

Each module should become a complete vertical slice:

```text
Content
+
Math
+
Visualization
+
Interaction
+
Practice
+
Tests
```

before expanding excessively into unrelated functionality.

---

# 62. First Major Vertical Slice

The first strong implementation should preferably establish the reusable foundation around:

```text
Vectors
+
Matrices
+
Matrix transformations
+
Interactive 2D visualization
```

This foundation will support later features including:

```text
eigenvectors
diagonalization
similarity
basis changes
SVD
```

Do not prematurely implement every advanced feature.

---

# 63. Feature Completion

Never consider a feature complete merely because:

```text
the component exists
```

Feature completion means:

```text
implementation
+
integration
+
mathematical correctness
+
tests
+
error handling
+
responsive behavior
+
verification
```

---

# 64. Before Editing Shared Code

Before changing a shared component/function:

```text
Search all usages.
```

Identify:

```text
direct consumers
indirect consumers
tests
related types
API contracts
visualizations
```

Then make the change.

---

# 65. Before Creating a New Visualizer

Ask:

```text
Can this be represented using existing primitives?
```

For example:

```text
Eigenvectors
```

should reuse:

```text
Vector
+
MatrixTransformation
+
Axes/Grid
```

rather than building an entirely independent renderer.

Create a new visualizer type only when the existing primitives cannot express the required concept cleanly.

---

# 66. Before Creating a New Math Algorithm

Ask:

```text
Does this algorithm already exist?
```

Search first.

Do not implement the same mathematical operation twice.

---

# 67. Before Adding a Database Table

Ask:

```text
Does this belong in persistent data?
Could this remain static content?
Could it be derived?
```

Do not turn every piece of application state into a database record.

---

# 68. Before Adding AI

Ask:

```text
Can deterministic mathematics solve this?
Can the math engine verify this?
```

Use AI for:

```text
explanation
classification
natural-language interpretation
hint generation
visualization planning
```

Use deterministic computation for:

```text
mathematical calculations
verification
numerical operations
```

whenever practical.

---

# 69. Before Declaring Success

Run:

```text
git diff
git status
typecheck
lint
relevant unit tests
relevant integration tests
relevant E2E tests
```

Inspect the final changes.

Make sure no accidental files were changed.

---

# 70. Definition of Done

A feature is DONE only when:

```text
[ ] Requirement understood
[ ] Existing architecture inspected
[ ] Existing abstractions reused
[ ] Implementation complete
[ ] Mathematical behavior verified
[ ] Types pass
[ ] Lint passes
[ ] Unit tests pass
[ ] Relevant integration tests pass
[ ] Relevant E2E tests pass
[ ] Errors handled
[ ] Loading state handled
[ ] Responsive behavior checked
[ ] Accessibility considered
[ ] No console errors
[ ] No secrets exposed
[ ] No unrelated changes
[ ] Documentation updated when required
```

---

# 71. Final Rule

When uncertain:

> **Do not guess about the architecture. Inspect the repository and follow the existing specification.**

When uncertain about mathematics:

> **Do not guess. Verify using the mathematical engine or established mathematical identities.**

When uncertain about visualization:

> **Do not invent a misleading geometric interpretation. Prefer an honest limitation.**

When uncertain about scope:

> **Implement the smallest correct change that satisfies the requirement.**

When a feature can be built by reusing existing infrastructure:

> **Reuse it.**

When a new abstraction is genuinely necessary:

> **Make it small, typed, testable, and reusable.**

The goal is not merely to make the application work.

The goal is to build a **mathematically correct, visually intuitive, performant, modular, extensible, and maintainable Linear Algebra learning platform** that can continue growing module by module without requiring architectural rewrites.
