import { test, expect } from "@playwright/test";

test.describe("Linear Algebra Platform - Phase 2 Visualizer Foundation", () => {
  test("renders 2D/3D visualizer canvas and toolbar controls without console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/characteristic-equations"
    );

    // Verify visualizer container title
    await expect(
      page.getByRole("heading", { name: "Geometric Visualization" })
    ).toBeVisible();

    // Verify canvas element is created and mounted
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify Toolbar controls
    const toggleButton = page.getByRole("button", { name: /Switch to/i });
    const resetViewButton = page.getByRole("button", { name: "Reset View" });
    await expect(toggleButton).toBeVisible();
    await expect(resetViewButton).toBeVisible();

    // Click Reset View button
    await resetViewButton.click();

    // Toggle 2D -> 3D
    await toggleButton.click();
    await expect(page.getByText("3D Canvas")).toBeVisible();
    await expect(page.getByRole("button", { name: "Switch to 2D" })).toBeVisible();

    // Click Reset View in 3D
    await resetViewButton.click();

    // Toggle back 3D -> 2D
    await page.getByRole("button", { name: "Switch to 2D" }).click();
    await expect(page.getByText("2D Canvas")).toBeVisible();

    // Zero uncaught console errors
    expect(consoleErrors).toEqual([]);
  });

  test("verifies responsive visualizer rendering on mobile viewport (390x844)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/characteristic-equations"
    );

    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "Reset View" })).toBeVisible();
  });
});
