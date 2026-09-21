import { test, expect } from "@playwright/test";

test.describe("Module I: Topic 2 - Eigenvalues and Eigenvectors Vertical Slice", () => {
  test("complete interactive learning journey for Eigenvalues and Eigenvectors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to Module I Topic 2
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    // 2. Verify Header & Mathematical Typesetting
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Eigenvalues and Eigenvectors"
    );
    await expect(page.locator(".katex").first()).toBeVisible();

    // Verify raw LaTeX strings are not leaked into the DOM
    const bodyText = await page.innerText("body");
    expect(bodyText).not.toContain("\\begin{bmatrix}");
    expect(bodyText).not.toContain("\\mathbf{v}");
    expect(bodyText).not.toContain("\\lambda");

    // 3. Verify Preset Selection & Multiplicity Summary Card
    // Default is Symmetric Matrix [[2, 1], [1, 2]]
    await expect(page.getByText("Eigenspace & Multiplicity Analysis")).toBeVisible();
    await expect(page.getByText("Complete Eigenbasis")).toBeVisible();

    // Select Uniform Scaling Preset (A = 2I)
    await page.getByRole("button", { name: "Uniform Scaling (2I)" }).click();
    await expect(page.getByText(/Uniform Isotropic Scaling/i)).toBeVisible();

    // Select Defective Shear Matrix Preset
    await page.getByRole("button", { name: "Shear Matrix" }).click();
    await expect(page.getByText("Defective Matrix (gm < am)")).toBeVisible();

    // Select 90° Rotation (Complex roots)
    await page.getByRole("button", { name: "90° Rotation" }).click();
    await expect(
      page.getByText("No Real Invariant Directions in ℝ²")
    ).toBeVisible();

    // Return to Symmetric Matrix
    await page.getByRole("button", { name: "Symmetric Matrix" }).click();

    // 4. Test Invariant Direction Canvas & Camera Controls
    await expect(
      page.getByText("Interactive Invariant Direction (Eigenspace) Canvas")
    ).toBeVisible();
    await expect(page.locator("svg.select-none")).toBeVisible();

    // Verify Adaptive Camera Controls: Fit Scene and Reset Camera
    const fitSceneBtn = page.getByRole("button", { name: /Fit Scene/i });
    await expect(fitSceneBtn).toBeVisible();
    await fitSceneBtn.click();

    const resetCamBtn = page.getByRole("button", { name: /Reset Camera/i });
    await expect(resetCamBtn).toBeVisible();
    await resetCamBtn.click();

    // 5. Test Dedicated "Eigenvector vs Ordinary Vector" Comparison
    const testOrdinaryBtn = page.getByRole("button", { name: /Test Ordinary Vector/i });
    await testOrdinaryBtn.scrollIntoViewIfNeeded();
    await testOrdinaryBtn.click();
    await expect(page.getByText(/Ordinary \(Non-Eigen\) Vector/i)).toBeVisible();

    const testEigenBtn = page.getByRole("button", { name: /Test Invariant Eigenvector/i });
    await testEigenBtn.click();
    await expect(page.getByText("λ = 3 Invariant Direction (Stretch)")).toBeVisible();

    // 6. Test Geometric Taxonomy Experiments: λ > 1, 0 < λ < 1, λ < 0, λ = 0
    // Experiment 1: λ > 1 (Stretch)
    await page.getByRole("button", { name: /1.*Stretch/i }).click();
    await expect(page.getByText(/λ = 2.5 Invariant Direction \(Stretch\)/i)).toBeVisible();

    // Experiment 2: 0 < λ < 1 (Shrink)
    await page.getByRole("button", { name: /2.*Shrink/i }).click();
    await expect(page.getByText(/λ = 0.5 Invariant Direction \(Shrink\)/i)).toBeVisible();

    // Experiment 3: λ < 0 (Direction Reversal)
    await page.getByRole("button", { name: /3.*Direction Reversal/i }).click();
    await expect(page.getByText(/λ = -2 Invariant Direction \(Direction Reversal\)/i)).toBeVisible();

    // Experiment 4: λ = 0 (Collapse to Origin)
    await page.getByRole("button", { name: /4.*Collapse to Origin/i }).click();
    await expect(page.getByText(/λ = 0 Eigenspace \(Nullspace Collapse\)/i)).toBeVisible();
    await expect(page.getByText(/v → Av = \[0, 0\]/i)).toBeVisible();

    // Play animation for λ = 0 and verify final collapse to origin
    const animBtn = page.getByRole("button", { name: /Animate Av/i });
    await animBtn.scrollIntoViewIfNeeded();
    await animBtn.click();

    // Wait for animation to finish (1.5s duration)
    await page.waitForTimeout(1600);

    // Verify final state: transformed vector is numerically [0, 0] and visually at origin
    await expect(page.locator("[data-testid='av-collapsed-origin']")).toBeVisible();
    await expect(page.locator("[data-testid='av-collapsed-origin']").getByText("Av = [0, 0]")).toBeVisible();
    await expect(page.locator("[data-testid='av-vector-arrow']")).toHaveCount(0);

    // Verify eigenspace line E_0 remains visible
    await expect(page.locator("[data-testid='eigenspace-line-1']")).toBeVisible();

    // 7. Test 2D vs 3D Demo View Toggle
    const demo3DBtn = page.getByRole("button", { name: "3D Demo" });
    await demo3DBtn.scrollIntoViewIfNeeded();
    await demo3DBtn.click();
    await expect(
      page.getByText("3D Eigenspace Demonstration")
    ).toBeVisible();
    await expect(page.locator("canvas")).toBeVisible();

    // Switch back to 2D
    await page.getByRole("button", { name: "2D Visualizer" }).click();

    // 8. Test Step-by-Step Eigenspace Derivation
    const derivationBtn = page.getByRole("button", { name: /Show Derivation/i }).first();
    await derivationBtn.scrollIntoViewIfNeeded();
    await derivationBtn.click();
    await expect(
      page.getByText("Step A: Substitute").first()
    ).toBeVisible();

    // 9. Test Bridge to Topic 3
    const bridgeLink = page.getByRole("link", { name: /Preview Diagonalization/i });
    await expect(bridgeLink).toBeVisible();
    await expect(bridgeLink).toHaveAttribute(
      "href",
      "/learn/matrices-eigenvalues-decompositions/diagonalization"
    );

    // 10. Test Interactive Practice Section
    await expect(page.getByText("Interactive Practice & Mastery Problems")).toBeVisible();
    await expect(page.getByText("Problem 1")).toBeVisible();

    // Show hint on Problem 1
    const hintBtn = page.getByRole("button", { name: "Show Hint" }).first();
    await hintBtn.click();

    // Show solution on Problem 1
    const solBtn = page.getByRole("button", { name: "Show Solution" }).first();
    await solBtn.click();
    await expect(page.getByText("Worked Solution & Step-by-Step Derivation:")).toBeVisible();

    // 11. Assert 0 Fatal Console Errors
    const fatalErrors = consoleErrors.filter(
      (err) =>
        !err.includes("favicon") &&
        !err.includes("hydration") &&
        !err.includes("Download the React DevTools")
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test("verifies adaptive framing on vertical eigenspaces (Diagonal preset)", async ({
    page,
  }) => {
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    // Select Diagonal Matrix preset (invariant directions on coordinate axes)
    await page.getByRole("button", { name: "Diagonal Matrix" }).click();

    // Verify both eigenspace lines exist and are visible
    await expect(page.locator("[data-testid='eigenspace-line-0']")).toBeVisible();
    await expect(page.locator("[data-testid='eigenspace-line-1']")).toBeVisible();

    // Click Fit Scene
    await page.getByRole("button", { name: /Fit Scene/i }).click();

    // Test vector v and transformed vector Av are visible
    await expect(page.getByText(/^v = \[/i)).toBeVisible();
    await expect(page.getByText(/^Av = \[/i)).toBeVisible();
  });

  test("verifies desktop viewport (1280x800)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("svg.select-none")).toBeVisible();
    await expect(page.getByRole("button", { name: /Fit Scene/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Reset Camera/i })).toBeVisible();
  });

  test("verifies responsive layout on mobile viewport (390x844)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Interactive Matrix Editor & Guided Presets")).toBeVisible();
    await expect(page.locator("svg.select-none")).toBeVisible();
    await expect(page.getByRole("button", { name: /Fit Scene/i })).toBeVisible();
  });

  test("verifies tablet viewport (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Eigenspace & Multiplicity Analysis")).toBeVisible();
    await expect(page.locator("svg.select-none")).toBeVisible();
  });

  test("regression: vector drag does not pan camera or move origin on screen", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    const originMarker = page.locator("[data-testid='origin-marker']");
    await originMarker.scrollIntoViewIfNeeded();
    await expect(originMarker).toBeVisible();
    const initialOriginBox = await originMarker.boundingBox();
    expect(initialOriginBox).not.toBeNull();

    // Record initial vector text
    const vectorGroup = page.locator("[data-testid='test-vector-v']");
    const initialVectorText = await vectorGroup.textContent();

    // Drag vector by handle
    const dragHandle = page.locator("[data-testid='vector-drag-handle']");
    await expect(dragHandle).toBeVisible();
    const handleBox = await dragHandle.boundingBox();
    expect(handleBox).not.toBeNull();

    const startX = handleBox!.x + handleBox!.width / 2;
    const startY = handleBox!.y + handleBox!.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY - 60, { steps: 5 });
    await page.mouse.up();

    // Verify vector coordinates changed
    const updatedVectorText = await vectorGroup.textContent();
    expect(updatedVectorText).not.toEqual(initialVectorText);

    // Verify origin marker screen position remained unchanged (< 1px)
    const afterOriginBox = await originMarker.boundingBox();
    expect(afterOriginBox).not.toBeNull();
    expect(Math.abs(afterOriginBox!.x - initialOriginBox!.x)).toBeLessThan(1);
    expect(Math.abs(afterOriginBox!.y - initialOriginBox!.y)).toBeLessThan(1);

    // Verify Av transformed vector is derived and displayed
    await expect(page.locator("[data-testid='av-vector-arrow']")).toBeVisible();

    const fatalErrors = consoleErrors.filter(
      (err) =>
        !err.includes("favicon") &&
        !err.includes("hydration") &&
        !err.includes("Download the React DevTools")
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test("rapid high-frequency vector dragging does not trigger Maximum update depth exceeded", async ({
    page,
  }) => {
    const errorLogs: string[] = [];
    page.on("pageerror", (exception) => {
      errorLogs.push(exception.message);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errorLogs.push(msg.text());
      }
    });

    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    const dragHandle = page.locator("[data-testid='vector-drag-handle']");
    await dragHandle.scrollIntoViewIfNeeded();
    await expect(dragHandle).toBeVisible();
    const handleBox = await dragHandle.boundingBox();
    expect(handleBox).not.toBeNull();

    const startX = handleBox!.x + handleBox!.width / 2;
    const startY = handleBox!.y + handleBox!.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();

    // Perform continuous circular drag with 30 rapid steps
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const moveX = startX + Math.cos(angle) * 80;
      const moveY = startY + Math.sin(angle) * 80;
      await page.mouse.move(moveX, moveY);
    }
    await page.mouse.up();

    // Wait a brief tick for any pending rAF/renders
    await page.waitForTimeout(200);

    // Verify zero update depth exceeded errors or uncaught exceptions
    const updateDepthErrors = errorLogs.filter((err) =>
      err.toLowerCase().includes("maximum update depth exceeded")
    );
    expect(updateDepthErrors).toHaveLength(0);

    const fatalErrors = errorLogs.filter(
      (err) =>
        !err.includes("favicon") &&
        !err.includes("hydration") &&
        !err.includes("Download the React DevTools")
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test("empty canvas drag pans camera and moves origin on screen", async ({
    page,
  }) => {
    await page.goto(
      "/learn/matrices-eigenvalues-decompositions/eigenvalues-eigenvectors"
    );
    await page.waitForLoadState("networkidle");

    const originMarker = page.locator("[data-testid='origin-marker']");
    await originMarker.scrollIntoViewIfNeeded();
    await expect(originMarker).toBeVisible();
    const initialOriginBox = await originMarker.boundingBox();
    expect(initialOriginBox).not.toBeNull();

    // Record initial vector text
    const vectorGroup = page.locator("[data-testid='test-vector-v']");
    const initialVectorText = await vectorGroup.textContent();

    // Drag empty canvas background
    const canvasBg = page.locator("[data-testid='canvas-background']");
    await expect(canvasBg).toBeVisible();
    const bgBox = await canvasBg.boundingBox();
    expect(bgBox).not.toBeNull();

    // Click in upper-left corner of canvas away from origin and vectors
    const startX = bgBox!.x + 40;
    const startY = bgBox!.y + 40;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY + 40, { steps: 5 });
    await page.mouse.up();

    // Verify origin marker shifted on screen due to pan
    const afterOriginBox = await originMarker.boundingBox();
    expect(afterOriginBox).not.toBeNull();
    const dx = afterOriginBox!.x - initialOriginBox!.x;
    const dy = afterOriginBox!.y - initialOriginBox!.y;
    expect(Math.abs(dx)).toBeGreaterThan(10);
    expect(Math.abs(dy)).toBeGreaterThan(10);

    // Verify mathematical vector coordinates remained unchanged
    const afterVectorText = await vectorGroup.textContent();
    expect(afterVectorText).toEqual(initialVectorText);
  });
});
