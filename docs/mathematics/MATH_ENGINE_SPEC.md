# MATH_ENGINE_SPEC.md

## 1. Purpose

The math engine is the canonical deterministic computation layer.

It must be independent from React, Three.js, UI, and AI provider code.

## 2. Design Principles

- Pure functions where practical.
- Typed inputs/outputs.
- Explicit dimension validation.
- Explicit failure states.
- No UI concerns.
- No formatting concerns.
- Tolerance-aware numerical operations.
- Reusable canonical implementations.

## 3. Core Domains

```text
vector/
matrix/
linear-systems/
subspaces/
basis/
eigen/
projection/
orthogonality/
decomposition/
differential-equations/
```

## 4. Vector Operations

Canonical operations should include:

```text
add(v, w)
subtract(v, w)
scale(v, scalar)
dot(v, w)
norm(v)
normalize(v)
cross(v, w)          // 3D only
angle(v, w)
distance(v, w)
```

Validate matching dimensions.

Normalization of a near-zero vector must return an explicit error/result state.

## 5. Matrix Operations

Canonical operations:

```text
add(A, B)
subtract(A, B)
scale(A, scalar)
multiply(A, B)
multiplyVector(A, v)
transpose(A)
determinant(A)
inverse(A)
trace(A)
rank(A)
rref(A)
```

Dimension checks are mandatory.

## 6. Linear Systems

Support:

```text
solve(A, b)
rrefAugmented(A, b)
```

Solutions should distinguish:

```text
unique
none
infinitely-many
```

When returning parametric solutions, use an explicit structured representation.

## 7. Eigenvalues / Eigenvectors

Provide APIs conceptually equivalent to:

```text
eigenvalues(A)
eigenvectors(A)
eigensystem(A)
```

Outputs should distinguish:

- numerical eigenvalues,
- eigenvectors,
- multiplicity where supported,
- whether a complete eigenbasis was found.

Do not claim diagonalizability solely from the number of distinct eigenvalues when multiplicity matters.

## 8. Diagonalization

Provide:

```text
diagonalize(A)
```

Result should identify whether:

```text
A = P D P^-1
```

was successfully constructed.

If not diagonalizable, return a structured reason rather than a fabricated decomposition.

## 9. Subspaces

Support calculations for:

```text
span
basisFromColumns
columnSpace
rowSpace
nullSpace
orthogonalComplement
```

## 10. Projection

Support:

```text
projectVectorOntoVector(v, u)
projectVectorOntoSubspace(v, basis)
```

Projection should distinguish dependent/non-basis inputs and use an orthonormalized basis internally where needed.

## 11. Gram-Schmidt

Support classical and/or numerically stable modified Gram-Schmidt as specified by the implementation.

Output should include:

```text
input vectors
orthogonal vectors
orthonormal vectors
projection steps
failure/degeneracy information
```

## 12. QR Decomposition

Support:

```text
qr(A)
```

Result:

```text
Q
R
reconstruction error
full/reduced mode if implemented
```

## 13. SVD

Support:

```text
svd(A)
```

Result should provide:

```text
U
Sigma
V / V^T according to API convention
singular values
reconstruction diagnostics
```

The convention must be documented once and used everywhere.

## 14. Pseudoinverse

Support:

```text
pseudoInverse(A)
```

It should be based on the project's canonical SVD/numerical strategy.

## 15. Differential Equations

Where included, support matrix-system analysis such as:

```text
x' = A x
```

The initial implementation may focus on qualitative/eigenvalue-driven trajectory visualization rather than a general symbolic ODE system.

## 16. Result/Error Model

Prefer structured results over throwing for expected mathematical failures.

Conceptually:

```ts
Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: MathError };
```

Examples of errors:

```text
InvalidDimension
NonSquareMatrix
SingularMatrix
ZeroVector
NumericallyUnstable
UnsupportedOperation
InvalidInput
NotDiagonalizable
```

## 17. Verification

The math engine must be tested independently from visualizations.

Visualization correctness should be checked by comparing against math-engine outputs rather than duplicating calculations inside the renderer.
