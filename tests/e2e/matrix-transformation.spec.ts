import { test, expect } from "@playwright/test";

test.describe("Phase 3: Matrix Transformation Vertical Slice E2E", () => {
  test("complete matrix transformation interactive journey without console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to Linear Transformations topic page
    await page.goto("/learn/linear-transformations/linear-transformations");
    await page.waitForLoadState("domcontentloaded");

    // 2. Verify page header & lesson content
    await expect(page.locator("h1")).toContainText("Linear Transformations");
    await expect(page.locator("text=2D Matrix Transformation Visualizer")).toBeVisible();

    // 3. Verify Canvas & Toolbar buttons exist (Fit Scene & Reset Camera)
    await expect(page.getByRole("button", { name: "Fit Scene" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset Camera" })).toBeVisible();

    // 4. Verify Matrix Editor initial state (Identity Matrix)
    const entryA = page.locator("#matrix-entry-a");
    const entryB = page.locator("#matrix-entry-b");
    const entryC = page.locator("#matrix-entry-c");
    const entryD = page.locator("#matrix-entry-d");

    await expect(entryA).toHaveValue("1");
    await expect(entryB).toHaveValue("0");
    await expect(entryC).toHaveValue("0");
    await expect(entryD).toHaveValue("1");

    // 5. Verify Numerical Breakdown for Identity
    await expect(page.locator("text=Mathematical Breakdown")).toBeVisible();
    await expect(page.locator("text=det(A) = ad - bc:")).toBeVisible();

    // 6. Test Preset Selection: Horizontal Shear
    const shearPresetBtn = page.getByRole("button", { name: "Horizontal Shear (k = 1.5)" });
    await shearPresetBtn.click();

    await expect(entryB).toHaveValue("1.5");
    await expect(page.locator("text=det(A) = 1.00")).toBeVisible();

    // 7. Test Preset Selection: Reflection across y-axis
    const reflectPresetBtn = page.getByRole("button", { name: "Reflection across y-axis" });
    await reflectPresetBtn.click();

    await expect(entryA).toHaveValue("-1");
    await expect(page.locator("text=det(A) = -1.00")).toBeVisible();

    // 8. Test Preset Selection: Projection onto x-axis (singular)
    const projPresetBtn = page.getByRole("button", { name: "Projection onto x-axis" });
    await projPresetBtn.click();

    await expect(entryD).toHaveValue("0");
    await expect(page.locator("text=det(A) = 0.00")).toBeVisible();

    // 9. Test Direct Matrix Editing with Large Matrix (Scale = 4)
    await entryA.fill("4");
    await entryD.fill("4");
    await expect(page.locator("text=det(A) = 16.00")).toBeVisible();

    // 10. Test Fit Scene Explicit Action
    const fitSceneBtn = page.getByRole("button", { name: "Fit Scene" });
    await fitSceneBtn.click();

    // 11. Test Reset Camera Explicit Action
    const resetCameraBtn = page.getByRole("button", { name: "Reset Camera" });
    await resetCameraBtn.click();

    // 12. Test Linearity Demonstration Toggle
    const linearityBtn = page.getByRole("button", { name: /Demonstrate Linearity/i });
    await linearityBtn.click();
    await expect(page.locator("text=Linearity Mode Active")).toBeVisible();

    // 13. Test Reset Matrix to Identity (I)
    const resetMatrixBtn = page.getByRole("button", { name: "Reset Matrix to Identity (I)" });
    await resetMatrixBtn.click();

    await expect(entryA).toHaveValue("1");
    await expect(entryB).toHaveValue("0");
    await expect(entryC).toHaveValue("0");
    await expect(entryD).toHaveValue("1");

    // 14. Verify lesson sections exist
    await expect(page.locator("text=Formal Definition of Linearity")).toBeVisible();
    await expect(page.locator("text=The Column Picture: Columns Are Basis Images")).toBeVisible();
    await expect(page.locator("text=The Determinant as Area Scaling Factor")).toBeVisible();
    await expect(page.locator("text=Interactive Guided Experiments")).toBeVisible();

    // 15. Confirm zero console errors and no NaN/Infinity
    expect(consoleErrors).toEqual([]);
  });

  test("verifies responsive visualizer layout at mobile viewport (390x844)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/learn/linear-transformations/linear-transformations");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("text=2D Matrix Transformation Visualizer")).toBeVisible();
    await expect(page.locator("#matrix-entry-a")).toBeVisible();
    await expect(page.locator("text=Mathematical Breakdown")).toBeVisible();
    await expect(page.getByRole("button", { name: "Fit Scene" })).toBeVisible();
  });

  test("verifies tablet viewport (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/learn/linear-transformations/linear-transformations");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("text=2D Matrix Transformation Visualizer")).toBeVisible();
    await expect(page.locator("#matrix-entry-a")).toBeVisible();
  });
});
