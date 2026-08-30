# CURRICULUM_SPEC.md

## 1. Curriculum Rule

The curriculum is data-driven. Modules and topics must not be hard-coded into individual UI pages.

Every module and topic has a stable ID and slug.

## 2. Module I — Matrices, Eigenvalues and Decompositions

Approximate teaching allocation: 10 lectures/hours.

### Topics

1. Characteristic Equations
2. Eigenvalues and Eigenvectors
3. Diagonalization
4. Applications to Differential Equations
5. Symmetric Matrices
6. Positive Definite Matrices
7. Similar Matrices
8. Singular Value Decomposition
9. Generalized Inverses

### Suggested prerequisite relationships

```text
Characteristic Equations
        ↓
Eigenvalues / Eigenvectors
        ↓
Diagonalization
        ├── Similar Matrices
        └── Differential Equations

Symmetric Matrices
        ↓
Positive Definite Matrices

Matrix foundations
        ↓
SVD
        ↓
Generalized Inverses / Pseudoinverse intuition
```

## 3. Module II — Vector Spaces

### Topics

1. Definition of Field
2. Vector Spaces
3. Elementary Properties in Vector Spaces
4. Subspaces
5. Linear Sum of Subspaces
6. Spanning Sets
7. Linear Dependence and Independence
8. Basis and Dimension
9. Applications to Matrices and Systems of Linear Equations

## 4. Module III — Inner Product Spaces

### Topics

1. Inner Product Spaces
2. Norms
3. Orthogonality
4. Projections and Subspaces
5. Orthogonal Complementary Subspaces
6. Orthogonal Projections
7. Gram-Schmidt Orthogonalization
8. Least Squares Approximations
9. QR Decomposition

## 5. Module IV — Linear Transformations

### Topics

1. Linear Transformations
2. Kernels and Images
3. Rank-Nullity Theorem
4. Matrix Representation of a Linear Transformation
5. Change of Basis
6. Linear Space of Linear Mappings

## 6. Topic Metadata Contract

Each topic should provide:

```ts
{
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  order: number;
  status: 'draft' | 'published' | 'archived';
  prerequisites: string[];
  learningObjectives: string[];
  difficulty: 'introductory' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  visualizationTypes: string[];
  sections: TopicSection[];
  examples: Example[];
  exercises: Exercise[];
  relatedTopics: string[];
}
```

## 7. Topic Status

- `draft`: not shown to normal learners.
- `published`: available in curriculum.
- `archived`: hidden from new navigation but preserved for references/history.

## 8. Visualization Mapping Guidelines

Common mappings include:

| Topic | Primary visualization |
|---|---|
| Characteristic equations | Matrix/eigenvalue parameter plot or transformation context |
| Eigenvalues/eigenvectors | Transformation + invariant directions |
| Diagonalization | Basis-change + diagonal action |
| Differential equations | Vector field / trajectory |
| Symmetric matrices | Orthogonal eigen-directions |
| Positive definite | Quadratic surface |
| Similar matrices | Same transformation under different bases |
| SVD | Unit sphere → ellipsoid |
| Generalized inverses | Projection / closest solution geometry |
| Subspaces | Lines/planes/spans |
| Linear independence | Reachable span + dependency visualization |
| Basis/dimension | Basis vectors + coordinates |
| Projection | Perpendicular drop to subspace |
| Gram-Schmidt | Sequential removal of projections |
| Least squares | Data → projection onto column space |
| QR | Original columns → orthonormal columns |
| Linear transformations | Grid deformation / vectors |
| Kernel/image | Domain → codomain mapping |
| Rank-nullity | Dimension mapping |
| Change of basis | Coordinate frame transformation |

## 9. Prerequisite Policy

Prerequisites are explanatory guidance, not a hard blocker in the first release.

A learner may open any topic, but the UI should recommend prerequisites when missing context is likely to cause confusion.
