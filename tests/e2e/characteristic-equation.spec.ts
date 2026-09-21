import { test, expect } from "@playwright/test";

test.describe("Module I: Topic 1 - Characteristic Equations Vertical Slice", () => {
  test("complete interactive learning journey for Characteristic Equations with KaTeX math rendering", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to Module 1 Topic 1
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/characteristic-equations"
    );

    // 2. Verify Page Header & Objectives
    await expect(page.locator("h1")).toContainText("Characteristic Equations");
    await expect(page.getByText("Learning Objectives")).toBeVisible();

    // 3. Verify KaTeX Math Rendering is Active (No raw LaTeX strings visible)
    const katexElements = page.locator(".katex");
    await expect(katexElements.first()).toBeVisible();
    const count = await katexElements.count();
    expect(count).toBeGreaterThan(10); // Multiple mathematical formulas rendered properly

    const bodyText = await page.innerText("body");
    expect(bodyText).not.toContain("\\begin{bmatrix}");
    expect(bodyText).not.toContain("\\operatorname");

    // 4. Verify Interactive Explorer is Mounted as Primary Visualizer
    await expect(
      page.getByText("Characteristic Equations & Eigenvalue Determination")
    ).toBeVisible();

    // Verify 2D SVG Polynomial Curve Visualizer is Visible
    await expect(
      page.getByText("Characteristic Polynomial Curve").first()
    ).toBeVisible();
    await expect(page.locator("svg").first()).toBeVisible();

    // 5. Test Guided Presets
    // Diagonal Matrix
    await page.getByRole("button", { name: "Diagonal Matrix" }).click();
    await expect(page.getByText("Diagonal Matrix").first()).toBeVisible();

    // Shear Matrix (Repeated Root Δ = 0)
    await page.getByRole("button", { name: "Shear Matrix" }).click();
    await expect(page.getByText("Δ = 0 (One Repeated Root)").first()).toBeVisible();

    // 90° Rotation Matrix (Complex Roots Δ < 0)
    await page.getByRole("button", { name: "90° Rotation Matrix" }).click();
    await expect(
      page.getByText("Δ < 0 (Complex Conjugate Roots)").first()
    ).toBeVisible();
    await expect(page.getByText("No Real Intersections (Δ < 0)")).toBeVisible();

    // Singular Matrix (det = 0)
    await page.getByRole("button", { name: "Singular Matrix" }).click();
    await expect(page.getByText("Singular Matrix (det(A) = 0):")).toBeVisible();

    // Generic Golden Matrix [[1, 2], [3, 4]]
    await page.getByRole("button", { name: "Generic 2x2 Matrix" }).click();

    // 6. Test Step-by-Step Derivation Accordion
    const step1Btn = page.getByRole("button", { name: /1 Construct \(A - λI\)/i });
    await step1Btn.click();
    await expect(
      page.getByText("Subtract scalar")
    ).toBeVisible();

    // 7. Test Contextual Link to Module IV Linear Transformations
    const exploreTransformationsLink = page.getByRole("link", {
      name: /Explore Matrix Transformations/i,
    });
    await expect(exploreTransformationsLink).toBeVisible();
    await expect(exploreTransformationsLink).toHaveAttribute(
      "href",
      "/learn/linear-transformations/linear-transformations"
    );

    // 8. Test Discriminant Experiments
    await page.getByRole("button", { name: /Case 1/i }).click();
    await page.getByRole("button", { name: /Case 2/i }).click();
    await expect(page.getByText("Δ = 0 (One Repeated Root)").first()).toBeVisible();

    await page.getByRole("button", { name: /Case 3/i }).click();
    await expect(
      page.getByText("Δ < 0 (Complex Conjugate Roots)").first()
    ).toBeVisible();

    // 9. Test Interactive Practice Section
    await expect(page.getByText("Interactive Practice & Mastery Problems")).toBeVisible();
    await expect(page.getByText("Problem 1")).toBeVisible();

    // Show hint on Problem 1
    const hintBtn = page.getByRole("button", { name: "Show Hint" }).first();
    await hintBtn.click();

    // Show solution on Problem 1
    const solBtn = page.getByRole("button", { name: "Show Solution" }).first();
    await solBtn.click();
    await expect(page.getByText("Worked Solution & Step-by-Step Derivation:")).toBeVisible();

    // 10. Verify Zero Console Errors
    const fatalErrors = consoleErrors.filter(
      (err) =>
        !err.includes("favicon") &&
        !err.includes("WebGL") &&
        !err.includes("THREE.WebGLRenderer")
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test("verifies responsive layout on mobile viewport (390x844)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/characteristic-equations"
    );

    await expect(page.locator("h1")).toContainText("Characteristic Equations");
    await expect(
      page.getByText("Characteristic Equations & Eigenvalue Determination")
    ).toBeVisible();
    await expect(page.getByText("Characteristic Polynomial Curve").first()).toBeVisible();
    await expect(page.getByText("Invariants & Discriminant Analysis")).toBeVisible();
    await expect(page.getByText("Interactive Practice & Mastery Problems")).toBeVisible();
  });

  test("verifies tablet viewport (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/characteristic-equations"
    );

    await expect(page.locator("h1")).toContainText("Characteristic Equations");
    await expect(
      page.getByText("Characteristic Equations & Eigenvalue Determination")
    ).toBeVisible();
    await expect(page.getByText("Interactive Practice & Mastery Problems")).toBeVisible();
  });
});
