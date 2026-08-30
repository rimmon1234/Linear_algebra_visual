# PRODUCT_SPEC.md

## 1. Product Vision

Build a Linear Algebra learning platform that turns abstract mathematics into something students can **understand, see, manipulate, and practice**.

The core product promise is:

> Learn the mathematics, see the geometry, interact with it, then solve problems using the same concepts.

## 2. Target User

Primary user: university students taking a Linear Algebra course, especially students who struggle to form geometric intuition.

Secondary users:

- students preparing for examinations,
- students revising independently,
- instructors demonstrating concepts,
- learners using the Playground to understand personal questions.

## 3. Core Experience

```text
Learn
  ↓
Understand intuition
  ↓
See geometry
  ↓
Manipulate parameters
  ↓
Make a prediction
  ↓
Check mathematically
  ↓
Practice
```

## 4. Product Pillars

### Learning

Every topic should provide:

- why it matters,
- definition,
- intuition,
- formal mathematics,
- geometric interpretation,
- worked examples,
- practice.

### Visualization

Interactive 2D/3D visualizations are a first-class learning surface.

Students should be able to:

- rotate,
- zoom,
- pan,
- change vectors,
- change matrices,
- toggle objects,
- animate transformations,
- reset experiments.

### Playground

Students paste or type a Linear Algebra question and receive:

1. a solution,
2. step-by-step explanation,
3. conceptual explanation,
4. mathematical verification when supported,
5. a geometric visualization when meaningful.

### Practice

Practice should go beyond answer checking by offering hints, explanations, and visual verification where useful.

## 5. Information Architecture

```text
Home
├── Learn
│   ├── Module I
│   ├── Module II
│   ├── Module III
│   └── Module IV
├── Playground
└── Practice
```

## 6. Topic Page Experience

Recommended order:

```text
Topic title
↓
Why this matters
↓
Definition
↓
Intuition
↓
Formula / derivation
↓
Interactive visualizer
↓
Guided experiment
↓
Worked example
↓
Common mistakes
↓
Practice
↓
Summary
↓
Related topics
```

## 7. Success Criteria

A successful topic page allows a student to answer:

- What is this?
- Why do we need it?
- What does the formula mean?
- What does it look like geometrically?
- What changes when I manipulate it?
- How do I solve a problem using it?
- Can I solve one myself?

## 8. Non-Goals for Initial Releases

Do not prioritize:

- social networking,
- gamified leaderboards,
- a massive authoring CMS,
- real-time collaboration,
- support for arbitrary mathematical subjects outside the syllabus.

The first priority is a high-quality Linear Algebra learning loop.

## 9. Product Quality Bar

The platform should feel:

- mathematically trustworthy,
- visually clear,
- fast and responsive,
- calm rather than cluttered,
- intuitive for students with weak spatial intuition.
