# NUMERICAL_POLICY.md

## Purpose

Define consistent numerical behavior across the platform.

## 1. Floating Point

The application uses floating-point numerical computation unless a symbolic subsystem is explicitly used.

Never assume mathematically exact values survive floating-point computation.

## 2. Tolerance

Centralize numerical tolerances in one module/configuration.

Do not scatter arbitrary constants such as `1e-9` throughout the codebase.

Use named concepts such as:

```text
ZERO_TOLERANCE
ORTHOGONALITY_TOLERANCE
RANK_TOLERANCE
SINGULAR_VALUE_TOLERANCE
```

Exact default values should be established by implementation benchmarks and documented in code.

## 3. Comparisons

Prefer:

```text
abs(a - b) <= tolerance
```

rather than:

```text
a === b
```

for computed floating-point quantities.

For relative comparisons, use a combined absolute/relative tolerance appropriate to the operation.

## 4. Rank

Rank should be tolerance-aware.

For SVD-based rank:

```text
rank = count(sigma_i > rank_threshold)
```

The threshold must be dimension/scale-aware where appropriate.

## 5. Orthogonality

Do not decide orthogonality solely from exact zero dot products.

Use a scale-aware tolerance.

## 6. Normalization

Before computing:

```text
v / ||v||
```

check that `||v||` is not below the configured zero tolerance.

## 7. Singular Matrices

Inverse operations must detect numerical singularity.

Do not produce an apparently valid inverse from an unstable computation.

## 8. Eigenvalues

Repeated/near-repeated eigenvalues require care.

The application must not imply distinct eigendirections merely because numerically close values differ by tiny floating-point noise.

## 9. SVD

Small singular values may be numerically indistinguishable from zero.

Pseudoinverse calculations must zero values below the configured cutoff rather than explode them through reciprocal operations.

## 10. Degenerate Geometry

Handle explicitly:

- zero-length vectors,
- collinear vectors used as a plane basis,
- coincident points,
- zero-area triangles/surfaces,
- rank-deficient matrices.

A visualizer must fail gracefully rather than render invalid geometry.

## 11. Diagnostics

For advanced decompositions, expose diagnostics where useful:

```text
reconstruction error
orthogonality error
residual norm
condition-warning
```

Do not overwhelm introductory learners; diagnostics can be shown in an advanced/details section.

## 12. Reproducibility

Where randomized numerical algorithms are ever introduced, seed them or make the randomness deterministic for tests.
