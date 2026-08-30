# TEST_MATRIX.md

## 1. Purpose

Define what must be tested as the platform grows.

## 2. Test Layers

```text
Unit
 ↓
Integration
 ↓
E2E
 ↓
Browser/visual verification
```

## 3. Coverage Matrix

| Area | Unit | Integration | E2E | Browser/Visual |
|---|---:|---:|---:|---:|
| Vector operations | ✓ |  |  |  |
| Matrix operations | ✓ |  |  |  |
| RREF/rank | ✓ | ✓ |  |  |
| Eigenvalues/eigenvectors | ✓ | ✓ | ✓ | ✓ |
| Diagonalization | ✓ | ✓ | ✓ | ✓ |
| Projection | ✓ | ✓ | ✓ | ✓ |
| Gram-Schmidt | ✓ | ✓ | ✓ | ✓ |
| QR | ✓ | ✓ | ✓ | ✓ |
| SVD | ✓ | ✓ | ✓ | ✓ |
| Pseudoinverse | ✓ | ✓ | ✓ | ✓ |
| Topic registry | ✓ | ✓ | ✓ |  |
| Topic page |  | ✓ | ✓ | ✓ |
| Visualizer controls |  | ✓ | ✓ | ✓ |
| Playground | ✓ | ✓ | ✓ | ✓ |
| Auth/progress |  | ✓ | ✓ |  |

## 4. Math Test Cases

Each algorithm should test:

- standard valid input,
- boundary conditions,
- invalid dimensions,
- degenerate input,
- near-zero numerical values,
- known textbook examples.

## 5. Visualization Test Cases

Every major visualizer should verify:

- initial scene,
- camera interaction,
- control interaction,
- reset,
- resize,
- animation,
- invalid input,
- numerical label correctness.

## 6. Golden Dataset

Maintain canonical problems under:

```text
tests/golden/
```

Suggested cases:

```text
eigenvalues-basic
repeated-eigenvalue
not-diagonalizable
projection-2d
projection-3d
gram-schmidt-dependent
least-squares-basic
qr-basic
svd-2x2
rank-deficient
kernel-image
rank-nullity
basis-change
```

## 7. Regression Policy

A bug fix should add a regression test whenever practical.

A changed AI prompt should run the golden dataset.

A changed math algorithm should run all dependent mathematical tests.

A changed visualization primitive should run all visualizers that consume it.

## 8. Browser Matrix

Primary supported browsers for E2E/browser verification:

- Chromium,
- Firefox,
- WebKit/Safari-equivalent testing.

## 9. Completion Rule

Do not mark a feature complete solely because the app compiles.
