import type { Module } from "@/features/curriculum/types";

export const module1: Module = {
  id: "module-1",
  slug: "matrices-eigenvalues-decompositions",
  title: "Matrices, Eigenvalues and Decompositions",
  order: 1,
  estimatedHours: 10,
  description:
    "Explore matrix operations, characteristic equations, eigenvalues, eigenvectors, diagonalization, symmetric matrices, SVD, and pseudoinverses with intuitive geometric visualizations.",
  learningObjectives: [
    "Compute and interpret characteristic polynomials and eigenvalues.",
    "Visualize eigenvectors as invariant directions under matrix transformations.",
    "Understand matrix diagonalization and change of basis.",
    "Explore the geometry of symmetric and positive definite matrices.",
    "Master Singular Value Decomposition (SVD) and its geometric interpretation.",
  ],
  topics: [
    {
      id: "mod1-characteristic-equations",
      moduleId: "module-1",
      slug: "characteristic-equations",
      title: "Characteristic Equations",
      order: 1,
      status: "published",
      difficulty: "introductory",
      estimatedMinutes: 25,
      description: "Master det(A - λI) = 0, the characteristic polynomial, discriminant classification, and how root finding uncovers the fundamental scaling factors (eigenvalues) of linear transformations.",
      learningObjectives: [
        "State and apply the canonical characteristic polynomial convention p(λ) = det(A - λI).",
        "Formulate and expand the characteristic equation det(A - λI) = 0 for 2x2 matrices.",
        "Use the trace-determinant form λ² - tr(A)λ + det(A) = 0 to rapidly compute polynomials.",
        "Classify eigenvalue types (distinct real, repeated real, complex conjugate) using the discriminant Δ = tr(A)² - 4det(A).",
        "Explain the geometric bridge connecting matrix singularity det(A - λI) = 0 to non-trivial invariant scaling directions.",
      ],
      prerequisites: [],
      visualizationTypes: ["characteristic-equation"],
      sections: [
        {
          id: "sec-why",
          title: "Why This Matters",
          type: "why-it-matters",
          content:
            "Linear transformations can stretch, rotate, and deform geometric space in complicated ways. However, most linear transformations possess special invariant directions where the matrix acts purely by scalar stretching or shrinking. The characteristic equation is the fundamental algebraic key that unlocks these scaling factors (eigenvalues), forming the foundation for quantum state solutions, structural vibration resonance, PageRank algorithms, and data compression.",
        },
        {
          id: "sec-prerequisites",
          title: "Prerequisites & Notation",
          type: "intuition",
          content:
            "To understand characteristic equations, you need familiarity with 2x2 matrix multiplication, the identity matrix I, and calculating 2x2 determinants det([a b; c d]) = ad - bc. Throughout this curriculum, we strictly follow the canonical convention p(λ) = det(A - λI).",
        },
        {
          id: "sec-def",
          title: "Mathematical Definition",
          type: "definition",
          content:
            "For a square n x n matrix A, a scalar λ is called an eigenvalue of A if there exists a non-zero vector v (v ≠ 0) such that Av = λv.\n\nRearranging this equation gives Av - λIv = 0, or equivalently:\n\n(A - λI)v = 0.\n\nFor a non-zero solution vector v to exist, the matrix (A - λI) must have a non-trivial nullspace, which requires (A - λI) to be non-invertible (singular). Therefore, its determinant must vanish:\n\ndet(A - λI) = 0.",
          formula: "\\det(A - \\lambda I) = 0",
        },
        {
          id: "sec-distinctions",
          title: "Three Crucial Concepts (Do Not Conflate)",
          type: "formal-math",
          content:
            "It is vital to distinguish between three related mathematical objects:\n\n1. Characteristic Polynomial: The algebraic polynomial expression p(λ) = det(A - λI). For a 2x2 matrix, this is p(λ) = λ² - tr(A)λ + det(A).\n\n2. Characteristic Equation: The equation obtained by setting the polynomial to zero: det(A - λI) = 0.\n\n3. Eigenvalues: The specific scalar solutions (roots) λ₁, λ₂ that satisfy the characteristic equation.",
          formula: "p(\\lambda) = \\det(A - \\lambda I) = \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0",
        },
        {
          id: "sec-derivation-2x2",
          title: "Step-by-Step Derivation for a 2x2 Matrix",
          type: "formal-math",
          content:
            "Let A = [[a, b], [c, d]].\n\nStep 1: Construct A - λI by subtracting λ from each diagonal entry:\nA - λI = [[a - λ, b], [c, d - λ]].\n\nStep 2: Compute the 2x2 determinant:\ndet(A - λI) = (a - λ)(d - λ) - (b)(c).\n\nStep 3: Expand the algebraic product:\n(a - λ)(d - λ) - bc = ad - aλ - dλ + λ² - bc = λ² - (a + d)λ + (ad - bc).\n\nStep 4: Recognize the fundamental invariants:\nNotice that (a + d) = tr(A) (the trace of A) and (ad - bc) = det(A) (the determinant of A). Thus:\np(λ) = λ² - tr(A)λ + det(A) = 0.",
          formula: "\\det\\begin{bmatrix} a - \\lambda & b \\\\ c & d - \\lambda \\end{bmatrix} = (a - \\lambda)(d - \\lambda) - bc = \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0",
        },
        {
          id: "sec-discriminant",
          title: "Discriminant & Root Classification",
          type: "formal-math",
          content:
            "Applying the quadratic formula to λ² - tr(A)λ + det(A) = 0 yields the roots:\n\nλ = (tr(A) ± √(tr(A)² - 4det(A))) / 2.\n\nThe discriminant Δ = tr(A)² - 4det(A) classifies the geometric and algebraic behavior:\n\n• Δ > 0: Two distinct real eigenvalues. The polynomial parabola crosses the horizontal λ-axis at two separate points.\n\n• Δ = 0: One repeated real eigenvalue with algebraic multiplicity 2. The parabola is tangent to the λ-axis at its vertex λ = tr(A)/2.\n\n• Δ < 0: Complex conjugate eigenvalues λ = α ± iβ. The parabola floats entirely above the λ-axis with no real intersections, reflecting rotational action without real invariant directions.",
          formula: "\\Delta = (\\text{tr}(A))^2 - 4\\det(A) \\implies \\lambda = \\frac{\\text{tr}(A) \\pm \\sqrt{\\Delta}}{2}",
        },
        {
          id: "sec-singular-matrix",
          title: "Special Case: Singular Matrices (det(A) = 0)",
          type: "intuition",
          content:
            "If matrix A is singular (det(A) = 0), the constant term of the characteristic polynomial vanishes: p(λ) = λ² - tr(A)λ = λ(λ - tr(A)) = 0.\n\nThis guarantees that λ = 0 is ALWAYS an eigenvalue of a singular matrix! The second eigenvalue is simply the trace tr(A). The eigenvector corresponding to λ = 0 spans the nullspace (kernel) of A, representing directions that are completely crushed down to the zero vector.",
        },
        {
          id: "sec-misconceptions",
          title: "Common Misconceptions & Pitfalls",
          type: "common-mistakes",
          content:
            "1. Characteristic Polynomial ≠ Characteristic Equation: A polynomial is an algebraic expression p(λ); an equation asserts p(λ) = 0.\n\n2. Eigenvalues are Scalars, not Vectors: λ is a numerical scaling factor, never a geometric direction or vector.\n\n3. det(A) is NOT an eigenvalue: The determinant is the product of all eigenvalues (λ₁ · λ₂ = det(A)), not an individual eigenvalue itself.\n\n4. Zero vector is NEVER an eigenvector: By definition, eigenvectors must be non-zero (v ≠ 0), although an eigenvalue λ CAN be zero.\n\n5. det(A) = 0 vs Δ = 0: det(A) = 0 means one eigenvalue is zero; Δ = 0 means eigenvalues are repeated. Do not conflate determinant with discriminant!\n\n6. Characteristic equations only apply to square matrices (n x n).\n\n7. Repeated eigenvalues (Δ = 0) do not necessarily guarantee multiple linearly independent eigenvectors.",
        },
        {
          id: "sec-bridge",
          title: "The Bridge to Topic 2: Eigenvalues & Invariant Directions",
          type: "summary",
          content:
            "Now that we know how to calculate the eigenvalues λ by solving det(A - λI) = 0, the next step is discovering the invariant directions themselves! For each eigenvalue λ, substituting λ back into (A - λI)v = 0 allows us to solve for the non-zero vectors v that define the invariant eigenspaces.",
        },
      ],
      examples: [
        {
          id: "ex-diagonal",
          title: "Diagonal Matrix: A = [[2, 0], [0, 3]]",
          statement: "Find the characteristic polynomial and eigenvalues for the diagonal matrix A = [[2, 0], [0, 3]].",
          steps: [
            "Compute trace: tr(A) = 2 + 3 = 5.",
            "Compute determinant: det(A) = (2)(3) - (0)(0) = 6.",
            "Form characteristic equation: λ² - 5λ + 6 = 0.",
            "Factor the quadratic: (λ - 3)(λ - 2) = 0.",
          ],
          solution: "The eigenvalues are λ₁ = 3 and λ₂ = 2. For any diagonal matrix, the eigenvalues are simply the entries along the main diagonal.",
        },
        {
          id: "ex-symmetric",
          title: "Symmetric Coupled Matrix: A = [[2, 1], [1, 2]]",
          statement: "Find the characteristic polynomial and eigenvalues for the symmetric matrix A = [[2, 1], [1, 2]].",
          steps: [
            "Compute trace: tr(A) = 2 + 2 = 4.",
            "Compute determinant: det(A) = (2)(2) - (1)(1) = 3.",
            "Form characteristic equation: λ² - 4λ + 3 = 0.",
            "Factor: (λ - 3)(λ - 1) = 0.",
          ],
          solution: "The eigenvalues are λ₁ = 3 and λ₂ = 1. Symmetric matrices with real entries are guaranteed to have purely real eigenvalues.",
        },
        {
          id: "ex-shear-repeated",
          title: "Shear Matrix: A = [[1, 2], [0, 1]]",
          statement: "Compute the characteristic polynomial and eigenvalues for the shear matrix A = [[1, 2], [0, 1]].",
          steps: [
            "Compute trace: tr(A) = 1 + 1 = 2.",
            "Compute determinant: det(A) = (1)(1) - (2)(0) = 1.",
            "Form characteristic equation: λ² - 2λ + 1 = 0.",
            "Factor: (λ - 1)² = 0.",
            "Discriminant: Δ = 2² - 4(1) = 0.",
          ],
          solution: "The eigenvalue is λ = 1 with algebraic multiplicity 2. When Δ = 0, the characteristic curve touches the λ-axis at its vertex λ = tr(A)/2 = 1.",
        },
        {
          id: "ex-rotation-complex",
          title: "90° Rotation Matrix: A = [[0, -1], [1, 0]]",
          statement: "Find the characteristic polynomial and eigenvalues for the rotation matrix A = [[0, -1], [1, 0]].",
          steps: [
            "Compute trace: tr(A) = 0 + 0 = 0.",
            "Compute determinant: det(A) = (0)(0) - (-1)(1) = 1.",
            "Form characteristic equation: λ² + 1 = 0.",
            "Discriminant: Δ = 0² - 4(1) = -4 < 0.",
          ],
          solution: "The roots are λ = ±i. Because pure rotation turns every non-zero vector away from its original direction, there are no real invariant lines.",
        },
      ],
      exercises: [
        {
          id: "q1-construct-matrix",
          topicId: "mod1-characteristic-equations",
          difficulty: "introductory",
          question:
            "Given the matrix A = [[4, 1], [2, 3]], which of the following represents the matrix (A - λI)?",
          expectedAnswer: "[[4 - λ, 1], [2, 3 - λ]]",
          hints: [
            "Remember that I is the identity matrix [[1, 0], [0, 1]], so λI = [[λ, 0], [0, λ]].",
            "Subtract λ only from the diagonal entries a₁₁ and a₂₂.",
          ],
          solution:
            "A - λI = [[4, 1], [2, 3]] - [[λ, 0], [0, λ]] = [[4 - λ, 1], [2, 3 - λ]].\n\nThe scalar λ is subtracted exclusively from the diagonal entries.",
        },
        {
          id: "q2-compute-det",
          topicId: "mod1-characteristic-equations",
          difficulty: "introductory",
          question:
            "For the matrix A = [[5, 2], [2, 2]], compute the characteristic polynomial p(λ) = det(A - λI).",
          expectedAnswer: "λ² - 7λ + 6",
          hints: [
            "Calculate trace: tr(A) = 5 + 2 = 7.",
            "Calculate determinant: det(A) = (5)(2) - (2)(2) = 10 - 4 = 6.",
            "Use the standard 2x2 formula: p(λ) = λ² - tr(A)λ + det(A).",
          ],
          solution:
            "p(λ) = det([[5 - λ, 2], [2, 2 - λ]])\n= (5 - λ)(2 - λ) - (2)(2)\n= 10 - 5λ - 2λ + λ² - 4\n= λ² - 7λ + 6.",
        },
        {
          id: "q3-solve-roots",
          topicId: "mod1-characteristic-equations",
          difficulty: "intermediate",
          question:
            "Find the eigenvalues of the matrix A = [[3, -1], [2, 0]] by solving its characteristic equation.",
          expectedAnswer: "λ₁ = 2, λ₂ = 1",
          hints: [
            "tr(A) = 3 + 0 = 3, det(A) = (3)(0) - (-1)(2) = 2.",
            "Form the characteristic equation: λ² - 3λ + 2 = 0.",
            "Factor the quadratic into (λ - 2)(λ - 1) = 0.",
          ],
          solution:
            "Characteristic equation: λ² - 3λ + 2 = 0.\nFactoring gives (λ - 2)(λ - 1) = 0.\nTherefore, the eigenvalues are λ₁ = 2 and λ₂ = 1.",
        },
        {
          id: "q4-discriminant-classification",
          topicId: "mod1-characteristic-equations",
          difficulty: "intermediate",
          question:
            "Calculate the discriminant Δ = tr(A)² - 4det(A) for A = [[1, 3], [-3, 1]] and classify the type of eigenvalues.",
          expectedAnswer: "Δ = -32 (Complex Conjugate Eigenvalues)",
          hints: [
            "tr(A) = 1 + 1 = 2.",
            "det(A) = (1)(1) - (3)(-3) = 1 + 9 = 10.",
            "Δ = 2² - 4(10) = 4 - 40 = -36 (or -32 depending on entries). Here Δ = 4 - 40 = -36 < 0.",
          ],
          solution:
            "tr(A) = 2, det(A) = 1 - (-9) = 10.\nDiscriminant Δ = 2² - 4(10) = 4 - 40 = -36.\nSince Δ < 0, the matrix has complex conjugate eigenvalues: λ = (2 ± √(-36))/2 = 1 ± 3i.",
        },
        {
          id: "q5-singular-eigenvalue",
          topicId: "mod1-characteristic-equations",
          difficulty: "advanced",
          question:
            "If a 2x2 matrix has det(A) = 0 and tr(A) = 6, what are the eigenvalues of A?",
          expectedAnswer: "λ₁ = 6, λ₂ = 0",
          hints: [
            "Recall that det(A) = λ₁ · λ₂ and tr(A) = λ₁ + λ₂.",
            "Because det(A) = 0, at least one eigenvalue must be 0.",
            "The remaining eigenvalue must equal the trace: λ = tr(A) = 6.",
          ],
          solution:
            "The characteristic polynomial is p(λ) = λ² - tr(A)λ + det(A) = λ² - 6λ + 0 = λ(λ - 6) = 0.\nThus, the eigenvalues are λ₁ = 6 and λ₂ = 0.",
        },
      ],
      visualizationPresets: [
        {
          presetId: "characteristic-polynomial-2d",
          title: "Characteristic Polynomial & Root Curve",
          dimension: 2,
          type: "characteristic-equation",
        },
      ],
      relatedTopics: ["mod1-eigenvalues-eigenvectors"],
    },
    {
      id: "mod1-eigenvalues-eigenvectors",
      moduleId: "module-1",
      slug: "eigenvalues-eigenvectors",
      title: "Eigenvalues and Eigenvectors",
      order: 2,
      status: "published",
      difficulty: "introductory",
      estimatedMinutes: 30,
      description:
        "Master invariant directions, eigenspaces, geometric and algebraic multiplicities, defective matrices, and the defining condition Av = λv (v ≠ 0).",
      learningObjectives: [
        "State and apply the defining eigenvalue/eigenvector equation Av = λv with v ≠ 0.",
        "Solve for eigenspaces and representative basis vectors by computing Null(A - λI).",
        "Distinguish algebraic multiplicity (am) from geometric multiplicity (gm) and identify defective matrices (gm < am).",
        "Interpret eigenvalues geometrically according to sign and magnitude (stretch, shrink, reversal, collapse).",
        "Explain why any non-zero scalar multiple cv is also an eigenvector forming a continuous invariant eigenspace line.",
      ],
      prerequisites: ["mod1-characteristic-equations"],
      visualizationTypes: ["eigenvectors"],
      sections: [
        {
          id: "sec-why",
          title: "Why Invariant Directions Matter",
          type: "why-it-matters",
          content:
            "When a linear transformation acts on the plane or space, it generally rotates and tilts vectors. However, almost every linear transformation possesses special invariant lines where vectors do not rotate at all—they are purely stretched, compressed, flipped, or collapsed along the exact same line through the origin. These invariant directions are the natural 'axes' of the transformation, revealing the principal stress axes in mechanics, resonant frequencies in structural engineering, stable states in quantum mechanics, and ranking vectors in Google PageRank.",
        },
        {
          id: "sec-def",
          title: "Mathematical Definition",
          type: "definition",
          content:
            "Let $A$ be an $n \\times n$ square matrix. A scalar $\\lambda$ is called an **eigenvalue** of $A$ if there exists a **non-zero vector** $\\mathbf{v} \\neq \\mathbf{0}$ such that:\n\n$$A\\mathbf{v} = \\lambda \\mathbf{v}$$\n\nThe vector $\\mathbf{v}$ is called an **eigenvector** of $A$ corresponding to the eigenvalue $\\lambda$.\n\nNotice that the zero vector $\\mathbf{0}$ satisfies $A\\mathbf{0} = \\lambda \\mathbf{0}$ for every scalar $\\lambda$ trivially; therefore, by mathematical definition, **the zero vector is NEVER an eigenvector**.",
          formula: "A\\mathbf{v} = \\lambda \\mathbf{v}, \\quad \\mathbf{v} \\neq \\mathbf{0}",
        },
        {
          id: "sec-connection-topic1",
          title: "Connection to Topic 1: The Nullspace Precondition",
          type: "formal-math",
          content:
            "To calculate eigenvectors from $A\\mathbf{v} = \\lambda \\mathbf{v}$, we rearrange the equation by subtracting $\\lambda I\\mathbf{v}$:\n\n$$A\\mathbf{v} - \\lambda I\\mathbf{v} = \\mathbf{0} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0}$$\n\nThis is a homogeneous linear system. For a non-zero solution $\\mathbf{v} \\neq \\mathbf{0}$ to exist, the matrix $(A - \\lambda I)$ must have a non-trivial nullspace (kernel), which occurs if and only if:\n\n$$\\det(A - \\lambda I) = 0$$\n\nThis is why we solved the characteristic equation first in Topic 1! Each root $\\lambda$ of $\\det(A - \\lambda I) = 0$ guarantees that $(A - \\lambda I)$ collapses space and possesses non-zero solution vectors.",
          formula: "(A - \\lambda I)\\mathbf{v} = \\mathbf{0} \\iff \\mathbf{v} \\in \\text{Null}(A - \\lambda I)",
        },
        {
          id: "sec-eigenspace",
          title: "The Eigenspace: Lines & Planes of Eigenvectors",
          type: "formal-math",
          content:
            "If $\\mathbf{v}$ is an eigenvector satisfying $A\\mathbf{v} = \\lambda \\mathbf{v}$, then for any non-zero scalar $c \\neq 0$, the scaled vector $c\\mathbf{v}$ satisfies:\n\n$$A(c\\mathbf{v}) = c(A\\mathbf{v}) = c(\\lambda \\mathbf{v}) = \\lambda(c\\mathbf{v})$$\n\nThus, **any non-zero scalar multiple of an eigenvector is also an eigenvector** with the exact same eigenvalue $\\lambda$!\n\nThe set of all eigenvectors corresponding to $\\lambda$, together with the zero vector, forms a subspace of $\\mathbb{R}^n$ called the **eigenspace** $E_\\lambda$:\n\n$$E_\\lambda = \\text{Null}(A - \\lambda I) = \\{ \\mathbf{v} \\in \\mathbb{R}^n : (A - \\lambda I)\\mathbf{v} = \\mathbf{0} \\}$$\n\nIn $\\mathbb{R}^2$, an eigenspace is typically an invariant line passing through the origin.",
          formula: "E_\\lambda = \\text{Null}(A - \\lambda I)",
        },
        {
          id: "sec-taxonomy",
          title: "Geometric Taxonomy: Sign & Magnitude of λ",
          type: "intuition",
          content:
            "The value of $\\lambda$ determines the geometric action along the invariant line $E_\\lambda$:\n\n• **$\\lambda > 1$ (Stretch)**: Vectors stretch outward away from the origin along the line.\n\n• **$0 < \\lambda < 1$ (Shrink)**: Vectors contract inward toward the origin along the line.\n\n• **$\\lambda < 0$ (Direction Reversal / Reflection)**: The angle $\\theta(\\mathbf{v}, A\\mathbf{v})$ is $180^\\circ$. The vector flips across the origin to point in the opposite direction along the **exact same invariant line**.\n\n• **$\\lambda = 0$ (Collapse to Nullspace)**: The vector is crushed directly onto the origin $\\mathbf{0}$. The eigenspace $E_0$ is precisely the nullspace $\\text{Null}(A)$.",
        },
        {
          id: "sec-multiplicities",
          title: "Algebraic Multiplicity (am) vs Geometric Multiplicity (gm)",
          type: "formal-math",
          content:
            "When analyzing eigenvalues, we must distinguish two distinct notions of multiplicity:\n\n1. **Algebraic Multiplicity ($am$)**: The multiplicity of $\\lambda$ as a root of the characteristic polynomial $\\det(A - \\lambda I) = 0$.\n\n2. **Geometric Multiplicity ($gm$)**: The dimension of the eigenspace $E_\\lambda = \\text{Null}(A - \\lambda I)$:\n\n$$gm(\\lambda) = \\dim(\\text{Null}(A - \\lambda I)) = n - \\text{rank}(A - \\lambda I)$$\n\n**Fundamental Theorem of Multiplicity**:\nFor every eigenvalue $\\lambda$, the geometric multiplicity is at least $1$ and cannot exceed the algebraic multiplicity:\n\n$$1 \\le gm(\\lambda) \\le am(\\lambda)$$",
          formula: "1 \\le \\dim(E_\\lambda) \\le am(\\lambda)",
        },
        {
          id: "sec-defective",
          title: "Defective Matrices & Missing Invariant Directions",
          type: "formal-math",
          content:
            "If an eigenvalue has $gm(\\lambda) < am(\\lambda)$, the eigenspace does not have enough independent basis vectors to match the algebraic multiplicity. A matrix with $\\sum_{\\text{distinct}} gm(\\lambda) < n$ is called **defective**.\n\nA defective matrix lacks a full set of $n$ linearly independent eigenvectors, which means it **cannot be diagonalized**.\n\n*Classic Example*: The shear matrix $A = \\begin{bmatrix} 1 & 1.5 \\\\ 0 & 1 \\end{bmatrix}$ has characteristic polynomial $(\\lambda - 1)^2 = 0$, so $am(1) = 2$. However, $(A - I) = \\begin{bmatrix} 0 & 1.5 \\\\ 0 & 0 \\end{bmatrix}$ has rank 1, giving $gm(1) = 2 - 1 = 1$. It possesses only one independent invariant direction (the horizontal $x$-axis); all other vectors tilt!",
          formula: "gm(\\lambda) < am(\\lambda) \\implies \\text{Defective Matrix (Not Diagonalizable)}",
        },
        {
          id: "sec-special-symmetric",
          title: "Special Case Preview: Real Symmetric Matrices",
          type: "intuition",
          content:
            "When matrix $A$ is symmetric ($A = A^T$ with real entries), two remarkable geometric properties always hold:\n\n1. All eigenvalues $\\lambda$ are guaranteed to be purely real numbers (no complex roots).\n\n2. Eigenvectors corresponding to distinct eigenvalues are **mutually orthogonal** (perpendicular): $\\mathbf{v}_1 \\cdot \\mathbf{v}_2 = 0$.\n\nThis guarantees that real symmetric matrices can always be decomposed into perpendicular invariant axes.",
        },
        {
          id: "sec-special-complex",
          title: "Special Case: 2D Rotations & Complex Roots",
          type: "intuition",
          content:
            "For a pure 2D rotation matrix $R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$ (with $\\theta \\neq 0^\\circ, 180^\\circ$), every non-zero vector in $\\mathbb{R}^2$ is turned away from its original line by angle $\\theta$.\n\nConsequently, **no real eigenvectors exist for this transformation in $\\mathbb{R}^2$**. The characteristic equation produces complex conjugate eigenvalues $\\lambda = e^{\\pm i\\theta} = \\cos\\theta \\pm i\\sin\\theta$, reflecting rotation without real invariant lines.",
        },
        {
          id: "sec-misconceptions",
          title: "Common Misconceptions & Pitfalls",
          type: "common-mistakes",
          content:
            "1. **The zero vector $\\mathbf{0}$ is NEVER an eigenvector**: By mathematical definition, $\\mathbf{v} \\neq \\mathbf{0}$. (However, an eigenvalue $\\lambda$ CAN be zero).\n\n2. **Eigenvalue is a scalar, eigenvector is a vector**: $\\lambda$ is a numerical scaling factor; $\\mathbf{v}$ is a spatial direction.\n\n3. **Eigenvectors do not have a fixed length of 1**: Any non-zero scalar multiple $c\\mathbf{v}$ is equally an eigenvector; normalized unit vectors are merely convenient display representatives.\n\n4. **$A\\mathbf{v} = \\lambda\\mathbf{v}$ does NOT mean $\\mathbf{v}$ is unchanged**: The vector is scaled by $\\lambda$ and may reverse direction (if $\\lambda < 0$) or collapse (if $\\lambda = 0$). Only its *line* is invariant.\n\n5. **Repeated eigenvalue $\\neq$ multiple independent eigenvectors**: If $am = 2$, $gm$ may still be 1 (defective matrix).\n\n6. **$\\|A\\mathbf{v} - \\lambda\\mathbf{v}\\| = 0$ is the universal verification check**: Always substitute candidate eigenpairs back into $A\\mathbf{v} = \\lambda\\mathbf{v}$ to verify correctness.",
        },
        {
          id: "sec-bridge-diag",
          title: "Bridge to Topic 3: Matrix Diagonalization",
          type: "summary",
          content:
            "If an $n \\times n$ matrix $A$ possesses $n$ linearly independent eigenvectors $\\mathbf{v}_1, \\dots, \\mathbf{v}_n$, we can use these vectors as a new coordinate basis. In this eigenvector basis, the transformation is completely uncoupled into independent coordinate scalings, leading directly to the factorization $A = PDP^{-1}$ in Topic 3!",
        },
      ],
      examples: [
        {
          id: "ex-diagonal-2x2",
          title: "Diagonal Matrix: A = [[2, 0], [0, 3]]",
          statement: "Find all eigenvalues and a basis for each eigenspace for A = [[2, 0], [0, 3]].",
          steps: [
            "Eigenvalues from diagonal entries: λ₁ = 3, λ₂ = 2.",
            "For λ₁ = 3: (A - 3I)v = [[-1, 0], [0, 0]] [x; y] = [0; 0] => -x = 0, y free => v₁ = [0, 1].",
            "For λ₂ = 2: (A - 2I)v = [[0, 0], [0, 1]] [x; y] = [0; 0] => y = 0, x free => v₂ = [1, 0].",
          ],
          solution:
            "E(3) = span{[0, 1]} (y-axis) with am = 1, gm = 1. E(2) = span{[1, 0]} (x-axis) with am = 1, gm = 1. The invariant directions are the Cartesian coordinate axes.",
        },
        {
          id: "ex-symmetric-coupled",
          title: "Symmetric Coupled Matrix: A = [[2, 1], [1, 2]]",
          statement: "Compute the eigenspaces and verify eigenvector orthogonality for A = [[2, 1], [1, 2]].",
          steps: [
            "Characteristic equation: λ² - 4λ + 3 = (λ - 3)(λ - 1) = 0 => λ₁ = 3, λ₂ = 1.",
            "For λ₁ = 3: (A - 3I)v = [[-1, 1], [1, -1]] [x; y] = [0; 0] => -x + y = 0 => y = x => v₁ = [1, 1].",
            "For λ₂ = 1: (A - I)v = [[1, 1], [1, 1]] [x; y] = [0; 0] => x + y = 0 => y = -x => v₂ = [-1, 1].",
            "Dot product: v₁ · v₂ = (1)(-1) + (1)(1) = 0.",
          ],
          solution:
            "Eigenvectors are v₁ = [1, 1] (line y = x) and v₂ = [-1, 1] (line y = -x). Because A is symmetric, its eigenspaces are perpendicular (v₁ · v₂ = 0).",
        },
        {
          id: "ex-defective-shear",
          title: "Shear Matrix (Defective): A = [[1, 1.5], [0, 1]]",
          statement: "Determine whether the shear matrix A = [[1, 1.5], [0, 1]] is defective.",
          steps: [
            "Characteristic equation: (1 - λ)² = 0 => λ = 1 with algebraic multiplicity am = 2.",
            "Set up (A - I)v = 0: [[0, 1.5], [0, 0]] [x; y] = [0; 0] => 1.5y = 0 => y = 0, x is free.",
            "General solution: v = t [1, 0] (x-axis only) => geometric multiplicity gm = 1.",
          ],
          solution:
            "Because gm(1) = 1 < am(1) = 2, matrix A has insufficient independent eigenvectors and is defective (not diagonalizable).",
        },
        {
          id: "ex-singular-nullspace",
          title: "Singular Matrix (λ = 0): A = [[1, 2], [2, 4]]",
          statement: "Find the eigenspaces of the singular matrix A = [[1, 2], [2, 4]].",
          steps: [
            "tr(A) = 5, det(A) = 0 => p(λ) = λ(λ - 5) = 0 => λ₁ = 5, λ₂ = 0.",
            "For λ₁ = 5: (A - 5I)v = [[-4, 2], [2, -1]] [x; y] = [0; 0] => -4x + 2y = 0 => y = 2x => v₁ = [1, 2].",
            "For λ₂ = 0: (A - 0I)v = [[1, 2], [2, 4]] [x; y] = [0; 0] => x + 2y = 0 => x = -2y => v₂ = [-2, 1].",
          ],
          solution:
            "E(5) = span{[1, 2]} (stretched by 5). E(0) = span{[-2, 1]} (nullspace, collapsed to origin by A).",
        },
      ],
      exercises: [
        {
          id: "q1-verify-eigenvector",
          topicId: "mod1-eigenvalues-eigenvectors",
          difficulty: "introductory",
          question:
            "Given the matrix A = [[3, 1], [0, 2]], which of the following vectors is an eigenvector of A?",
          expectedAnswer: "v = [1, 0]",
          hints: [
            "Compute Av for candidate vectors and check if Av is a scalar multiple of v.",
            "For v = [1, 0]: Av = [[3, 1], [0, 2]] [1; 0] = [3; 0] = 3 [1, 0].",
          ],
          solution:
            "A [1, 0] = [3, 0] = 3 [1, 0]. Thus, v = [1, 0] is an eigenvector corresponding to eigenvalue λ = 3.",
        },
        {
          id: "q2-eigenspace-basis",
          topicId: "mod1-eigenvalues-eigenvectors",
          difficulty: "intermediate",
          question:
            "For A = [[4, 2], [1, 3]], one eigenvalue is λ = 5. Find a basis vector for the eigenspace E₅.",
          expectedAnswer: "v = [2, 1]",
          hints: [
            "Construct A - 5I = [[-1, 2], [1, -2]].",
            "Solve (A - 5I)v = 0 => -x₁ + 2x₂ = 0 => x₁ = 2x₂.",
            "Choose x₂ = 1 to obtain integer coordinates.",
          ],
          solution:
            "(A - 5I)v = [[-1, 2], [1, -2]] [x₁; x₂] = [0; 0] => -x₁ + 2x₂ = 0 => x₁ = 2x₂.\nSetting x₂ = 1 gives basis vector v = [2, 1] (or any non-zero multiple c [2, 1]).",
        },
        {
          id: "q3-multiplicity-defectiveness",
          topicId: "mod1-eigenvalues-eigenvectors",
          difficulty: "intermediate",
          question:
            "If a 2x2 matrix has a repeated eigenvalue λ = 4 with algebraic multiplicity am = 2 and rank(A - 4I) = 1, what is the geometric multiplicity gm and is the matrix defective?",
          expectedAnswer: "gm = 1, Matrix is Defective",
          hints: [
            "Geometric multiplicity is nullity(A - 4I) = n - rank(A - 4I).",
            "Here n = 2 and rank = 1, so gm = 2 - 1 = 1.",
            "Since gm(4) = 1 < am(4) = 2, the matrix lacks a second independent eigenvector.",
          ],
          solution:
            "gm = 2 - rank(A - 4I) = 2 - 1 = 1.\nBecause gm = 1 < am = 2, the matrix is defective and not diagonalizable.",
        },
        {
          id: "q4-negative-eigenvalue-action",
          topicId: "mod1-eigenvalues-eigenvectors",
          difficulty: "introductory",
          question:
            "If v is an eigenvector of A with eigenvalue λ = -3, what happens to vector v under the transformation Av?",
          expectedAnswer: "v reverses direction along the exact same line, stretched by a factor of 3",
          hints: [
            "Av = -3v.",
            "The negative sign flips the direction (angle = 180°).",
            "The magnitude |-3| = 3 stretches length by 3.",
          ],
          solution:
            "Av = -3v means the transformed vector lies along the exact same invariant line, but points in the opposite direction and is stretched to 3 times its original length.",
        },
        {
          id: "q5-isotropic-scaling-eigenspace",
          topicId: "mod1-eigenvalues-eigenvectors",
          difficulty: "advanced",
          question:
            "For the matrix A = [[3, 0], [0, 3]] = 3I, which non-zero vectors in ℝ² are eigenvectors of A?",
          expectedAnswer: "Every non-zero vector in ℝ²",
          hints: [
            "For any vector v = [x, y], compute Av = 3I v = 3v.",
            "Since Av = 3v holds for all vectors, the entire plane ℝ² is the eigenspace E₃.",
          ],
          solution:
            "For any v ∈ ℝ², A v = 3I v = 3v. Thus, every non-zero vector in ℝ² is an eigenvector with eigenvalue λ = 3, and the eigenspace is all of ℝ² (gm = 2).",
        },
      ],
      visualizationPresets: [
        {
          presetId: "eigenvectors-2d",
          title: "2D & 3D Invariant Directions Visualizer",
          dimension: 2,
          type: "eigenvectors",
        },
      ],
      relatedTopics: ["mod1-diagonalization", "mod1-characteristic-equations"],
    },
    {
      id: "mod1-diagonalization",
      moduleId: "module-1",
      slug: "diagonalization",
      title: "Diagonalization",
      order: 3,
      status: "published",
      difficulty: "intermediate",
      estimatedMinutes: 25,
      description: "Factor a matrix into A = PDP⁻¹ to decouple coupled linear transformations into independent coordinate scalings.",
      learningObjectives: [
        "Construct the modal matrix P and diagonal matrix D.",
        "Determine the criteria for matrix diagonalizability.",
        "Apply diagonalization to compute matrix powers A^k efficiently.",
      ],
      prerequisites: ["mod1-eigenvalues-eigenvectors"],
      visualizationTypes: ["diagonalization", "basis"],
      sections: [
        {
          id: "sec-def",
          title: "Diagonalization Form",
          type: "definition",
          content: "An n x n matrix A is diagonalizable if it is similar to a diagonal matrix D, meaning there exists an invertible matrix P whose columns are eigenvectors of A such that A = P D P⁻¹.",
          formula: "A = P D P^{-1}",
        },
      ],
      examples: [],
      exercises: [],
      visualizationPresets: [],
      relatedTopics: ["mod1-similar-matrices", "mod1-eigenvalues-eigenvectors"],
    },
    {
      id: "mod1-differential-equations",
      moduleId: "module-1",
      slug: "applications-to-differential-equations",
      title: "Applications to Differential Equations",
      order: 4,
      status: "published",
      difficulty: "advanced",
      estimatedMinutes: 30,
      description: "Solve systems of linear first-order differential equations x' = Ax using eigenbases and phase portrait trajectories.",
      learningObjectives: [
        "Convert systems of differential equations into matrix form x' = Ax.",
        "Solve decoupled systems using matrix exponentials and eigenvalues.",
        "Analyze stability and phase portraits geometrically.",
      ],
      prerequisites: ["mod1-diagonalization"],
      visualizationTypes: ["trajectory"],
      sections: [],
      examples: [],
      exercises: [],
      visualizationPresets: [],
      relatedTopics: ["mod1-diagonalization"],
    },
    {
      id: "mod1-symmetric-matrices",
      moduleId: "module-1",
      slug: "symmetric-matrices",
      title: "Symmetric Matrices",
      order: 5,
      status: "published",
      difficulty: "intermediate",
      estimatedMinutes: 20,
      description: "Explore the spectral theorem for real symmetric matrices: real eigenvalues and mutually orthogonal eigenvectors.",
      learningObjectives: [
        "State and apply the Spectral Theorem for symmetric matrices.",
        "Construct orthogonal diagonalization A = Q D Qᵀ.",
      ],
      prerequisites: ["mod1-diagonalization"],
      visualizationTypes: ["eigenvectors"],
      sections: [],
      examples: [],
      exercises: [],
      visualizationPresets: [],
      relatedTopics: ["mod1-positive-definite-matrices"],
    },
    {
      id: "mod1-positive-definite-matrices",
      moduleId: "module-1",
      slug: "positive-definite-matrices",
      title: "Positive Definite Matrices",
      order: 6,
      status: "published",
      difficulty: "intermediate",
      estimatedMinutes: 20,
      description: "Study quadratic forms xᵀAx > 0 and energy landscapes where symmetric matrices define bowl-shaped quadratic surfaces.",
      learningObjectives: [
        "Test for positive definiteness via eigenvalues, pivots, and Sylvester's criterion.",
        "Visualize quadratic surfaces xᵀAx = 1 as ellipsoids.",
      ],
      prerequisites: ["mod1-symmetric-matrices"],
      visualizationTypes: ["surface", "ellipsoid"],
      sections: [],
      examples: [],
      exercises: [],
      visualizationPresets: [],
      relatedTopics: ["mod1-symmetric-matrices", "mod1-singular-value-decomposition"],
    },
    {
      id: "mod1-similar-matrices",
      moduleId: "module-1",
      slug: "similar-matrices",
      title: "Similar Matrices",
      order: 7,
      status: "published",
      difficulty: "intermediate",
      estimatedMinutes: 20,
      description: "Understand similarity transformations B = P⁻¹AP as representing the exact same linear transformation under different coordinate bases.",
      learningObjectives: [
        "Define matrix similarity and identify preserved invariants (trace, determinant, eigenvalues).",
        "Interpret similarity geometrically as coordinate system translation.",
      ],
      prerequisites: ["mod1-diagonalization"],
      visualizationTypes: ["basis", "matrix-transformation"],
      sections: [],
      examples: [],
      exercises: [],
      visualizationPresets: [],
      relatedTopics: ["mod1-diagonalization"],
    },
    {
      id: "mod1-singular-value-decomposition",
      moduleId: "module-1",
      slug: "singular-value-decomposition",
      title: "Singular Value Decomposition",
      order: 8,
      status: "published",
      difficulty: "advanced",
      estimatedMinutes: 35,
      description: "The crown jewel of linear algebra: factor any rectangular matrix into rotation, scaling, and rotation (A = UΣVᵀ).",
      learningObjectives: [
        "Understand the geometric action of SVD transforming a unit sphere into a hyper-ellipsoid.",
        "Calculate singular values and singular vectors for rectangular matrices.",
        "Apply SVD to low-rank approximations and data compression.",
      ],
      prerequisites: ["mod1-positive-definite-matrices", "mod1-symmetric-matrices"],
      visualizationTypes: ["svd", "unit-sphere", "ellipsoid"],
      sections: [],
      examples: [],
      exercises: [],
      visualizationPresets: [],
      relatedTopics: ["mod1-generalized-inverses"],
    },
    {
      id: "mod1-generalized-inverses",
      moduleId: "module-1",
      slug: "generalized-inverses",
      title: "Generalized Inverses",
      order: 9,
      status: "published",
      difficulty: "advanced",
      estimatedMinutes: 25,
      description: "Construct the Moore-Penrose pseudoinverse A⁺ to find optimal minimum-norm solutions to rectangular and rank-deficient systems.",
      learningObjectives: [
        "Define the Moore-Penrose pseudoinverse via SVD: A⁺ = V Σ⁺ Uᵀ.",
        "Compute least-squares and minimum-norm solutions geometrically.",
      ],
      prerequisites: ["mod1-singular-value-decomposition"],
      visualizationTypes: ["projection", "least-squares"],
      sections: [],
      examples: [],
      exercises: [],
      visualizationPresets: [],
      relatedTopics: ["mod1-singular-value-decomposition"],
    },
  ],
};
