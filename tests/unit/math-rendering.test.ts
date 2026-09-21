import { describe, it, expect } from "vitest";
import katex from "katex";

describe("Shared Mathematical Content & KaTeX Rendering Pipeline", () => {
  it("renders standard Greek letters (lambda, Delta) without error", () => {
    const htmlLambda = katex.renderToString("\\lambda", { throwOnError: true });
    expect(htmlLambda).toContain("katex");
    expect(htmlLambda).toContain("λ");

    const htmlDelta = katex.renderToString("\\Delta", { throwOnError: true });
    expect(htmlDelta).toContain("katex");
    expect(htmlDelta).toContain("Δ");
  });

  it("renders characteristic equation det(A - λI) = 0", () => {
    const html = katex.renderToString("\\det(A - \\lambda I) = 0", {
      throwOnError: true,
    });
    expect(html).toContain("katex");
    expect(html).toContain("det");
    expect(html).toContain("λ");
  });

  it("renders 2x2 matrix brackets and elements", () => {
    const matrixLatex =
      "\\begin{bmatrix} a - \\lambda & b \\\\ c & d - \\lambda \\end{bmatrix}";
    const html = katex.renderToString(matrixLatex, { throwOnError: true });
    expect(html).toContain("katex");
    expect(html).toContain("matrix");
  });

  it("renders characteristic polynomial formula with trace and determinant", () => {
    const polyLatex =
      "p(\\lambda) = \\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A)";
    const html = katex.renderToString(polyLatex, { throwOnError: true });
    expect(html).toContain("katex");
    expect(html).toContain("p");
  });

  it("renders subscripts, superscripts, inequalities, and fractions", () => {
    const subSuperLatex = "\\lambda_1, \\lambda_2 \\quad v \\neq 0 \\quad \\frac{\\text{tr}(A)}{2}";
    const html = katex.renderToString(subSuperLatex, { throwOnError: true });
    expect(html).toContain("katex");
    expect(html).toContain("frac");
  });

  it("renders eigenvalue scaling relationship Av = λv", () => {
    const eqLatex = "A\\mathbf{v} = \\lambda \\mathbf{v}";
    const html = katex.renderToString(eqLatex, { throwOnError: true });
    expect(html).toContain("katex");
  });
});
