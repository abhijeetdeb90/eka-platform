import { test, expect } from "@playwright/test";

test.describe("EKA Founder Profile & Pre-Generated Pictorial Content", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      console.log(`[PAGE CRASH] ${err.message}\n${err.stack}`);
    });

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
    });
  });

  test("Founder Profile (/founder/ad) renders AD identity, bio, vision tabs, and initiatives", async ({
    page,
  }) => {
    await page.goto("/founder/ad", { waitUntil: "networkidle" });

    // 1. Verify Page Title & Headings
    await expect(page).toHaveTitle(/AD — Founder of EKA/i);
    await expect(page.locator("h1", { hasText: "AD" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Founder, EKA").first()).toBeVisible();
    await expect(
      page.getByText(/Building the trusted intelligence layer for the world's cultures/i),
    ).toBeVisible();

    // 2. Founder avatar image
    const avatar = page.locator('img[alt*="AD — Founder of EKA"]');
    await expect(avatar).toBeVisible();

    // 3. Interactive Narrative Tabs (allow Vite cold compilation on first test)
    await page.waitForTimeout(2500);
    const tabStory = page.getByTestId("tab-story");
    await expect(tabStory).toBeVisible();
    await tabStory.click();
    await expect(page.getByText(/From Temple Archives to Frontier AI/i)).toBeVisible({
      timeout: 10000,
    });

    await page.getByTestId("tab-why").click();
    await expect(page.getByText(/Beyond the Outrage Algorithm/i)).toBeVisible();

    await page.getByTestId("tab-building").click();
    await expect(page.getByText(/The 5-Layer Technology Architecture/i)).toBeVisible();

    await page.getByTestId("tab-mission").click();
    await expect(
      page.getByText(/Anchoring Artificial Intelligence to Human Heritage/i),
    ).toBeVisible();

    // 4. Featured Initiatives
    await expect(page.getByText("1 Billion Stories Global Preservation Initiative")).toBeVisible();
    await expect(page.getByText("Multi-Faith Sacred Calendar 2026")).toBeVisible();
    await expect(page.getByText("Living Lineage Endorsement Protocol")).toBeVisible();
    await expect(page.getByText("Open Cultural Context Protocol (CCP)")).toBeVisible();

    // 5. Follow and Connect actions
    const followBtn = page.getByRole("button", { name: /Follow AD/i });
    await expect(followBtn).toBeVisible();
    await followBtn.click();
    await expect(page.getByText(/Following Dispatches/i)).toBeVisible();

    // 6. Connect Dialog
    await page.getByRole("button", { name: /Connect \/ Message/i }).click();
    await expect(page.getByRole("heading", { name: /Connect with AD's Office/i })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
  });

  test("Auto-Generated 'About EKA' section renders 7-step pipeline and 13 connection domains", async ({
    page,
  }) => {
    await page.goto("/founder/ad", { waitUntil: "networkidle" });

    // 1. What is EKA & Why EKA
    await expect(
      page.getByRole("heading", { name: "About EKA: The Architecture of Memory", exact: false }),
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("heading", { name: "What is EKA?", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Why EKA?", exact: true })).toBeVisible();

    // 2. Seven Steps of Cultural Epistemology
    await expect(page.getByText("1. Source")).toBeVisible();
    await expect(page.getByText("2. Verify")).toBeVisible();
    await expect(page.getByText("3. Contextualize")).toBeVisible();
    await expect(page.getByText("4. Learn")).toBeVisible();
    await expect(page.getByText("5. Discuss")).toBeVisible();
    await expect(page.getByText("6. Create")).toBeVisible();
    await expect(page.getByText("7. Preserve")).toBeVisible();

    // 3. What EKA Connects: Check domains exist
    const domains = [
      "Cultures",
      "Communities",
      "Traditions",
      "Spirituality",
      "Religious Places",
      "Local Life",
      "Tourism & Sacred Travel",
      "Local Brands & Artisans",
      "Creators & Mentors",
      "Community Experts",
      "Local Knowledge",
      "Historical Knowledge",
      "Contemporary Community Knowledge",
    ];

    for (const d of domains) {
      await expect(page.getByRole("heading", { name: d, exact: true })).toBeVisible();
    }

    // 4. Clicking a domain opens details modal
    const domainCard = page.getByTestId("domain-domain-cultures");
    await domainCard.scrollIntoViewIfNeeded();
    await domainCard.click();
    await expect(page.getByText("Active Real-World Examples in EKA:")).toBeVisible();
    await page.getByRole("button", { name: "Close Domain", exact: true }).click();
  });

  test("Pre-Generated Pictorial Content ('EKA — The World Through Its People') renders 20 launch cards with filters and inspection", async ({
    page,
  }) => {
    await page.goto("/founder/ad", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", { name: "EKA — The World Through Its People", exact: false }),
    ).toBeVisible({ timeout: 15000 });

    // Verify key exemplar launch cards
    await expect(
      page.getByRole("heading", { name: "A Culture Is More Than a Festival" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Why Traditions Survive Generations" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Knowledge That Never Made It Into a Textbook" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Many Ways Humans Search for Meaning" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Every Community Has a Story" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "A Place Is More Than Its Location" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Travel Beyond the Tourist Map" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Story Behind a Local Brand" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Knowledge Can Become a Livelihood" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Who Gets to Say What Is Authentic?" }),
    ).toBeVisible();

    // Verify total cards indicator
    await expect(page.getByText(/20 Launch Cards Verified/i)).toBeVisible();

    // Card Detail Modal: scroll into view and click card title
    const firstCard = page.getByTestId("card-card-1-culture");
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard
      .getByRole("heading", { name: "A Culture Is More Than a Festival" })
      .click({ force: true });
    await expect(page.getByText("Verified Source & Provenance Record")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Linked Knowledge Graph Nodes")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByText("Verified Source & Provenance Record")).not.toBeVisible();

    // Search filter test
    const searchInput = page.getByPlaceholder(/Search across traditions/i);
    await searchInput.fill("Patola");
    await expect(page.getByRole("heading", { name: "The Geometry in the Loom" })).toBeVisible();
    await searchInput.fill("");
  });

  test("Founder-Led Visual Stories ('From the Founder') renders 10 strategic principles", async ({
    page,
  }) => {
    await page.goto("/founder/ad", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "From the Founder", exact: true })).toBeVisible({
      timeout: 15000,
    });

    const founderStories = [
      "Why I Started EKA",
      "The Problem I Saw",
      "Why Cultural Knowledge Matters",
      "Why EKA Is Not Another Social Network",
      "From Content to Knowledge",
      "From Knowledge to Community",
      "Why Authenticity Matters",
      "Building With Communities, Not Just For Them",
      "India as the Starting Point",
      "The Global Vision for EKA",
    ];

    for (const title of founderStories) {
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    }

    // Verify AD x EKA stamp watermark
    await expect(page.getByText("AD · Founder, EKA").first()).toBeVisible();
  });

  test("Founder Content Studio allows authoring, AI drafting, and review controls", async ({
    page,
  }) => {
    await page.goto("/founder/ad", { waitUntil: "networkidle" });
    await expect(page.locator("h1", { hasText: "AD" })).toBeVisible({ timeout: 15000 });

    // Verify interactivity by clicking a story tab first to ensure React hydration
    await page.getByTestId("tab-story").click();
    await expect(page.getByText(/From Temple Archives to Frontier AI/i)).toBeVisible();

    // Open Studio
    const studioBtn = page.getByTestId("founder-studio-btn");
    await expect(studioBtn).toBeVisible({ timeout: 15000 });
    await studioBtn.click();
    await expect(
      page.getByRole("heading", { name: /Content Generation & Review Engine/i }),
    ).toBeVisible({ timeout: 10000 });

    // Click Generate Cultural Draft
    await page.getByRole("button", { name: /Generate Cultural Draft/i }).click();
    await expect(page.getByLabel("Card Title / Proposition")).not.toHaveValue("");

    // Close studio
    await page.getByRole("button", { name: "Close Studio" }).click();
  });

  test("/people/ad automatically redirects to /founder/ad", async ({ page }) => {
    await page.goto("/people/ad", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/founder\/ad/);
    await expect(page.locator("h1", { hasText: "AD" })).toBeVisible();
  });
});
