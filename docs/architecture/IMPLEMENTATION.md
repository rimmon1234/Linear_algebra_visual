# Interactive Linear Algebra Platform — Implementation Plan

## 0. Product Goal

Build an interactive Linear Algebra learning platform where students can:

1. Learn each syllabus topic through clear definitions, intuition, equations, worked examples, and practice.
2. **See the mathematics geometrically** through an interactive 2D/3D visualizer.
3. Manipulate matrices, vectors, bases, planes, projections, transformations, etc. and immediately see the result.
4. Paste a personal question into a Playground and receive:
   - a mathematically correct solution,
   - a step-by-step explanation,
   - a conceptual explanation,
   - a generated visualization specification that opens in the same visualizer.
5. Add, reorder, disable, or remove topics later without rewriting the application.

The central product principle is:

> **Every important abstract concept should be connected to something the student can see and manipulate.**

---

# 1. Non-Negotiable Architecture Decisions

These decisions should be made before building the UI.

### 1.1 Do NOT build one giant application file

Avoid a structure such as:

```text
page.tsx
  ├── Eigenvalues
  ├── SVD
  ├── Gram Schmidt
  ├── Projections
  ├── QR
  ├── Rank Nullity
  └── everything else
```

Instead, separate the platform into:

```text
Content
   ↓
Topic Registry
   ↓
Learning Page
   ↓
Visualization Specification
   ↓
Reusable Visualization Engine
```

### 1.2 Topics must be configuration/data driven

A topic should not require a new React page just because it is a new syllabus item.

A topic should have:

```text
id
module
slug
title
order
learning objectives
content sections
examples
practice problems
visualization presets
related topics
status
```

### 1.3 Visualization code must be reusable

Do not create:

```text
EigenvectorVisualizer.tsx
EigenvalueVisualizer.tsx
DiagonalizationVisualizer.tsx
MatrixTransformationVisualizer.tsx
```

as completely independent rendering systems.

Instead create reusable primitives:

```text
Scene
Axes
Grid
Vector
Vectors
Plane
Line
Point
Basis
MatrixTransform
LinearTransformation
Projection
Subspace
Surface
Trajectory
Label
Arrow
AnimationController
```

Then compose them into topic-specific scenes.

### 1.4 Mathematics must be separated from rendering

The mathematical engine must never depend on React or Three.js.

Correct:

```text
math engine
     ↓
visualization model
     ↓
React / Three.js renderer
```

Incorrect:

```text
Three.js component calculates eigenvalues
```

This separation will make the platform much easier to test and extend.

### 1.5 AI must generate structured visualization data, not frontend code

Never ask the LLM to return arbitrary React/Three.js code.

Instead, the AI should return a validated object such as:

```json
{
  "visualizationType": "linear-transformation",
  "dimension": 2,
  "matrix": [[2, 1], [0, 1]],
  "vectors": [[1, 2]],
  "showGrid": true,
  "showAxes": true,
  "animate": true
}
```

The application validates that object and renders it using trusted visualizer components.

---

# 2. Recommended Tech Stack

## Frontend / Full-stack framework

### Next.js + React + TypeScript

Use the Next.js App Router.

Why:

- full-stack React application architecture,
- Server Components for content-heavy pages,
- Client Components only where interaction is required,
- built-in routing,
- good deployment path on Vercel,
- easy API/server functionality.

Official documentation: https://nextjs.org/docs

Reference: Next.js describes itself as a React framework for building full-stack web applications and documents the App Router as its newer router. citeturn113693search1

---

## 3D / Graphics

### Three.js + React Three Fiber

Recommended combination:

```text
Three.js
   ↓
React Three Fiber
   ↓
Drei helpers
```

Use Three.js for the actual 3D rendering engine and React Three Fiber for the React integration.

Use Drei for common helpers where appropriate.

The 3D layer should handle:

- coordinate systems,
- vectors,
- arrows,
- planes,
- grids,
- points,
- lines,
- surfaces,
- matrix transformations,
- camera controls,
- animation.

### Important performance rule

Do not treat the Three.js render loop like normal React rendering.

Keep per-frame updates inside the render loop and avoid unnecessary React state updates. Reuse geometries/materials and use instancing for many similar objects.

React Three Fiber's own performance guidance specifically warns about repeatedly creating objects, mounting/unmounting expensive scene objects, setting state inside render loops, and recommends reusing resources and using mutation for fast updates. citeturn722666search3

---

## Styling

### Tailwind CSS

Use Tailwind for application UI, layout, panels, controls, cards, navigation, responsive design, etc.

Do not use Tailwind to control objects inside the WebGL canvas; those are handled by Three.js.

Tailwind generates static CSS from discovered class usage and has no runtime styling engine for ordinary utility classes. citeturn113693search5

---

## Component system

### shadcn/ui

Use accessible reusable primitives for:

- buttons,
- dialogs,
- tabs,
- dropdowns,
- sliders,
- tooltips,
- command menus,
- cards,
- sheets,
- inputs.

Keep visual identity/custom branding in your own design layer.

---

## Client state

### Zustand

Use Zustand for interactive client-side state, especially visualizer state.

Examples:

```text
camera state
scene state
selected vector
matrix controls
animation state
visualization settings
playground state
```

Do NOT put all UI/server data into Zustand.

---

## Server state / async data

### TanStack Query

Use TanStack Query for asynchronous server state where it provides value:

```text
saved playgrounds
progress
practice questions
user-specific data
AI requests
remote topic data
```

TanStack Query provides caching, refetching, synchronization, query invalidation, mutations, and cancellation for asynchronous server state. citeturn722666search4turn722666search11

Do not use it for every local interaction.

---

## Database / Authentication / Storage

### Supabase

Use:

```text
PostgreSQL
Supabase Auth
Supabase Storage
Row Level Security
```

Supabase provides Postgres as the database foundation and integrates Auth, Storage, Realtime and other services. citeturn113693search0turn113693search2

Use Storage for user-uploaded files or larger assets rather than storing binary content directly in Postgres. Supabase documents Storage as the file/object storage layer with access control and CDN capabilities. citeturn113693search4turn113693search12

Authentication can be added after the core learning experience works. Do not block the first visualization milestone on auth.

---

## Validation

### Zod

Use Zod for runtime validation at boundaries:

- API request bodies,
- AI responses,
- visualization specifications,
- database-to-application boundaries,
- imported problem data.

Zod provides runtime schemas and TypeScript inference, making it suitable for validating structured data coming from untrusted sources. citeturn113693search8turn113693search10

---

## Mathematics

### Initial recommendation: TypeScript-first math engine

Start with JavaScript/TypeScript mathematics for interactive operations:

```text
matrix multiplication
vector operations
norms
inner products
projections
basis operations
rank
determinant
row reduction
simple eigenvalue/eigenvector operations
```

Use a mature JS math library such as Math.js where it fits, rather than reimplementing generic matrix operations from scratch. Math.js supports dense/sparse matrices and matrix manipulation. citeturn722666search13

For advanced or numerically sensitive functionality, introduce a separate computation service later rather than making the browser responsible for everything.

Possible second-stage service:

```text
Python
NumPy
SciPy
SymPy
```

This should be added when the product actually needs symbolic mathematics, higher-dimensional numerical computation, or advanced verification—not as a requirement for the first milestone.

---

## AI

### Vercel AI SDK

Use the Vercel AI SDK as the application integration layer for AI streaming, structured outputs and tool orchestration.

The AI layer should have explicit schemas and controlled tools rather than giving the model unrestricted access to the application.

Recommended AI pipeline:

```text
Student question
      ↓
Question classifier
      ↓
Topic identification
      ↓
Math computation / verification
      ↓
Explanation generation
      ↓
Visualization specification generation
      ↓
Zod validation
      ↓
Visualizer
```

---

## Testing

### Vitest

Unit-test:

- math engine,
- parsers,
- visualization-spec validation,
- topic registry,
- utility functions.

### Playwright

End-to-end test:

- navigation,
- topic loading,
- visualizer interaction,
- playground submission,
- responsive layouts,
- basic accessibility flows.

Playwright supports Chromium, Firefox and WebKit and is designed for cross-browser end-to-end testing. citeturn113693search6

---

## Deployment

### Vercel

Recommended initial deployment platform:

```text
GitHub
  ↓
Vercel
  ↓
Next.js application
  ↓
Supabase
```

Keep the architecture portable enough that Vercel is not a hard dependency.

---

# 3. High-Level System Architecture

```text
                         ┌─────────────────────┐
                         │      Next.js        │
                         │   App Router       │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼────────────────────┐
              │                     │                    │
              ▼                     ▼                    ▼
        Learning UI            Playground UI       Progress UI
              │                     │                    │
              └─────────────────────┼────────────────────┘
                                    │
                          ┌─────────▼─────────┐
                          │   Application     │
                          │     Services      │
                          └─────────┬─────────┘
                                    │
             ┌──────────────────────┼────────────────────────┐
             │                      │                        │
             ▼                      ▼                        ▼
       Content Service         Math Engine              AI Service
             │                      │                        │
             │                      │                        │
             └──────────────┬───────┴───────────────┬────────┘
                            │                       │
                            ▼                       ▼
                   Visualization Model      Structured AI Output
                            │                       │
                            └──────────┬────────────┘
                                       ▼
                              Visualization Engine
                                       │
                                       ▼
                               Three.js / R3F
```

---

# 4. Repository Structure

Recommended project structure:

```text
linear-algebra-platform/
│
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   └── about/
│   │
│   ├── learn/
│   │   ├── page.tsx
│   │   └── [moduleSlug]/
│   │       ├── page.tsx
│   │       └── [topicSlug]/
│   │           └── page.tsx
│   │
│   ├── playground/
│   │   └── page.tsx
│   │
│   ├── practice/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── playground/
│   │   ├── visualize/
│   │   └── progress/
│   │
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── learning/
│   │   ├── TopicHeader.tsx
│   │   ├── DefinitionCard.tsx
│   │   ├── FormulaBlock.tsx
│   │   ├── ExampleCard.tsx
│   │   ├── LearningSection.tsx
│   │   └── TopicNavigation.tsx
│   │
│   ├── visualizer/
│   │   ├── LinearAlgebraCanvas.tsx
│   │   ├── Scene.tsx
│   │   ├── CameraController.tsx
│   │   ├── Grid.tsx
│   │   ├── Axes.tsx
│   │   ├── Vector.tsx
│   │   ├── Plane.tsx
│   │   ├── Point.tsx
│   │   ├── Basis.tsx
│   │   ├── MatrixTransform.tsx
│   │   ├── Projection.tsx
│   │   ├── Subspace.tsx
│   │   ├── Surface.tsx
│   │   └── labels/
│   │
│   └── playground/
│       ├── QuestionInput.tsx
│       ├── SolutionPanel.tsx
│       ├── VisualizationPanel.tsx
│       └── StepList.tsx
│
├── content/
│   ├── modules/
│   │   ├── module-1/
│   │   ├── module-2/
│   │   ├── module-3/
│   │   └── module-4/
│   │
│   └── topics/
│
├── features/
│   ├── curriculum/
│   │   ├── registry.ts
│   │   ├── types.ts
│   │   └── queries.ts
│   │
│   ├── math/
│   │   ├── matrix/
│   │   ├── vector/
│   │   ├── eigen/
│   │   ├── projection/
│   │   ├── basis/
│   │   ├── decomposition/
│   │   └── differential-equations/
│   │
│   ├── visualization/
│   │   ├── schema/
│   │   ├── compiler/
│   │   ├── presets/
│   │   └── adapters/
│   │
│   ├── playground/
│   │   ├── parser/
│   │   ├── solver/
│   │   ├── prompts/
│   │   └── types.ts
│   │
│   └── progress/
│
├── lib/
│   ├── supabase/
│   ├── ai/
│   ├── validation/
│   ├── logging/
│   └── utils/
│
├── workers/
│   └── math.worker.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── public/
│   ├── icons/
│   └── assets/
│
└── package.json
```

The important boundaries are:

```text
components/       → visual/UI implementation
features/math/    → mathematical computation
features/curriculum → syllabus/content metadata
features/visualization → visualization contracts
features/playground → AI/problem workflow
```

---

# 5. Curriculum Architecture

Do not hard-code the four modules into dozens of components.

Create a curriculum registry.

Example:

```ts
export const curriculum = {
  modules: [
    {
      id: 'module-1',
      slug: 'matrices-eigenvalues-decompositions',
      title: 'Matrices, Eigenvalues & Decompositions',
      hours: 10,
      order: 1,
      topics: [
        'characteristic-equations',
        'eigenvalues-eigenvectors',
        'diagonalization',
        'differential-equations',
        'symmetric-matrices',
        'positive-definite-matrices',
        'similar-matrices',
        'singular-value-decomposition',
        'generalized-inverses'
      ]
    }
  ]
};
```

Better still: store curriculum definitions as validated data objects rather than spreading them across route files.

---

# 6. Topic Schema

Every topic should follow one common model.

Example:

```ts
interface Topic {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  order: number;
  status: 'draft' | 'published' | 'archived';

  description: string;
  learningObjectives: string[];

  sections: TopicSection[];
  examples: Example[];
  exercises: Exercise[];

  visualizations: VisualizationPreset[];
  relatedTopics: string[];
}
```

Adding a topic should therefore look conceptually like:

```text
create topic file
        ↓
add topic ID to module
        ↓
add content
        ↓
assign existing visualizer / new visualizer type
```

Removing a topic:

```text
set status = archived
```

rather than deleting components and routes.

---

# 7. Content Architecture

Each topic should have this educational structure:

```text
1. Why this matters
2. Definition
3. Intuition
4. Mathematical formulation
5. Geometrical interpretation
6. Worked example
7. Interactive visualization
8. Experiment controls
9. Common mistakes
10. Practice problems
11. Summary
12. Related concepts
```

Do not dump enormous paragraphs onto the page.

Use progressive disclosure:

```text
simple intuition
      ↓
formula
      ↓
visual
      ↓
formal derivation
```

This is particularly important for students with weak spatial intuition.

---

# 8. Visualization Engine Architecture

The visualization engine is the most important technical subsystem.

## 8.1 Scene model

The scene should consume a normalized specification:

```ts
interface VisualizationSpec {
  version: 1;
  type: VisualizationType;
  dimension: 2 | 3;
  coordinateSystem: CoordinateSystemSpec;
  objects: VisualizationObject[];
  controls: VisualizationControl[];
  animation?: AnimationSpec;
}
```

Example object:

```ts
{
  type: 'vector',
  id: 'v1',
  position: [2, 1, 0],
  label: 'v'
}
```

The renderer converts these objects into R3F components.

---

# 9. Visualization Types

Create a finite set of supported visualization types.

Start with:

```text
vector
vectors
matrix-transformation
basis
plane
line
subspace
projection
orthogonal-complement
linear-transformation
eigenvectors
eigenvalue-transformation
dalagonalization
least-squares
surface
trajectory
qr-decomposition
svd
```

There is intentionally no requirement that each topic has a completely unique engine.

For example:

```text
Eigenvectors
     ↓
matrix-transformation + vectors + invariant-directions
```

SVD:

```text
unit-sphere
     ↓
rotation
     ↓
scaling
     ↓
rotation
     ↓
ellipsoid
```

This reuses lower-level primitives.

---

# 10. 2D vs 3D Strategy

Do NOT force every mathematical concept into 3D.

Use the best representation for the concept.

### 2D

Prefer for:

- basic vectors,
- 2D matrix transformations,
- projections,
- 2D basis changes,
- eigenvectors of 2×2 matrices,
- linear combinations.

### 3D

Prefer for:

- planes,
- 3D bases,
- orthogonal complements,
- 3D projections,
- 3D transformations,
- surfaces,
- SVD intuition,
- differential-equation trajectories.

### Higher dimensions

Do not pretend that 4D+ can literally be rendered.

Instead provide:

```text
3D geometric representation
+
coordinate/table representation
+
projection/slice controls
```

Explain clearly that the geometric display is a projection or lower-dimensional representation.

---

# 11. Matrix Transformation Engine

This should be built early because many later topics depend on it.

Input:

```text
A = [[a, b],
     [c, d]]
```

Scene:

```text
unit grid
basis vectors
custom vectors
```

Transform:

```text
x' = A x
```

Show animated interpolation from:

```text
identity
   ↓
A
```

This one subsystem powers:

- matrix transformations,
- determinant intuition,
- eigenvectors,
- diagonalization,
- similarity,
- basis changes,
- SVD foundations.

---

# 12. Animation System

Do not make every visualizer invent its own animation code.

Create a common animation controller.

```ts
interface AnimationController {
  play(): void;
  pause(): void;
  reset(): void;
  seek(progress: number): void;
  setSpeed(speed: number): void;
}
```

For a matrix transformation:

```text
A(t) = interpolation(I, A, t)
```

where:

```text
t = 0 → identity
 t = 1 → target matrix
```

The interpolation must be chosen carefully for mathematical meaning. Do not blindly interpolate matrix entries when doing so produces a misleading visual explanation.

For some concepts, animate geometric states directly rather than assuming linear matrix interpolation is pedagogically valid.

---

# 13. Visualizer Controls

Every visualizer should expose only relevant controls.

Typical controls:

```text
Camera
 ├── rotate
 ├── zoom
 └── reset

Scene
 ├── axes
 ├── grid
 ├── labels
 └── coordinate values

Objects
 ├── vector inputs
 ├── matrix inputs
 ├── basis selector
 └── plane/subspace toggles

Animation
 ├── play
 ├── pause
 ├── reset
 └── speed
```

Do not overload the screen with every possible setting.

Use an advanced settings panel when needed.

---

# 14. Visualizer Layout

Recommended desktop layout:

```text
┌───────────────────────────────────────────────────────────────┐
│ TOP BAR                                                       │
├────────────────────────┬──────────────────────────────────────┤
│                        │                                      │
│  EXPLANATION           │          3D / 2D CANVAS             │
│                        │                                      │
│  Definition            │                                      │
│  Intuition             │          interactive scene           │
│  Formula               │                                      │
│  Steps                 │                                      │
│                        │                                      │
├────────────────────────┴──────────────────────────────────────┤
│ CONTROLS / EXPERIMENT                                         │
│ Matrix | vectors | sliders | animation | presets              │
└───────────────────────────────────────────────────────────────┘
```

On mobile:

```text
Explanation
    ↓
Visualizer
    ↓
Controls
```

Do not simply shrink the desktop interface.

---

# 15. Module-by-Module Build Strategy

This is the most important development roadmap.

Do NOT build all four modules simultaneously.

---

# PHASE 0 — Foundation

Goal: build the platform shell without trying to finish Linear Algebra.

Implement:

```text
Next.js project
TypeScript
Tailwind
shadcn/ui
routing
layout
navigation
basic theme
error boundaries
logging
testing setup
```

Build pages:

```text
/
/learn
/learn/module-1
/learn/module-1/example-topic
/playground
/practice
```

Do not add authentication yet unless needed.

### Done criteria

- application runs cleanly,
- production build succeeds,
- routing works,
- mobile layout works,
- basic E2E test passes.

---

# PHASE 1 — Visualization Foundation

Do this BEFORE implementing the full curriculum.

Build:

```text
Canvas wrapper
camera
axes
grid
vector
arrow
point
line
plane
labels
coordinate display
```

Then build the core matrix transformation scene.

### First visualization milestone

User can type:

```text
A = [ 2  1 ]
    [ 0  1 ]
```

and see the coordinate grid transform.

### Done criteria

The user can:

- rotate,
- zoom,
- reset camera,
- edit matrix values,
- see vectors transform,
- play/pause animation,
- reset the scene.

Do not move to SVD or eigenvectors until this is reliable.

---

# PHASE 2 — Math Engine Foundation

Implement and test:

```text
Vector
 ├── addition
 ├── subtraction
 ├── scalar multiplication
 ├── dot product
 ├── norm
 └── normalization

Matrix
 ├── multiplication
 ├── transpose
 ├── determinant
 ├── inverse
 ├── rank
 ├── row reduction
 └── matrix-vector multiplication
```

Add unit tests for all operations.

Example test:

```text
A = [[2,1],[0,1]]
v = [3,2]
A*v = [8,2]
```

The math engine should be deterministic and independent of UI rendering.

---

# PHASE 3 — MODULE I

Module I is the best first real academic module because it establishes the matrix/geometry relationship used everywhere else.

Implement in this order:

### I.1 Characteristic Equations

Build:

- determinant of A - λI,
- characteristic polynomial,
- roots,
- visualization of candidate invariant directions where applicable.

### I.2 Eigenvalues and Eigenvectors

Build:

- eigenvalue computation,
- eigenvector computation,
- invariant-direction visualization,
- matrix transformation animation.

Core scene:

```text
v
 ↓
A
 ↓
Av
```

with special highlighting when:

```text
Av = λv
```

### I.3 Diagonalization

Build:

```text
A = P D P⁻¹
```

Visualization:

```text
original coordinates
        ↓
       P⁻¹
        ↓
eigenbasis coordinates
        ↓
        D
        ↓
       P
        ↓
original space
```

### I.4 Applications to Differential Equations

Build only after eigenvalues/eigenvectors are stable.

Show:

```text
x' = Ax
```

with trajectories and direction fields.

### I.5 Symmetric Matrices

Visualize:

- orthogonal eigenvectors,
- principal directions,
- transformation behavior.

### I.6 Positive Definite Matrices

Build:

```text
xᵀAx
```

surface visualization where feasible.

Show positive-definite vs indefinite examples.

### I.7 Similar Matrices

Show the same transformation under different coordinate systems/bases.

### I.8 Singular Value Decomposition

Implement after the matrix transformation and basis infrastructure are mature.

Visualization:

```text
unit circle/sphere
        ↓
Vᵀ
        ↓
Σ
        ↓
U
        ↓
ellipse/ellipsoid
```

This should become a flagship visualization.

### I.9 Generalized Inverses

Introduce pseudoinverse-style geometric examples and connect them to least squares later.

---

# PHASE 4 — MODULE II

Module II is where the platform shifts from matrix manipulation to the language of vector spaces.

Implement in this order:

1. Definition of Field
2. Vector Spaces
3. Elementary Properties
4. Subspaces
5. Linear Sum of Subspaces
6. Spanning Sets
7. Linear Dependence / Independence
8. Basis
9. Dimension
10. Applications to matrices and linear systems

### Critical visualizers

#### Linear combinations

Allow sliders:

```text
a₁
 a₂
 a₃
```

and display:

```text
v = a₁v₁ + a₂v₂ + a₃v₃
```

#### Spanning

Show the region generated by selected vectors.

For two independent vectors in 3D:

```text
plane = span(v1, v2)
```

#### Linear dependence

Show when one vector becomes constructible from the others.

#### Basis changes

Connect directly to the Module I matrix transformation system.

---

# PHASE 5 — MODULE III

Implement:

1. Inner Product Spaces
2. Norms
3. Orthogonality
4. Projections
5. Orthogonal Complementary Subspaces
6. Orthogonal Projections
7. Gram-Schmidt
8. Least Squares
9. QR Decomposition

### Recommended implementation order

```text
norms
 ↓
dot product / inner product
 ↓
angles
 ↓
orthogonality
 ↓
projection
 ↓
orthogonal complement
 ↓
Gram-Schmidt
 ↓
least squares
 ↓
QR
```

This sequence lets each visualization support the next.

### Signature visualization: Projection

Show:

```text
v
│\
│ \
│  \
│   ● projection
│  /
│ /
└────────────── subspace
```

with the perpendicular error vector visible.

### Signature visualization: Gram-Schmidt

Animate:

```text
v1 → u1

v2 → v2 - proj_u1(v2) → u2

v3 → subtract projections → u3
```

### Signature visualization: Least Squares

Show:

```text
original data
     ↓
projection onto column space
     ↓
least-squares solution
```

---

# PHASE 6 — MODULE IV

Implement:

1. Linear Transformations
2. Kernels and Images
3. Rank-Nullity Theorem
4. Matrix Representation
5. Change of Basis
6. Linear Space of Linear Mappings

### Core visualizer

Create a generic transformation mapping:

```text
Input space
     │
     │ T
     ▼
Output space
```

Allow users to inspect:

```text
vector → transformed vector
subspace → image
kernel vectors → zero
basis → transformed basis
```

### Rank-nullity visualization

Example:

```text
R³
 │
 │ T
 ▼
R²

kernel dimension = 1
image dimension  = 2

1 + 2 = 3
```

The visualizer should visually distinguish kernel and image rather than only showing the equation.

---

# 16. Playground Architecture

The Playground is a separate feature, not a modified Topic page.

Student enters:

```text
Find the eigenvalues and eigenvectors of
A = [[2,1],[1,2]]
```

Pipeline:

```text
                 USER QUESTION
                       │
                       ▼
                question parser
                       │
                       ▼
                topic classifier
                       │
              ┌────────┴────────┐
              ▼                 ▼
         math solver       LLM explanation
              │                 │
              └────────┬────────┘
                       ▼
                answer verifier
                       │
                       ▼
             visualization planner
                       │
                       ▼
                schema validation
                       │
                       ▼
                   visualizer
```

---

# 17. Playground Should NOT Trust the LLM for Mathematics Blindly

The LLM is useful for:

- interpreting the question,
- explaining concepts,
- organizing a solution,
- generating visualization instructions.

The math engine should verify numerical claims whenever practical.

For example:

```text
LLM says eigenvalue = 3
        ↓
math engine verifies
        ↓
accept / correct / regenerate
```

This reduces hallucinated mathematics.

For advanced symbolic questions, a later Python/SymPy service can become the verification layer.

---

# 18. Visualization Specification From AI

Use a strict schema.

Example:

```ts
const VisualizationSpecSchema = z.object({
  version: z.literal(1),
  type: z.enum([
    'vector',
    'linear-transformation',
    'projection',
    'eigenvectors',
    'basis',
    'plane',
    'least-squares'
  ]),
  dimension: z.union([z.literal(2), z.literal(3)]),
  objects: z.array(z.unknown()),
  controls: z.array(z.unknown()).optional(),
  animation: z.unknown().optional()
});
```

Use more specific schemas as the visualizer matures.

Never directly execute model-produced JavaScript.

---

# 19. Playground Response UI

Recommended layout:

```text
┌─────────────────────────────────────────────────────┐
│ YOUR QUESTION                                        │
├─────────────────────────────────────────────────────┤
│ Mathematical answer                                 │
│                                                     │
│ Step 1                                              │
│ Step 2                                              │
│ Step 3                                              │
├─────────────────────────┬───────────────────────────┤
│ WHY?                    │ VISUALIZE                 │
│                         │                           │
│ Conceptual explanation  │ Interactive scene        │
│                         │                           │
├─────────────────────────┴───────────────────────────┤
│ Related concepts / Try changing this               │
└─────────────────────────────────────────────────────┘
```

Buttons:

```text
Explain simpler
Show steps
Visualize
Try another example
Change the matrix
Practice similar question
```

---

# 20. Performance Architecture

Smoothness is critical because WebGL + React + AI + math can easily become sluggish if everything is tied together.

## Rule 1 — Keep the render loop independent

Do not cause React renders for every frame of an animation.

Use refs / render-loop mutation for continuously changing graphics.

React Three Fiber specifically advises against `setState` in loops and recommends direct mutation inside `useFrame` for fast updates. citeturn722666search3

## Rule 2 — Reuse Three.js resources

Reuse:

```text
geometries
materials
textures
helper objects
```

Avoid constructing new objects on every render.

## Rule 3 — Lazy-load the visualizer

Most content pages do not need WebGL immediately.

Use dynamic/lazy loading for the heavy visualization bundle.

Conceptually:

```text
page loads
   ↓
text appears quickly
   ↓
visualizer bundle loads
   ↓
canvas appears
```

## Rule 4 — Use Web Workers for expensive computation

When calculations become expensive:

```text
UI
 │
 │ request
 ▼
Web Worker
 │
 │ result
 ▼
UI
```

Good candidates:

- large matrix decompositions,
- numerical simulations,
- trajectory generation,
- large least-squares calculations.

Do not put every tiny vector calculation into a worker; worker overhead is not free.

## Rule 5 — Cache repeated computations

For matrix inputs:

```text
matrix hash
    ↓
cache
    ↓
result
```

This is especially useful for:

```text
eigenvalues
eigenvectors
SVD
QR
rank
row reduction
```

## Rule 6 — Keep initial scenes small

Educational scenes generally do not need thousands of meshes.

Use:

- line rendering,
- buffer geometry,
- instancing,
- reused materials,
- batched geometry

when large numbers of objects eventually become necessary.

---

# 21. Responsive / Mobile Strategy

Do not assume 3D automatically equals desktop-only.

Mobile should support:

```text
touch rotate
pinch zoom
single-finger controls
bottom-sheet controls
compact matrix editor
```

However, advanced scenes can have a "simplified mobile mode".

For example:

```text
Desktop:
3D + full controls + explanation side panel

Mobile:
3D
↓
controls bottom sheet
↓
explanation below
```

---

# 22. Accessibility

The visualization cannot be the only way to understand a concept.

Every interactive scene must have an alternative mathematical representation.

For example:

```text
3D visualizer
+
accessible description
+
coordinate/value table
+
formula
+
step-by-step explanation
```

Keyboard controls should exist for important controls.

Canvas interactions should never be the only way to change an important value.

---

# 23. Database Design

Start with a small schema.

### modules

```text
id
slug
title
description
order
status
```

### topics

```text
id
module_id
slug
title
content
order
status
```

### topic_visualizations

```text
id
topic_id
type
spec
order
```

### exercises

```text
id
topic_id
question
answer
solution
metadata
```

### user_progress

```text
user_id
topic_id
status
completion_percentage
last_opened_at
```

### playground_sessions

```text
id
user_id
question
answer
visualization_spec
created_at
```

Use Row Level Security for user-owned data.

Supabase Auth integrates with the database/auth layer, while RLS can control access to application tables. citeturn113693search3

---

# 24. Content Storage Strategy

For the initial version, educational content can live in version-controlled files:

```text
content/modules/module-1/*.ts
```

or a structured content format.

This is preferable while the curriculum is still changing rapidly.

Move content into a CMS/database later if non-developers need to edit it.

Important distinction:

```text
Code repository
    → canonical educational content during development

Database
    → user data, progress, sessions, personalization
```

Do not put everything in the database simply because a database exists.

---

# 25. Topic Authoring Workflow

Creating a new topic should follow:

```text
1. Create topic definition
2. Write learning objectives
3. Write explanation sections
4. Add worked example
5. Choose existing visualization type(s)
6. Create visualization preset
7. Add exercises
8. Add tests
9. Publish
```

Example:

```text
new topic:
positive-definite-matrices

content:
  definition
  intuition
  formula
  examples

visualization:
  surface

controls:
  matrix entries
  x/y range
  contour toggle

practice:
  identify PD / non-PD matrices
```

This keeps adding topics predictable.

---

# 26. Topic Dependency Graph

The UI should eventually show prerequisites.

Example:

```text
Vectors
   ↓
Dot Product
   ↓
Orthogonality
   ↓
Projection
   ↓
Gram-Schmidt
   ↓
QR
```

Another:

```text
Matrix Multiplication
        ↓
Matrix Transformation
        ↓
Eigenvalues
        ↓
Eigenvectors
        ↓
Diagonalization
```

Use these relationships for recommendations and navigation.

---

# 27. Practice System

Each topic should have three levels:

```text
Level 1 — Recognition
Level 2 — Application
Level 3 — Challenge
```

Example for eigenvectors:

```text
Level 1:
Which vector is an eigenvector?

Level 2:
Calculate eigenvalues/eigenvectors.

Level 3:
Construct a matrix with specified eigenvectors.
```

Some practice problems should be generated parametrically rather than manually.

Example:

```text
parameterized matrix
      ↓
random valid instance
      ↓
verified answer
      ↓
question
```

The generator must compute the answer independently.

---

# 28. Visual Learning Modes

Implement three modes eventually.

## Guided

```text
Step 1
Step 2
Step 3
```

The system controls the animation.

## Explore

The student controls everything.

## Challenge

The student must achieve a target.

Example:

> Make the transformed vector perpendicular to the x-axis.

or:

> Find a vector that remains on the same line after transformation.

This turns the visualizer into an actual learning environment rather than a demonstration.

---

# 29. Error Handling

Every subsystem should fail gracefully.

### Math engine

Invalid matrix:

```text
Clear validation message
```

### Visualizer

Invalid visualization spec:

```text
Fallback visualization
+ developer log
```

### AI

AI timeout:

```text
Retry
Use previous answer
Show manual playground
```

### WebGL

WebGL unavailable / device limitations:

```text
2D/static mathematical representation
```

The platform should still teach the mathematics without WebGL.

---

# 30. Observability

Do not wait until production to know something broke.

Track:

```text
visualizer load failures
AI request failures
math computation failures
slow computation times
client errors
WebGL initialization failures
```

Do not log sensitive student question content unnecessarily.

Use structured logging so errors can be diagnosed by topic and feature.

---

# 31. Security Rules

Never:

- execute LLM-generated JavaScript,
- trust client-side authorization,
- expose private server keys to browser code,
- store sensitive secrets in visualization specs,
- allow arbitrary database access from the client.

Validate all AI outputs.

Validate all API inputs.

Use server-side authorization and database RLS for user-owned records.

---

# 32. Testing Strategy

## Unit tests

Math engine:

```text
vector operations
matrix operations
rank
determinant
inverse
eigenvalues
eigenvectors
projection
Gram-Schmidt
least squares
QR
SVD
```

## Contract tests

Validate every visualization specification against its schema.

## Component tests

Test:

```text
matrix editor
vector editor
control panels
topic navigation
playground response rendering
```

## E2E tests

At minimum:

```text
open module
open topic
load visualizer
edit matrix
play animation
reset visualization
submit playground question
receive result
open visualization
```

Run E2E tests in Chromium at minimum and broaden browser coverage as the product matures. Playwright supports Chromium, Firefox and WebKit. citeturn113693search6

---

# 33. Definition of Done for a Topic

A topic is NOT complete simply because the article is written.

A topic is complete when:

```text
[ ] Definition written
[ ] Intuition written
[ ] Mathematics verified
[ ] Worked example added
[ ] Visualization connected
[ ] Controls work
[ ] Animation works where useful
[ ] Common mistakes documented
[ ] Practice problems added
[ ] Mobile checked
[ ] Accessibility checked
[ ] Unit tests added for topic math
[ ] Visualizer spec validated
[ ] E2E smoke test passes
```

---

# 34. Suggested First 10 Visualizers

Do not try to create all visualizers immediately.

Build these first:

```text
1. Vector Playground
2. Matrix Transformation
3. Linear Combination
4. Basis / Basis Change
5. Eigenvectors
6. Projection
7. Orthogonal Complement
8. Gram-Schmidt
9. Least Squares
10. SVD
```

These cover a huge amount of the syllabus and establish reusable primitives for almost everything else.

---

# 35. Recommended First MVP

Do NOT attempt the complete syllabus for version 1.

Build this vertical slice:

```text
Landing page
      ↓
Module I
      ↓
Eigenvalues & Eigenvectors
      ↓
Interactive matrix transformation
      ↓
Eigenvector visualization
      ↓
Practice
      ↓
Playground
      ↓
Paste eigenvalue problem
      ↓
Verified solution
      ↓
Generated visualization
```

This gives you a complete demonstration of the product idea without requiring the entire syllabus.

---

# 36. Milestone Sequence

## Milestone 1 — Foundation

```text
Next.js
routing
UI system
project architecture
```

## Milestone 2 — Visualizer Engine

```text
Three.js
R3F
camera
axes
vectors
matrix transformations
```

## Milestone 3 — Math Engine

```text
vectors
matrices
rank
determinant
eigenvalues
eigenvectors
```

## Milestone 4 — Module I

```text
characteristic equations
eigenvectors
diagonalization
symmetric matrices
positive definite
similar matrices
```

Then:

```text
SVD
pseudoinverse
ODE applications
```

## Milestone 5 — Playground

```text
question input
question parsing
math verification
AI explanation
visualization specification
```

## Milestone 6 — Module II

```text
vector spaces
subspaces
span
independence
basis
dimension
```

## Milestone 7 — Module III

```text
norm
inner product
orthogonality
projection
Gram-Schmidt
least squares
QR
```

## Milestone 8 — Module IV

```text
linear transformations
kernel/image
rank-nullity
matrix representation
change of basis
```

## Milestone 9 — Productization

```text
authentication
progress tracking
saved playgrounds
practice history
personalization
```

## Milestone 10 — Advanced Learning

```text
challenge mode
visual explanations
adaptive recommendations
more generated problems
analytics
```

---

# 37. What NOT to Build Early

Avoid these until the visual learning core works:

```text
❌ complicated social features
❌ chat between students
❌ leaderboards
❌ excessive gamification
❌ native mobile apps
❌ giant admin dashboard
❌ custom CMS
❌ complex subscriptions
❌ dozens of AI agents
❌ 100 visualizers
```

The core product must prove:

```text
abstract concept
      ↓
interactive geometry
      ↓
student understanding
```

before expanding around it.

---

# 38. Performance Budget

Set explicit targets.

### Initial page

Aim for:

```text
fast text/content rendering
minimal JavaScript for content-only routes
visualizer loaded only when required
```

### Interactive visualizer

Aim for:

```text
smooth camera interaction
stable animation
no visible stuttering from ordinary slider changes
```

### AI Playground

Use streaming responses where useful so the interface does not appear frozen while generation is happening.

### Heavy math

Never freeze the main UI for obviously expensive calculations.

Use:

```text
cache
worker
server calculation
```

according to computation size.

---

# 39. Design System Rules

The application should feel like a learning tool, not a generic dashboard.

Use a clear visual hierarchy:

```text
Concept
   ↓
Visualization
   ↓
Experiment
   ↓
Practice
```

Prefer:

- spacious layouts,
- clear mathematical typography,
- restrained colors,
- strong visual distinction between input and output,
- consistent vector/object labels,
- obvious play/pause/reset controls.

Avoid excessive decorative UI around the visualizer.

The visualizer should be the star.

---

# 40. Final Architecture Principle

The platform should eventually be able to support this workflow:

```text
ADD NEW TOPIC

        ↓

Create topic definition

        ↓

Reuse an existing visualizer
             OR
Create one new visualization primitive

        ↓

Add content

        ↓

Add examples

        ↓

Add exercises

        ↓

Add visualization preset

        ↓

Tests

        ↓

Publish
```

Adding `Orthogonal Projection`, `QR Decomposition`, or a completely new Linear Algebra topic should **not require changing the entire application architecture**.

---

# 41. The Correct Build Order in One Diagram

```text
                    FOUNDATION
                         │
                         ▼
                 VISUALIZATION CORE
                         │
                         ▼
                    MATH ENGINE
                         │
                         ▼
                 MATRIX TRANSFORMS
                         │
                         ▼
                    MODULE I
                         │
            ┌────────────┴─────────────┐
            ▼                          ▼
       PRACTICE                    PLAYGROUND
            │                          │
            └────────────┬─────────────┘
                         ▼
                     MODULE II
                         │
                         ▼
                     MODULE III
                         │
                         ▼
                     MODULE IV
                         │
                         ▼
                  AUTH + PROGRESS
                         │
                         ▼
               ADVANCED FEATURES
```

This order is intentional: every stage creates infrastructure reused by the next one.

---

# 42. Practical First Sprint

The first development sprint should be small.

### Sprint goal

Build a working interactive matrix transformation playground.

### Deliverables

```text
[ ] Next.js + TypeScript app
[ ] Tailwind + UI primitives
[ ] R3F canvas
[ ] camera controls
[ ] axes
[ ] grid
[ ] vector rendering
[ ] matrix input
[ ] matrix-vector multiplication
[ ] matrix transformation animation
[ ] reset button
[ ] responsive layout
[ ] Vitest setup
[ ] Playwright smoke test
```

Do not write all Module I content during this sprint.

The purpose is to validate the **core visualization architecture** first.

---

# 43. Practical Second Sprint

Build:

```text
[ ] eigenvalue computation
[ ] eigenvector computation
[ ] eigenvector visualizer
[ ] characteristic equation explanation
[ ] eigenvector experiment controls
[ ] topic schema
[ ] module schema
[ ] first real Topic page
```

At the end of this sprint, you should already be able to demonstrate:

> “Here is a matrix. Change it. Watch the transformation. See which directions remain invariant. Learn the mathematics behind it.”

That is the first meaningful proof of the product.

---

# 44. Long-Term Platform Vision

The final platform can become:

```text
                 LINEAR ALGEBRA
                        │
          ┌─────────────┼──────────────┐
          │             │              │
         LEARN       EXPERIMENT      SOLVE
          │             │              │
          ▼             ▼              ▼
       Lessons      Visualizer       Playground
          │             │              │
          └─────────────┼──────────────┘
                        │
                        ▼
                MATHEMATICAL MODEL
                        │
                 ┌──────┴───────┐
                 ▼              ▼
             COMPUTATION    VISUALIZATION
                 │              │
                 └──────┬───────┘
                        ▼
                 STUDENT INTUITION
```

The goal is not simply to provide correct answers.

The goal is to make the student understand the relationship between:

```text
symbols
  ↕
equations
  ↕
operations
  ↕
geometry
  ↕
intuition
```

That relationship should be the foundation of every engineering decision in this project.

---

# 45. Technology Reference Notes

The stack above should be installed using current stable releases at implementation time rather than hard-coding old version numbers into this document.

Official references used when defining the architecture:

- Next.js documentation: https://nextjs.org/docs
- React Three Fiber performance guidance: https://r3f.docs.pmnd.rs/advanced/pitfalls
- Supabase database documentation: https://supabase.com/docs/guides/database/overview
- Supabase Storage documentation: https://supabase.com/docs/guides/storage
- Zod documentation: https://zod.dev/
- TanStack Query documentation: https://tanstack.com/query/latest/docs/framework/react/overview
- Playwright documentation: https://playwright.dev/docs/
- Tailwind CSS documentation: https://tailwindcss.com/docs/
- Math.js matrix documentation: https://mathjs.org/docs/datatypes/matrices.html

When a library's API or recommended setup changes, use its current official documentation rather than copying configuration from this plan unchanged.

---

# Final Rule

**Build vertically, not horizontally.**

Do not spend months creating every page, every database table, and every AI feature before the 3D experience is proven.

The ideal progression is:

```text
ONE concept
      ↓
ONE visualizer
      ↓
ONE complete learning loop
      ↓
ONE module
      ↓
PLAYGROUND
      ↓
remaining modules
```

The first version should make one concept feel exceptionally good before trying to make the entire syllabus exist.
