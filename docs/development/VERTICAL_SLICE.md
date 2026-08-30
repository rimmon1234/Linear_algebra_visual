# VERTICAL_SLICE.md

## Purpose

The project must be developed vertically: complete one small experience from content through mathematics, visualization, interaction, testing, and deployment before scaling breadth.

## First Slice

The recommended first slice is:

> **Matrix / Linear Transformation**

This becomes the foundation for many later topics.

## 1. User Story

A student opens the topic and learns what a matrix does geometrically.

They see a coordinate grid and basis vectors.

They edit a matrix and a vector.

The vector and grid transform.

They animate the transformation.

They can reset and experiment.

They answer a short practice problem.

## 2. End-to-End Flow

```text
Topic registry
     ↓
Topic page
     ↓
Lesson content
     ↓
Visualization preset
     ↓
VisualizationSpec validation
     ↓
Math engine
     ↓
R3F renderer
     ↓
User interaction
     ↓
Math engine update
     ↓
Renderer update
     ↓
Practice
```

## 3. Required Capabilities

### Content

- Definition of a matrix transformation.
- Simple intuition.
- Formula `x' = Ax`.
- Worked 2×2 example.
- Experiment instructions.

### Math

- matrix validation,
- matrix × vector,
- interpolation/animation model where pedagogically valid,
- transformed basis/vector results.

### Visualization

- axes,
- grid,
- basis vectors,
- arbitrary vector,
- transformed vector,
- transformed grid,
- labels,
- reset.

### Controls

- editable matrix entries,
- editable vector coordinates,
- animation play/pause,
- animation reset,
- camera reset.

### Practice

Example task:

```text
Given A and v, calculate Av and identify the transformed vector in the visualization.
```

## 4. Acceptance Tests

A vertical slice passes only if:

- the topic is reachable through generic curriculum navigation,
- no topic-specific route hack is required,
- the matrix operation agrees with unit-tested math code,
- visual values match the math engine,
- editing controls update the visualization,
- reset returns to the initial state,
- the animation is understandable,
- invalid matrix/vector input is handled,
- mobile layout remains usable,
- E2E test covers the primary flow,
- browser console is clean.

## 5. What This Slice Proves

The first slice proves that the core architecture works across:

```text
content
math
visualization
interaction
practice
testing
routing
```

If this slice is clean, subsequent topics should reuse the same foundation.

## 6. Do Not Expand Prematurely

Before the first slice is complete, do not build:

- all syllabus topics,
- full authentication,
- a complex CMS,
- every AI capability,
- elaborate analytics,
- social features.

## 7. Second Slice

Recommended second slice:

> **Eigenvalues and Eigenvectors**

Reuse:

- matrix engine,
- vector engine,
- transformation renderer,
- topic system,
- animation infrastructure,
- practice infrastructure.

Add only the new mathematical/visual abstractions genuinely required.
