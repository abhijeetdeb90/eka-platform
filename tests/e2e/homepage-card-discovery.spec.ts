import { test, expect } from "@playwright/test";

test.describe("EKA Homepage — Revised UX Architecture (Discovery & Knowledge)", () => {
  test.beforeEach(async ({ page }) => {
    // Suppress cookie consent banner overlay so it doesn't block interactive elements
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

  test("1. Hero renders animated headlines and Instagram-style quick entry", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Verify main hero headline is visible
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Verify presence of Instagram-style entry auth panel or session card
    const emailInput = page.locator("#hero-email");
    const passwordInput = page.locator("#hero-password");
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Floating cultural card preview is present
    const illuminator = page.getByText(/Now Illuminating on EKA/i);
    await expect(illuminator).toBeVisible();
  });

  test("2. Snapchat-style 9-destination icon bar is present and navigable", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const iconRow = page.locator("#explore-eka-icons");
    await expect(iconRow).toBeVisible();

    const expectedDestinations = [
      "Explore",
      "Cultures",
      "Communities",
      "Places",
      "Traditions",
      "Stories",
      "Creators",
      "Local",
      "Ask EKA AI",
    ];

    for (const name of expectedDestinations) {
      const destinationLink = iconRow.getByRole("link", { name: new RegExp(name, "i") });
      await expect(destinationLink).toBeVisible();
    }
  });

  test("3. Horizontal card rows render with verified badges and snap cards", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Verify 'TODAY ON EKA' carousel
    const todayRow = page.locator("#row-today-on-eka");
    await expect(todayRow).toBeVisible();

    // Verify verified source badges exist
    const verifiedBadges = todayRow.getByText(/Verified/i);
    await expect(verifiedBadges.first()).toBeVisible();

    // Check presence of other key rows
    await expect(page.locator("#row-communities")).toBeVisible();
    await expect(page.locator("#row-stories")).toBeVisible();
    await expect(page.locator("#row-places")).toBeVisible();
  });

  test("4. Progressive disclosure: Deep Knowledge Modal opens with source citation and graph nodes", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Click the explicit Inspect Knowledge Graph button in Featured Cultures
    const inspectBtn = page.getByRole("button", { name: /Inspect Knowledge Graph/i }).first();
    await inspectBtn.scrollIntoViewIfNeeded();
    await inspectBtn.click();

    // Verify modal dialog opened
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Verify epistemic source verification inside modal
    const sourceVerified = dialog.getByText(/Epistemic Source Verified/i);
    await expect(sourceVerified).toBeVisible();

    // Verify progressive exploration roadmap inside modal
    await expect(dialog.getByText(/Card/i).first()).toBeVisible();
    await expect(dialog.getByText(/Knowledge Graph/i).first()).toBeVisible();

    // Close modal
    const closeBtn = dialog.getByRole("button", { name: /Close/i }).first();
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test("5. Card bookmarking stores item in localStorage", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Find the first save button inside TODAY ON EKA row
    const saveBtn = page.locator("#row-today-on-eka button[aria-label='Save card']").first();
    await saveBtn.scrollIntoViewIfNeeded();
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Verify localStorage has saved cards
    await expect
      .poll(async () => {
        const val = await page.evaluate(() => localStorage.getItem("eka_saved_cards_v1"));
        return val ? JSON.parse(val).length : 0;
      })
      .toBeGreaterThan(0);
  });

  test("6. Interest filter chips filter cards and update count", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Click on 'Spirituality' chip
    const spiritualityChip = page.getByRole("button", { name: "Spirituality" });
    await spiritualityChip.scrollIntoViewIfNeeded();
    await expect(spiritualityChip).toBeVisible();
    await spiritualityChip.click();

    // Check that matching discoveries section appears
    const matchingSection = page.getByText(/Discoveries matching "spirituality"/i);
    await expect(matchingSection).toBeVisible();

    // Click reset to return to all interests
    const resetBtn = page.getByRole("button", { name: /Reset/i }).first();
    await resetBtn.click();
    await expect(matchingSection).not.toBeVisible();
  });

  test("7. Ask EKA AI section provides interactive sample inquiries", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const aiSection = page.locator("section[aria-labelledby='ask-eka-ai-title']");
    await aiSection.scrollIntoViewIfNeeded();
    await expect(aiSection).toBeVisible();

    // Check for ground truth verification badge
    const groundTruth = aiSection.getByText(/Ground truth verified/i);
    await expect(groundTruth).toBeVisible();

    // Check prompt buttons
    const samplePrompt = aiSection.getByRole("button", { name: /Panchaloha/i });
    await samplePrompt.scrollIntoViewIfNeeded();
    await expect(samplePrompt).toBeVisible();
    await samplePrompt.click();

    // Input should be populated
    const searchInput = aiSection.locator("input[aria-label='Ask EKA AI a question']");
    await expect(searchInput).toHaveValue(/Panchaloha/i);
  });

  test("8. EKA ₹299/mo Fellowship banner renders with benefits", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const fellowshipSection = page.locator("section[aria-labelledby='membership-section-title']");
    await expect(fellowshipSection).toBeVisible();

    // Price tag
    await expect(fellowshipSection.getByText("₹299")).toBeVisible();
    await expect(fellowshipSection.getByText(/\/ month \+ taxes/i)).toBeVisible();

    // CTA
    const trialBtn = fellowshipSection.getByRole("link", { name: /Begin 14-Day Sacred Trial/i });
    await expect(trialBtn).toBeVisible();
  });

  test("9. Zero document-level horizontal overflow across mobile & desktop", async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 390, height: 844 }, // iPhone 13
      { width: 768, height: 1024 }, // iPad
      { width: 1280, height: 800 }, // Desktop
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto("/", { waitUntil: "networkidle" });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1; // 1px rounding margin
      });
      expect(hasHorizontalScroll, `Overflow detected at ${vp.width}x${vp.height}`).toBe(false);
    }
  });
});
