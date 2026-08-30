import { test, expect } from "@playwright/test";

test.describe("Linear Algebra Platform - Phase 1 Foundation Verification", () => {
  test("monitors console errors across all primary routes", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await expect(page.locator("h1")).toContainText("See the geometry");

    await page.goto("/learn");
    await expect(page.locator("h1")).toContainText("Linear Algebra Curriculum");

    await page.goto("/playground");
    await expect(page.locator("h1")).toContainText("AI Mathematical Playground");

    await page.goto("/practice");
    await expect(page.locator("h1")).toContainText("Practice Exercises");

    expect(consoleErrors).toEqual([]);
  });

  test("verifies all 4 module detail pages render from curriculum registry", async ({ page }) => {
    const modules = [
      {
        slug: "matrices-eigenvalues-decompositions",
        title: "Matrices, Eigenvalues and Decompositions",
        topicCount: 9,
      },
      {
        slug: "vector-spaces",
        title: "Vector Spaces",
        topicCount: 9,
      },
      {
        slug: "inner-product-spaces",
        title: "Inner Product Spaces",
        topicCount: 9,
      },
      {
        slug: "linear-transformations",
        title: "Linear Transformations",
        topicCount: 6,
      },
    ];

    for (const mod of modules) {
      await page.goto(`/learn/${mod.slug}`);
      await expect(page.locator("h1")).toContainText(mod.title);
      await expect(page.getByText("Topics in this Module")).toBeVisible();
      await expect(page.getByText(`${mod.topicCount} topics`)).toBeVisible();
    }
  });

  test("verifies topic pages across all 4 modules with fallback visualizer shells", async ({ page }) => {
    const sampleTopics = [
      {
        moduleSlug: "matrices-eigenvalues-decompositions",
        topicSlug: "characteristic-equations",
        title: "Characteristic Equations",
      },
      {
        moduleSlug: "vector-spaces",
        topicSlug: "definition-of-field",
        title: "Definition of Field",
      },
      {
        moduleSlug: "inner-product-spaces",
        topicSlug: "inner-product-spaces",
        title: "Inner Product Spaces",
      },
      {
        moduleSlug: "linear-transformations",
        topicSlug: "linear-transformations",
        title: "Linear Transformations",
      },
    ];

    for (const topic of sampleTopics) {
      await page.goto(`/learn/${topic.moduleSlug}/${topic.topicSlug}`);
      await expect(page.locator("h1")).toContainText(topic.title);
      await expect(page.getByRole("heading", { name: "Learning Objectives" })).toBeVisible();
      await expect(page.locator("canvas")).toBeVisible();
    }
  });

  test("verifies adjacent topic navigation across module boundary (Module 1 -> Module 2)", async ({ page }) => {
    // Navigate to the last topic of Module 1: generalized-inverses
    await page.goto("/learn/matrices-eigenvalues-decompositions/generalized-inverses");
    await expect(page.locator("h1")).toContainText("Generalized Inverses");

    // Click Next Topic, which transitions to first topic of Module 2 (Definition of Field)
    const nextTopicLink = page.getByRole("link", { name: /Next Topic/i });
    await expect(nextTopicLink).toBeVisible();
    await expect(nextTopicLink).toContainText("Definition of Field");
    await nextTopicLink.click();

    await expect(page).toHaveURL(/\/learn\/vector-spaces\/definition-of-field/);
    await expect(page.locator("h1")).toContainText("Definition of Field");

    // Click Previous Topic, which transitions back to generalized-inverses
    const prevTopicLink = page.getByRole("link", { name: /Previous Topic/i });
    await expect(prevTopicLink).toBeVisible();
    await expect(prevTopicLink).toContainText("Generalized Inverses");
    await prevTopicLink.click();

    await expect(page).toHaveURL(/\/learn\/matrices-eigenvalues-decompositions\/generalized-inverses/);
    await expect(page.locator("h1")).toContainText("Generalized Inverses");
  });

  test("verifies mobile viewport and drawer navigation (390x844)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/learn/matrices-eigenvalues-decompositions/characteristic-equations");

    // Verify mobile drawer trigger is visible
    const mobileMenuButton = page.getByRole("button", { name: "Open curriculum menu" });
    await expect(mobileMenuButton).toBeVisible();
    await mobileMenuButton.click();

    // Verify drawer opened with close navigation button and curriculum links
    await expect(page.getByRole("button", { name: "Close navigation" })).toBeVisible();
    const topicLinkInDrawer = page.locator("aside").getByRole("link", { name: /Eigenvalues and Eigenvectors/i });
    await expect(topicLinkInDrawer).toBeVisible();
    await topicLinkInDrawer.click();

    // Verify navigation occurred and URL updated
    await expect(page).toHaveURL(/\/learn\/matrices-eigenvalues-decompositions\/eigenvalues-eigenvectors/);
    await expect(page.locator("h1")).toContainText("Eigenvalues and Eigenvectors");
  });

  test("verifies tablet viewport (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/learn");
    await expect(page.locator("h1")).toContainText("Linear Algebra Curriculum");
    await expect(page.getByText("Module 1")).toBeVisible();
    await expect(page.getByText("Module 4")).toBeVisible();
  });
});
