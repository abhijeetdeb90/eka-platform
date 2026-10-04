import { test, expect, type Page } from "@playwright/test";

const PROJECT_ID = "kbiutqzhcbyuseygcspe";

async function setupAuthenticatedUser(page: Page, role = "admin") {
  const mockUser = {
    id: "00000000-0000-0000-0000-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email: "admin@eka.earth",
    app_metadata: { provider: "email", providers: ["email"], role },
    user_metadata: { username: "admin", display_name: "EKA Admin" },
    created_at: new Date().toISOString(),
  };

  const mockSession = {
    access_token: "mock-jwt-token-for-e2e-testing",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock-refresh-token",
    user: mockUser,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };

  await page.addInitScript(
    ({ projectId, session }) => {
      localStorage.setItem(`sb-${projectId}-auth-token`, JSON.stringify(session));
      localStorage.setItem("sb-auth-token", JSON.stringify(session));
      localStorage.setItem(
        "eka_cookie_consent_v1",
        JSON.stringify({
          necessary: true,
          analytics: false,
          marketing: false,
          timestamp: Date.now(),
        })
      );
    },
    { projectId: PROJECT_ID, session: mockSession }
  );

  await page.route("**/auth/v1/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockUser),
    });
  });

  await page.route("**/auth/v1/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  await page.route("**/rest/v1/user_roles*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ role }]),
    });
  });

  await page.route("**/rest/v1/profiles*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: mockUser.id,
        username: "admin",
        full_name: "EKA Admin",
        avatar_url: null,
      }),
    });
  });
}

test.describe("EKA Cultural Knowledge Ingestion & Enrichment System", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "eka_cookie_consent_v1",
        JSON.stringify({
          necessary: true,
          analytics: false,
          marketing: false,
          timestamp: Date.now(),
        })
      );
    });
  });

  test("1. Cultural Knowledge Directory (/knowledge) renders canonical entities, metrics, and filters", async ({
    page,
  }) => {
    await page.goto("/knowledge", { waitUntil: "networkidle" });

    // Assert main title and metrics
    await expect(page.locator("h1")).toContainText(/Cultural Knowledge Graph/i);
    await expect(page.getByText(/Canonical Entities/i)).toBeVisible();
    await expect(page.locator("section").getByText(/Documented Variations/i).first()).toBeVisible();
    await expect(page.getByText(/Verified Sources/i)).toBeVisible();
    await expect(page.getByText(/CC & Open Provenance/i)).toBeVisible();

    // Verify card grid is populated with canonical entities
    const cardGrid = page.locator("[data-testid='knowledge-card-grid']");
    await expect(cardGrid).toBeVisible();
    await expect(page.locator("[data-testid='eka-card-card-diwali']")).toBeVisible();
    await expect(page.locator("[data-testid='eka-card-card-aranmula-kannadi']")).toBeVisible();
    await expect(page.locator("[data-testid='eka-card-card-bohag-bihu']")).toBeVisible();

    // Test Search input
    const searchInput = page.locator("[data-testid='knowledge-search-input']");
    await searchInput.fill("aranmula");
    // Wait for the grid to filter to 1 entity
    await expect(page.locator("[data-testid='knowledge-card-grid'] > article")).toHaveCount(1);
    await expect(page.locator("[data-testid='eka-card-card-aranmula-kannadi']")).toBeVisible();
    await expect(page.locator("[data-testid='eka-card-card-diwali']")).not.toBeVisible();

    // Clear search and test filter buttons
    await searchInput.clear();
    await expect(page.locator("[data-testid='knowledge-card-grid'] > article")).toHaveCount(10);
    const craftFilter = page.locator("[data-testid='filter-craft']");
    await craftFilter.click();
    await expect(page.locator("[data-testid='eka-card-card-aranmula-kannadi']")).toBeVisible();
    await expect(page.locator("[data-testid='eka-card-card-patan-patola']")).toBeVisible();
  });

  test("2. Knowledge Detail Page (/knowledge/diwali) renders 10 Cultural Dimensions and Source Passport", async ({
    page,
  }) => {
    await page.goto("/knowledge/diwali", { waitUntil: "networkidle" });

    // Header & identity
    await expect(page.locator("h1")).toContainText(/Diwali \(Deepavali\)/i);
    await expect(page.getByText(/Verified Provenance/i).first()).toBeVisible();

    // Source Passport Widget
    const passport = page.locator("[data-testid='eka-source-passport']");
    await expect(passport).toBeVisible();
    await expect(passport).toContainText(/Strong Evidence/i);
    await expect(passport).toContainText(/Corroborated across 5 verified sources/i);

    // View Sources dialog
    const viewSourcesBtn = page.locator("[data-testid='view-sources-btn']");
    await viewSourcesBtn.scrollIntoViewIfNeeded();
    await viewSourcesBtn.click();

    // Expect dialog to open
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Source Passport: Diwali/i)).toBeVisible();
    await expect(dialog.locator("[data-testid='source-item-src-wiki-diwali']")).toBeVisible();
    await expect(dialog.locator("[data-testid='source-item-src-wikipedia-diwali']")).toBeVisible();

    // Close dialog with Escape key
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // 10 Cultural Dimensions tabs
    const dimensionsSection = page.locator("[data-testid='eka-cultural-dimensions']");
    await expect(dimensionsSection).toBeVisible();
    await expect(dimensionsSection.getByText(/The 10 Cultural Dimensions/i)).toBeVisible();

    // Switch between tabs
    await dimensionsSection.getByRole("tab", { name: /History/i }).click();
    await expect(dimensionsSection.getByText(/Origins & Emergence/i)).toBeVisible();

    await dimensionsSection.getByRole("tab", { name: /Beliefs/i }).click();
    await expect(dimensionsSection.getByText(/Underlying Worldview/i)).toBeVisible();

    await dimensionsSection.getByRole("tab", { name: /Material/i }).click();
    await expect(dimensionsSection.getByText(/Attire & Weaves/i)).toBeVisible();
    await expect(dimensionsSection.getByText(/Foodways & Feasts/i)).toBeVisible();
  });

  test("3. Documented Variations section models plural regional and community traditions", async ({
    page,
  }) => {
    await page.goto("/knowledge/diwali", { waitUntil: "networkidle" });

    const variationsSection = page.locator("[data-testid='eka-cultural-variations-section']");
    await expect(variationsSection).toBeVisible();
    await expect(variationsSection.getByText(/6 Variations Documented/i)).toBeVisible();

    // Assert key distinct regional and community variations
    await expect(page.locator("[data-testid='variation-card-var-diwali-north']")).toContainText(
      /Ayodhya & North Indian Tradition/i
    );
    await expect(page.locator("[data-testid='variation-card-var-diwali-south']")).toContainText(
      /Tamil & South Indian Deepavali/i
    );
    await expect(page.locator("[data-testid='variation-card-var-diwali-bengal']")).toContainText(
      /Kali Puja \(Shyama Puja\)/i
    );
    await expect(page.locator("[data-testid='variation-card-var-diwali-jain']")).toContainText(
      /Jain Mahavira Nirvana Divas/i
    );
    await expect(page.locator("[data-testid='variation-card-var-diwali-sikh']")).toContainText(
      /Bandi Chhor Divas/i
    );
    await expect(page.locator("[data-testid='variation-card-var-diwali-newar']")).toContainText(
      /Swanti & Mha Puja/i
    );
  });

  test("4. Epistemic Taxonomy separates Documented Facts from Traditional Beliefs", async ({
    page,
  }) => {
    await page.goto("/knowledge/diwali", { waitUntil: "networkidle" });

    const taxonomy = page.locator("[data-testid='eka-epistemic-taxonomy']");
    await expect(taxonomy).toBeVisible();
    await expect(taxonomy.getByText(/Epistemic Taxonomy: Facts vs. Traditions/i)).toBeVisible();

    // Check presence of documented claim and traditional belief
    await expect(page.locator("[data-testid='claim-cl-diwali-01']")).toContainText(
      /Documented Fact/i
    );
    await expect(page.locator("[data-testid='claim-cl-diwali-04']")).toContainText(
      /Traditional Belief/i
    );
  });

  test("5. Knowledge Graph Visualizer renders semantic relations and links", async ({ page }) => {
    await page.goto("/knowledge/diwali", { waitUntil: "networkidle" });

    const graphSection = page.locator("[data-testid='eka-knowledge-graph-section']");
    await expect(graphSection).toBeVisible();
    await expect(page.locator("[data-testid='graph-node-ayodhya']")).toBeVisible();
    await expect(page.locator("[data-testid='graph-node-kumhar-terracotta-craft']")).toBeVisible();
  });

  test("6. AI Cultural Intelligence Assistant retrieves multi-part pedagogy", async ({ page }) => {
    await page.goto("/knowledge/diwali", { waitUntil: "networkidle" });

    const aiBox = page.locator("[data-testid='eka-ai-retrieval-box']");
    await expect(aiBox).toBeVisible();

    const queryInput = page.locator("[data-testid='ai-query-input']");
    await queryInput.scrollIntoViewIfNeeded();
    await queryInput.fill("How does Diwali differ between Tamil Nadu and Jain traditions?");
    await page.locator("[data-testid='ai-submit-btn']").click();

    // Verify AI synthesis output container
    const resultBox = page.locator("[data-testid='ai-result-container']");
    await expect(resultBox).toBeVisible({ timeout: 10000 });
    await expect(resultBox).toContainText(/Confidence:/i);
    await expect(resultBox).toContainText(/Who Practices It & Where/i);
    await expect(resultBox).toContainText(/Community Meaning & Worldview/i);
    await expect(resultBox).toContainText(/Authentic Living Experiences & Custodians/i);
  });

  test("7. Aranmula Kannadi (/knowledge/aranmula-kannadi) verifies metallurgy and GI registration", async ({
    page,
  }) => {
    await page.goto("/knowledge/aranmula-kannadi", { waitUntil: "networkidle" });

    await expect(page.locator("h1")).toContainText(/Aranmula Kannadi/i);
    await expect(page.getByText(/secret copper-tin alloy/i)).toBeVisible();

    const taxonomy = page.locator("[data-testid='eka-epistemic-taxonomy']");
    await expect(taxonomy).toContainText(/zero secondary optical refraction/i);
    await expect(taxonomy).toContainText(/Documented Fact/i);
  });

  test("8. Bohag Bihu (/knowledge/bohag-bihu) verifies 7 days and Gamusa GI Tag #594", async ({
    page,
  }) => {
    await page.goto("/knowledge/bohag-bihu", { waitUntil: "networkidle" });

    await expect(page.locator("h1")).toContainText(/Bohag Bihu \(Rongali Bihu\)/i);
    await expect(page.getByText(/Goru Bihu/i).first()).toBeVisible();

    const taxonomy = page.locator("[data-testid='eka-epistemic-taxonomy']");
    await expect(taxonomy).toContainText(/Geographical Indication \(GI\) registration under Tag No. 594/i);
  });

  test("9. Bishnoi Ecological Tradition (/knowledge/bishnoi-conservation) verifies 29 rules and Khejarli martyrdom", async ({
    page,
  }) => {
    await page.goto("/knowledge/bishnoi-conservation", { waitUntil: "networkidle" });

    await expect(page.locator("h1")).toContainText(/Bishnoi Ecological Tradition/i);
    await expect(page.getByText(/Guru Jambheshwar/i).first()).toBeVisible();
    await expect(page.getByText(/Amrita Devi/i).first()).toBeVisible();
  });

  test("10. Admin Knowledge Operations Center monitors connectors, audits image rights, and checks diagnostics", async ({
    page,
  }) => {
    await setupAuthenticatedUser(page, "admin");
    await page.goto("/admin/knowledge", { waitUntil: "networkidle" });

    // Assert main header
    await expect(page.locator("h1")).toContainText(/Knowledge & Provenance Operations Center/i);

    // Verify all 6 connectors are displayed
    await expect(page.locator("[data-testid='connector-row-wikidata']")).toBeVisible();
    await expect(page.locator("[data-testid='connector-row-wikipedia']")).toBeVisible();
    await expect(page.locator("[data-testid='connector-row-commons']")).toBeVisible();
    await expect(page.locator("[data-testid='connector-row-unesco']")).toBeVisible();
    await expect(page.locator("[data-testid='connector-row-europeana']")).toBeVisible();
    await expect(page.locator("[data-testid='connector-row-community']")).toBeVisible();

    // Test health ping on wikidata
    const pingBtn = page.locator("[data-testid='test-connector-wikidata']");
    await pingBtn.click();
    await expect(page.locator("[data-testid='connector-row-wikidata']")).toContainText(
      /Verified successfully/i
    );

    // Switch to Image Rights Auditor tab
    await page.getByRole("tab", { name: /Image Rights Auditor/i }).click();
    await expect(page.getByText(/Image Rights & Legal Compliance Auditor/i)).toBeVisible();

    // Run audit
    const runAuditBtn = page.locator("[data-testid='run-image-audit-btn']");
    await runAuditBtn.click();
    const auditResult = page.locator("[data-testid='audit-result-box']");
    await expect(auditResult).toBeVisible();
    await expect(auditResult).toContainText(/PASSED: Full Legal Compliance/i);

    // Switch to AI Retrieval Diagnostics tab
    await page.getByRole("tab", { name: /AI Retrieval Diagnostics/i }).click();
    const runDiagBtn = page.locator("[data-testid='admin-ai-run-btn']");
    await runDiagBtn.click();
    const diagResult = page.locator("[data-testid='admin-ai-diag-result']");
    await expect(diagResult).toBeVisible();
    await expect(diagResult).toContainText(/Entity Matched:/i);
  });
});
