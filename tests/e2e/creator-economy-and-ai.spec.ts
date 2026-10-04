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
    },
    { projectId: PROJECT_ID, session: mockSession },
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
      body: JSON.stringify([
        {
          id: mockUser.id,
          username: "admin",
          display_name: "EKA Admin",
          avatar_url: null,
          bio: "EKA Research Steward",
          interests: ["Meditation", "Rituals", "Philosophy"],
        },
      ]),
    });
  });

  await page.route("**/rest/v1/subscriptions*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          plan: "monthly",
          status: "active",
          price_cents: 29900,
          currency: "INR",
          current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        },
      ]),
    });
  });
}

test.describe("EKA Creator Economy, ₹299 Membership & Ask EKA AI Layer", () => {
  test("Membership page renders ₹299/mo pricing, 9 core benefits, and 5–10% platform commission", async ({
    page,
  }) => {
    await page.goto("/membership");
    await expect(page).toHaveTitle(/EKA Membership — ₹299\/month/);

    // Verify Accessible Pricing Display
    await expect(page.locator("body")).toContainText("₹299");
    await expect(page.locator("body")).toContainText("applicable taxes");

    // Verify 9 Member Benefits Headline
    await expect(
      page.getByRole("heading", { name: "What members get", exact: true }),
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(
      "Access to EKA's structured cultural, spiritual and local-knowledge library",
    );
    await expect(page.locator("body")).toContainText(
      "AI-powered interactive exploration of EKA knowledge",
    );
    await expect(page.locator("body")).toContainText(
      "Personalized recommendations based on interests and learning behaviour",
    );
    await expect(page.locator("body")).toContainText(
      "Ask questions and receive contextual answers with relevant sources and traditions",
    );
    await expect(page.locator("body")).toContainText(
      "Explore connections between cultures, communities, places, rituals, customs and local practices",
    );
    await expect(page.locator("body")).toContainText(
      "Save and organize knowledge for future reference",
    );
    await expect(page.locator("body")).toContainText("Participate in community discussions");
    await expect(page.locator("body")).toContainText(
      "Discover creators, experts, communities, places and authentic local experiences",
    );
    await expect(page.locator("body")).toContainText(
      "Early access to selected EKA features and knowledge experiences",
    );

    // Verify AI Interactive Intelligence Layer Callout
    await expect(page.getByRole("heading", { name: /Not just a static library/i })).toBeVisible();
    await expect(page.locator("body")).toContainText(
      "Source → Context → AI Explanation → Related Knowledge",
    );
    await expect(page.locator("body")).toContainText(
      "Tradition ↔ Region ↔ Community ↔ Ritual ↔ Place",
    );

    // Verify 5–10% Platform Commission Schedule
    await expect(page.locator("body")).toContainText("5% Commission");
    await expect(page.locator("body")).toContainText("10% Commission");
    await expect(page.locator("body")).toContainText("85% Pool Share");
  });

  test("Ask EKA interactive AI layer executes 4-stage inquiry and renders cross-cultural graph", async ({
    page,
  }) => {
    await setupAuthenticatedUser(page);
    await page.goto("/app/explore");

    // Verify Ask EKA presence in Explore
    await expect(page.getByText("Ask EKA", { exact: false }).first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Interactive Knowledge Layer")).toBeVisible();

    // Verify Preset Inquiry Chips
    await expect(page.getByText("What is this tradition?")).toBeVisible();
    await expect(page.getByText("Where did it originate?")).toBeVisible();
    await expect(page.getByText("How is it practiced differently across regions?")).toBeVisible();
    await expect(page.getByText("Show me the sources and lineages")).toBeVisible();

    // Click Ask EKA button to run the inquiry
    const askButton = page.getByRole("button", { name: /Ask EKA/i }).first();
    await askButton.click();

    // Verify 4-stage pipeline tabs are visible
    await expect(page.getByRole("tab", { name: /AI Explanation/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Primary Sources/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Cultural Context/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Cross-Cultural Graph/i })).toBeVisible();

    // Inspect Primary Sources Tab
    await page.getByRole("tab", { name: /Primary Sources/i }).click();
    await expect(page.getByText("Rigveda Samhita", { exact: false })).toBeVisible();
    await expect(page.getByText("Trust Score: 98%")).toBeVisible();

    // Inspect Cross-Cultural Graph Tab
    await page.getByRole("tab", { name: /Cross-Cultural Graph/i }).click();
    const graphPanel = page.getByRole("tabpanel", { name: /Cross-Cultural Graph/i });
    await expect(graphPanel.getByText("Tradition", { exact: true })).toBeVisible();
    await expect(graphPanel.getByText("Region", { exact: true })).toBeVisible();
    await expect(graphPanel.getByText("Community", { exact: true })).toBeVisible();
    await expect(graphPanel.getByText("Ritual", { exact: true })).toBeVisible();
    await expect(graphPanel.getByText("Place", { exact: true })).toBeVisible();

    // Verify regional variations
    await expect(graphPanel.getByText("Baisakhi", { exact: true })).toBeVisible();
    await expect(graphPanel.getByText("Vishu", { exact: true })).toBeVisible();
    await expect(graphPanel.getByText("Rongali (Bohag) Bihu", { exact: true })).toBeVisible();

    // Test Save to Passport action
    const saveButton = page.getByRole("button", { name: /Save to Passport/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(page.getByText(/Saved in Passport/i)).toBeVisible();
  });

  test("Creator Studio Dashboard renders Tri-Partite earnings and 7-signal QCS score", async ({
    page,
  }) => {
    await setupAuthenticatedUser(page);
    await page.goto("/app/creator");

    // Verify Header
    await expect(page.getByRole("heading", { name: /Creator & Contributor Studio/i })).toBeVisible({
      timeout: 15000,
    });

    // Verify Tri-Partite Model Streams
    await expect(page.getByText("Attention Economy")).toBeVisible();
    await expect(page.getByText("Knowledge Economy")).toBeVisible();
    await expect(page.getByText("Trust Economy")).toBeVisible();

    // Verify QCS Score & Trust Tier
    await expect(page.getByText("Qualified Contribution Score")).toBeVisible();
    await expect(page.getByText("Trust Tier")).toBeVisible();

    // Verify Polyphonic Attribution Split Table
    await expect(page.getByText("Polyphonic Knowledge Attribution in Action")).toBeVisible();
    await expect(page.getByText("Creator (You)")).toBeVisible();
    await expect(page.getByText("Primary Source")).toBeVisible();
    await expect(page.getByText("Scholar Verifier")).toBeVisible();
    await expect(page.getByText("Community Steward")).toBeVisible();
    await expect(page.getByText("Translator")).toBeVisible();
  });

  test("Admin Creator Risk & Fraud Operations Center displays bot queue and payout dry run", async ({
    page,
  }) => {
    await setupAuthenticatedUser(page);
    await page.goto("/admin/creator-risk");

    // Verify Page Title
    await expect(page.getByRole("heading", { name: /Creator Risk & Fraud Center/i })).toBeVisible({
      timeout: 15000,
    });

    // Verify Operational Tabs
    await expect(page.getByRole("tab", { name: /Bot & Velocity/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /KYC & PAN/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Dispute Reserves/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Monthly Batch Dry Run/i })).toBeVisible();

    // Check Anomaly list
    await expect(page.getByText("reaction_velocity")).toBeVisible();
    await expect(page.getByText("circular_ring")).toBeVisible();
    await expect(page.getByText("bot_session")).toBeVisible();

    // Check Monthly Batch Dry Run Simulation
    await page.getByRole("tab", { name: /Monthly Batch Dry Run/i }).click();
    await expect(page.getByText("Knowledge Pool (85% of ₹299 Subscriptions)")).toBeVisible();
    await expect(page.getByText("Acharya Someshwar Shastri")).toBeVisible();
    await expect(page.getByRole("button", { name: /Authorize Payout Batch/i })).toBeVisible();
  });
});
