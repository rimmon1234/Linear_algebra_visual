# CONTENT_AUTHORING_SPEC.md

## Purpose

This document defines how educational Linear Algebra content is created, structured, reviewed, and published.

The platform is an educational product. Mathematical correctness and pedagogical clarity are part of the product, not post-processing.

## Topic Authoring Model

Every topic should normally contain:

```text
Why it matters
Definition
Prerequisites
Intuition
Formal mathematics
Geometric interpretation
Worked example(s)
Interactive experiment
Common mistakes / misconceptions
Practice
Hints
Solution / explanation
Summary
Related topics
```

Not every topic must use every section literally, but missing sections should be intentional.

## Learning Objectives

Each topic must state measurable learning objectives.

Prefer objectives such as:

```text
Explain what an eigenvector means geometrically.
Compute eigenvalues of a suitable matrix.
Identify invariant directions from a transformation.
Interpret the result visually.
```

over vague objectives such as:

```text
Understand eigenvectors.
```

## Prerequisites

Every topic should identify prerequisite topic IDs where useful.

The authoring system must not create impossible prerequisite cycles.

## Explanation Pattern

Prefer progressive disclosure:

```text
intuition
→ mathematical statement
→ example
→ visualization
→ formal derivation
→ practice
```

The order may change when the concept benefits from another sequence.

## Mathematical Standards

All formulas must be checked for:

- notation,
- dimensions,
- assumptions,
- special cases,
- consistency with the math engine.

Do not simplify a definition until it becomes mathematically false.

## Visualization Authoring

Each visualization preset must state:

```text
visualization type
initial state
mathematical inputs
visible objects
available controls
animation behavior
expected interpretation
limitations
```

The author must explicitly state when the visualization is:

- a direct geometric representation,
- a projection,
- a schematic,
- an analogy.

Do not present an analogy as an exact geometric representation.

## Practice Authoring

Questions should test the stated learning objectives.

Each practice item should include:

```text
question
concept/topic
difficulty
expected answer type
solution
optional hints
visualization connection when meaningful
```

Difficulty should be based on cognitive demand, not merely arithmetic size.

## Misconception Coverage

For important topics, include common mistakes such as:

```text
confusing eigenvalues with eigenvectors
treating a spanning set as automatically a basis
assuming every matrix is diagonalizable
confusing orthogonal with orthonormal
assuming rank means number of rows
```

The exact misconceptions depend on the topic.

## Content Versioning

Educational content should be versionable.

Changing a definition or worked example can affect saved progress and AI explanations. Keep content changes reviewable in version control.

## Authoring Workflow

```text
Draft
 ↓
Mathematical review
 ↓
Visualization review
 ↓
Pedagogical review
 ↓
Technical validation
 ↓
Publish
```

For an MVP, one person may perform multiple roles, but the review gates still apply.

## Review Checklist

### Mathematics

```text
[ ] Definition correct
[ ] Formula correct
[ ] Dimensions consistent
[ ] Examples verified
[ ] Edge cases considered
```

### Visualization

```text
[ ] Visual is mathematically faithful
[ ] Labels are correct
[ ] Controls affect the actual model
[ ] Animation is not misleading
[ ] Higher-dimensional limitations are stated
```

### Pedagogy

```text
[ ] Learning objectives are clear
[ ] Explanation progresses from intuition to formalism appropriately
[ ] Common mistakes are covered where useful
[ ] Practice matches objectives
[ ] Difficulty is appropriate
```

## Publishing States

Recommended states:

```text
draft
in-review
published
archived
```

Only `published` content should appear in the normal student curriculum.

## AI-Generated Content

AI may assist with drafts, examples, hints, and alternative explanations.

AI-generated educational content must not automatically become trusted curriculum.

It must pass the same mathematical and pedagogical review process as human-authored content.
