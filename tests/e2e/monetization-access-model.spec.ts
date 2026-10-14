import { test, expect } from "@playwright/test";

test.describe("EKA Monetization & Access Model", () => {
  test.beforeEach(async ({ page }) => {
    // Suppress cookie consent overlay
    await page.addInitScript(() => {
      localStorage.setItem(
        "eka_cookie_consent_v1",
        JSON.stringify({
          necessary: true,
          analytics: false,
          marketing: false,
          timestamp: Date.now(),
        }),
      );
      // Ensure default free tier
      localStorage.removeItem("eka_user_tier_preview");
    });
  });

  test("1. Learn page renders free cultural library & Ask EKA 🔒 gated button", async ({
    page,
  }) => {
    await page.goto("/learn");

    // Verify main headline
    await expect(
      page.getByRole("heading", { name: "Understand the World Through Its Stories", exact: true }),
    ).toBeVisible();

    // Verify monetization model banner
    await expect(
      page.getByText("Knowledge is free. Intelligence is paid. Creation is paid."),
    ).toBeVisible();
    await expect(
      page.getByText("Discover → Read → Explore → Follow"),
    ).toBeVisible();
    await expect(
      page.getByText("Ask → Understand → Compare → Research"),
    ).toBeVisible();
    await expect(
      page.getByText("Create → Publish → Analyse → Grow"),
    ).toBeVisible();

    // Verify Global Cultural Map is open to all
    const mapSection = page.getByTestId("eka-global-cultural-map");
    await expect(mapSection).toBeVisible();
    await expect(
      page.getByText("The World's Cultural Intelligence Map · Free Cultural Library"),
    ).toBeVisible();

    // Verify Ask EKA 🔒 button on visual stories
    const askButtons = page.getByRole("button", { name: /Ask EKA/i });
    await expect(askButtons.first()).toBeVisible();
    await expect(
      page.getByText("Understand more with EKA AI").first(),
    ).toBeVisible();
  });

  test("2. Clicking Ask EKA 🔒 on Learn page opens Intelligence Paywall Modal for free users", async ({
    page,
  }) => {
    await page.goto("/learn");
    await expect(
      page.getByRole("heading", { name: "Understand the World Through Its Stories", exact: true }),
    ).toBeVisible({ timeout: 15000 });

    // Click Ask EKA button on first story card in the Living Stories section
    const firstStoryCard = page.locator("article").first();
    await expect(firstStoryCard).toBeVisible();
    const askBtn = firstStoryCard.getByRole("button", { name: /Ask EKA/i });
    await expect(askBtn).toBeVisible();
    await askBtn.click();

    // Verify Intelligence Paywall Modal opens
    const modal = page.getByTestId("intelligence-paywall-modal");
    await expect(modal).toBeVisible();

    // Verify paywall modal title and hook
    await expect(
      modal.getByText("Understand more with EKA AI"),
    ).toBeVisible();
    await expect(
      modal.getByText(/Go beyond the story/i),
    ).toBeVisible();
    await expect(
      modal.getByText(/Ask questions\. Compare cultures\. Explore deeper\. Create with EKA\./i),
    ).toBeVisible();

    // Verify canonical feature table in modal
    await expect(modal.getByText("Explore the global map")).toBeVisible();
    await expect(modal.getByText("Read all cultural stories", { exact: true })).toBeVisible();
    await expect(modal.getByText("EKA AI", { exact: true })).toBeVisible();
    await expect(modal.getByText("Creator Studio", { exact: true })).toBeVisible();

    // Verify upgrade and preview actions
    await expect(
      modal.getByRole("link", { name: /Subscribe to EKA\+ \(₹499\/month\)/i }),
    ).toBeVisible();
    await expect(
      modal.getByRole("button", { name: /Preview EKA\+ Now/i }),
    ).toBeVisible();
  });

  test("3. Subscription screen (/membership) presents full monetization architecture & feature matrix", async ({
    page,
  }) => {
    await page.goto("/membership");

    // Verify header and philosophy
    await expect(
      page.getByRole("heading", { name: "Go beyond the story.", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Knowledge is free. Intelligence is premium. Creation is rewarded.").first(),
    ).toBeVisible();

    // Verify the product tiers
    await expect(
      page.getByText("Discover → Read → Publish → Connect").first(),
    ).toBeVisible();
    await expect(
      page.getByText("Ask AI → Understand → Research → Analytics").first(),
    ).toBeVisible();

    // Verify the feature matrix table
    await expect(page.getByText("Free vs. Paid Feature Matrix")).toBeVisible();
    const table = page.getByRole("table");
    await expect(table).toBeVisible();
    await expect(table.getByText("Explore the global map")).toBeVisible();
    await expect(table.getByText("Read all cultural stories")).toBeVisible();
    await expect(table.getByText("View images, traditions & places")).toBeVisible();
    await expect(table.getByText("Explore cultures & communities")).toBeVisible();
    await expect(table.getByText("Search cultural knowledge")).toBeVisible();
    await expect(table.getByText(/Ask EKA AI/i)).toBeVisible();
    await expect(table.getByText(/cultural comparisons/i)).toBeVisible();
    await expect(table.getByText(/research/i).first()).toBeVisible();
    await expect(table.getByText(/Creator Studio/i)).toBeVisible();
    await expect(table.getByText(/Free publishing/i)).toBeVisible();
    await expect(table.getByText(/Creator.*analytics/i)).toBeVisible();
  });

  test("4. Creator Studio is clearly positioned as a paid workspace", async ({
    page,
  }) => {
    // Authenticate a free mock user
    const mockUser = {
      id: "00000000-0000-0000-0000-000000000099",
      aud: "authenticated",
      role: "authenticated",
      email: "seeker@eka.earth",
      app_metadata: { provider: "email", providers: ["email"], role: "seeker" },
      user_metadata: { username: "seeker", display_name: "Cultural Seeker" },
      created_at: new Date().toISOString(),
    };
    const mockSession = {
      access_token: "mock-jwt-token-free-user",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      user: mockUser,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };

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

    await page.goto("/auth");
    await page.evaluate(({ session }) => {
      localStorage.setItem("sb-kbiutqzhcbyuseygcspe-auth-token", JSON.stringify(session));
      localStorage.setItem("sb-auth-token", JSON.stringify(session));
      localStorage.setItem("eka_user_tier_preview", "free");
    }, { session: mockSession });

    await page.goto("/creator-studio");

    // Free user navigating to creator dashboard encounters the Paid Workspace Gate
    const workspaceGate = page.getByTestId("creator-workspace-gate");
    await expect(workspaceGate).toBeVisible();

    await expect(
      page.getByText("Creator Studio — Professional Workspace"),
    ).toBeVisible();
    await expect(
      page.getByText("Paid Workspace · Creator Tier"),
    ).toBeVisible();
    await expect(
      page.getByText("Create → Publish → Analyse → Grow"),
    ).toBeVisible();
    await expect(
      page.getByText(/Creator Studio is clearly positioned as a paid workspace/i),
    ).toBeVisible();

    // Verify upgrade and preview demo CTAs
    await expect(
      page.getByRole("link", { name: /Unlock Creator Studio with EKA\+ \(₹499\/month\)/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Instant Workspace Demo Preview/i }),
    ).toBeVisible();
  });
});
