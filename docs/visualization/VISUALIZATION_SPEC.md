# VISUALIZATION_SPEC.md

## 1. Purpose

Define the contract between mathematical state and the 2D/3D rendering engine.

The renderer is a trusted interpreter of structured data. It does not execute arbitrary code.

## 2. Core Model

```text
Math Engine
   ↓
Visualization Model
   ↓
Validated VisualizationSpec
   ↓
Renderer
   ↓
Canvas
```

## 3. Top-Level Contract

```ts
interface VisualizationSpec {
  version: 1;
  type: VisualizationType;
  dimension: 2 | 3;
  coordinateSystem: CoordinateSystemSpec;
  objects: VisualizationObject[];
  controls: VisualizationControl[];
  animation?: AnimationSpec;
  camera?: CameraSpec;
  metadata?: VisualizationMetadata;
}
```

Exact runtime schemas should be implemented with Zod.

## 4. Visualization Types

Initial supported types:

```text
vector
vectors
line
plane
subspace
basis
matrix-transformation
linear-transformation
projection
orthogonal-complement
eigenvectors
eigenvalue-transformation
diagonalization
surface
trajectory
least-squares
qr-decomposition
svd
unit-sphere
ellipsoid
```

## 5. Primitive Objects

The rendering system should support reusable primitives:

- Axes
- Grid
- Vector
- Point
- Line
- Plane
- Basis
- Subspace
- Projection connector
- Surface
- Trajectory
- Matrix-transformation field
- Labels
- Arrows
- Unit sphere
- Ellipsoid

## 6. Vector Object

Conceptual contract:

```ts
{
  type: 'vector';
  id: string;
  value: number[];
  origin?: number[];
  label?: string;
  draggable?: boolean;
  visible?: boolean;
}
```

For a 3D scene the value must contain three coordinates. For a 2D scene it may contain two.

## 7. Matrix Transformation

Input includes a validated matrix and an optional set of vectors/objects to transform.

The visualization should show:

- original object,
- transformed object,
- coordinate/grid deformation where meaningful,
- numerical matrix values,
- optional animation.

## 8. Interactions

Supported control types should include:

```text
slider
number-input
vector-input
matrix-input
toggle
select
button
scrubber
```

Interaction should update the underlying mathematical state, not a decorative copy.

## 9. Camera

Default controls:

- orbit/rotate,
- zoom/dolly,
- pan where appropriate,
- reset camera.

Camera controls must not interfere with object dragging when an object is actively selected.

## 10. Coordinate System

Coordinate system should support:

- axis visibility,
- grid visibility,
- labels,
- numeric tick marks,
- configurable bounds,
- 2D or 3D mode.

## 11. Animation Contract

```ts
interface AnimationSpec {
  enabled: boolean;
  durationMs: number;
  autoplay?: boolean;
  loop?: boolean;
  stages?: AnimationStage[];
}
```

Animations should represent mathematically meaningful state transitions.

Do not automatically interpolate matrix elements merely because interpolation is easy. Choose transformations that preserve the intended teaching meaning.

## 12. 2D/3D Policy

Use 2D when it communicates the concept more clearly.

Use 3D for planes, 3D bases, surfaces, 3D transformations, and spatial relationships.

For dimensions >3, use projection/slice/coordinate views and clearly label the representation as a projection or reduced-dimensional view.

## 13. Truthfulness Rules

Every visual element should correspond to a known mathematical quantity or construction.

Avoid visual tricks that imply false mathematical relationships.

Numeric labels should be generated from the same state used for rendering.

## 14. Accessibility/Fallback

If WebGL is unavailable:

- show a static/2D fallback where possible,
- show key numerical values,
- retain textual explanations.

The lesson must remain understandable without the 3D scene.

## 15. Performance

- Reuse geometries/materials.
- Avoid per-frame React state updates.
- Prefer mutation for high-frequency visual state where appropriate.
- Dispose of temporary GPU resources.
- Lazy-load the renderer when possible.
- Avoid unnecessary canvas remounts.

## 16. Visualizer Presets

A topic can reference a preset:

```ts
{
  presetId: 'eigenvector-basic-2d',
  variables: {
    matrix: [[2,1],[1,2]],
    vector: [1,1]
  }
}
```

Presets are declarative and reusable.
