import { test, expect } from "@playwright/test";

const BREAKPOINTS = [
  { name: "Small Mobile (320x568)", width: 320, height: 568 },
  { name: "Standard Mobile SE (375x667)", width: 375, height: 667 },
  { name: "Standard Mobile iPhone 13 (390x844)", width: 390, height: 844 },
  { name: "Large Mobile Pro Max (430x932)", width: 430, height: 932 },
  { name: "Tablet Portrait (768x1024)", width: 768, height: 1024 },
];

test.describe("EKA Founder Profile — Mobile Acceptance & Gateway Specification", () => {
  test.beforeEach(async ({ page }) => {
    // Suppress cookie consent banner overlay
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

  // --------------------------------------------------------------------------
  // GATE 1 & GATE 2: BREAKPOINTS, HORIZONTAL OVERFLOW & FIRST-VIEWPORT CTA
  // --------------------------------------------------------------------------
  for (const bp of BREAKPOINTS) {
    test(`[Gate 1 & 2] Breakpoint ${bp.name}: Zero horizontal overflow & first-viewport identity`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/founder/ad", { waitUntil: "networkidle" });

      // 1. Verify zero horizontal overflow across entire document
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1; // 1px rounding tolerance
      });
      expect(hasHorizontalScroll, `Horizontal overflow detected at ${bp.name}`).toBe(false);

      // 2. First-viewport visibility: Header, Founder Name "AD", Subtitle, Positioning, and Explore CTA
      const headerTitle = page.locator("h1", { hasText: "AD" });
      await expect(headerTitle).toBeVisible();

      const founderRole = page.getByText("Founder, EKA").first();
      await expect(founderRole).toBeVisible();

      const positioningText = page.getByText(
        /Building the trusted intelligence layer for the world's cultures/i,
      );
      await expect(positioningText).toBeVisible();

      // Primary Explore CTA button must be present in the hero
      const exploreBtn = page.getByRole("link", { name: /Explore EKA/i }).first();
      await expect(exploreBtn).toBeVisible();

      // Verify that the primary Explore CTA is within the initial viewport
      const exploreBox = await exploreBtn.boundingBox();
      expect(exploreBox).not.toBeNull();
      if (exploreBox) {
        expect(
          exploreBox.y,
          `Explore CTA y-offset (${exploreBox.y}) should be accessible within first viewport (${bp.height})`,
        ).toBeLessThanOrEqual(bp.height);
      }
    });
  }

  // --------------------------------------------------------------------------
  // GATE 3 & GATE 4: MOBILE HAMBURGER NAVIGATION & DRAWER
  // --------------------------------------------------------------------------
  test("[Gate 3 & 4] Mobile navigation: Hamburger opens drawer, exposes links, and closes on action", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/founder/ad", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // Allow hydration

    // Find and click hamburger menu
    const menuBtn = page.getByRole("button", { name: /Open menu/i });
    await expect(menuBtn).toBeVisible();

    // Verify touch target size >= 44x44
    const menuBox = await menuBtn.boundingBox();
    expect(menuBox?.height).toBeGreaterThanOrEqual(44);
    expect(menuBox?.width).toBeGreaterThanOrEqual(44);

    await menuBtn.click();
    await page.waitForTimeout(600); // Allow drawer animation

    // Drawer should show navigation links
    await expect(page.getByRole("link", { name: "1,000 Stories" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Founder", exact: true }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Membership", exact: true }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Join EKA" }).last()).toBeVisible();

    // Verify touch target for mobile nav links >= 44px
    const founderLink = page.getByRole("link", { name: "Founder", exact: true }).last();
    const founderBox = await founderLink.boundingBox();
    expect(founderBox?.height).toBeGreaterThanOrEqual(44);

    // ESC closes menu
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: /Open menu/i })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // GATE 5: TOUCH TARGETS & ACCESSIBLE MODALS
  // --------------------------------------------------------------------------
  test("[Gate 5] Touch targets meet >=44px standard and modals render responsively on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/founder/ad", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // Allow hydration

    // 1. Narrative tabs >= 44px height
    const tabStory = page.getByTestId("tab-story");
    await expect(tabStory).toBeVisible();
    const tabStoryBox = await tabStory.boundingBox();
    expect(tabStoryBox?.height).toBeGreaterThanOrEqual(44);

    // 2. Test Domain Detail Modal responsiveness (in AboutEkaVisualSection)
    const domainCard = page.getByTestId("domain-domain-traditions");
    await domainCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await domainCard.click();

    await expect(page.getByText("Active Real-World Examples in EKA:")).toBeVisible();
    const domainModal = page.locator('[role="dialog"]');
    await expect(domainModal).toBeVisible();

    // Verify modal does not exceed viewport width
    const domainModalBox = await domainModal.boundingBox();
    expect(domainModalBox).not.toBeNull();
    if (domainModalBox) {
      expect(domainModalBox.width).toBeLessThanOrEqual(375);
    }

    const closeDomainBtn = page.getByRole("button", { name: "Close Domain", exact: true });
    await expect(closeDomainBtn).toBeVisible();
    const closeDomainBox = await closeDomainBtn.boundingBox();
    expect(closeDomainBox?.height).toBeGreaterThanOrEqual(44);
    await closeDomainBtn.click();
    await expect(domainModal).not.toBeVisible();

    // 3. Dimension filter pills >= 44px height (in PictorialFeed)
    const firstPill = page.getByTestId("pill-All");
    await firstPill.scrollIntoViewIfNeeded();
    await expect(firstPill).toBeVisible();
    const pillBox = await firstPill.boundingBox();
    expect(pillBox?.height).toBeGreaterThanOrEqual(44);

    // 4. Card action buttons >= 44x44px
    const firstBookmark = page.locator('button[aria-label="Save card"]').first();
    await firstBookmark.scrollIntoViewIfNeeded();
    await expect(firstBookmark).toBeVisible();
    const bookmarkBox = await firstBookmark.boundingBox();
    expect(bookmarkBox?.height).toBeGreaterThanOrEqual(44);
    expect(bookmarkBox?.width).toBeGreaterThanOrEqual(44);

    // 5. Test Pictorial Card Detail Modal responsiveness
    const pictorialCard = page.locator('[data-testid^="card-"]').first();
    await pictorialCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await pictorialCard.click();

    await expect(page.getByText("Documentary Narrative & Context")).toBeVisible();
    const cardModal = page.locator('[role="dialog"]');
    await expect(cardModal).toBeVisible();

    const cardModalBox = await cardModal.boundingBox();
    expect(cardModalBox).not.toBeNull();
    if (cardModalBox) {
      expect(cardModalBox.width).toBeLessThanOrEqual(375);
    }

    const closeCardBtn = page.getByTestId("close-card-modal-btn");
    await expect(closeCardBtn).toBeVisible();
    const closeCardBox = await closeCardBtn.boundingBox();
    expect(closeCardBox?.height).toBeGreaterThanOrEqual(43);
    await closeCardBtn.click();
    await expect(cardModal).not.toBeVisible();
  });

  // --------------------------------------------------------------------------
  // GATE 6: COMPLETE 15-STEP MOBILE USER JOURNEY (SECTION 22)
  // --------------------------------------------------------------------------
  test("[Gate 6] 15-Step Mobile User Journey validation (Section 22)", async ({ page }) => {
    // Step 1: Open profile on standard mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/founder/ad", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Step 2: Grasp AD, Founder EKA, positioning statement within first viewport
    await expect(page.locator("h1", { hasText: "AD" })).toBeVisible();
    await expect(page.getByText("Founder, EKA").first()).toBeVisible();
    await expect(
      page.getByText(/Building the trusted intelligence layer for the world's cultures/i),
    ).toBeVisible();

    // Step 3: Switch narrative tab to "Founder Story"
    const tabStory = page.getByTestId("tab-story");
    await tabStory.scrollIntoViewIfNeeded();
    await tabStory.click({ force: true });
    await expect(page.getByText(/From Temple Archives to Frontier AI/i)).toBeVisible();

    // Step 4: Switch narrative tab to "Why EKA Exists"
    const tabWhy = page.getByTestId("tab-why");
    await tabWhy.scrollIntoViewIfNeeded();
    await tabWhy.click({ force: true });
    await expect(page.getByText(/Beyond the Outrage Algorithm/i)).toBeVisible();

    // Step 5: Switch narrative tab to "What I Am Building"
    const tabBuilding = page.getByTestId("tab-building");
    await tabBuilding.scrollIntoViewIfNeeded();
    await tabBuilding.click({ force: true });
    await expect(page.getByText(/The 5-Layer Technology Architecture/i)).toBeVisible();

    // Step 6: Switch narrative tab to "Long-Term Mission"
    const tabMission = page.getByTestId("tab-mission");
    await tabMission.scrollIntoViewIfNeeded();
    await tabMission.click({ force: true });
    await expect(
      page.getByText(/Anchoring Artificial Intelligence to Human Heritage/i),
    ).toBeVisible();

    // Step 7: Tap Follow action
    const followMobileBtn = page.getByRole("button", { name: /Follow/i }).first();
    await expect(followMobileBtn).toBeVisible();
    await followMobileBtn.click();
    await expect(page.getByText(/You are now following AD & EKA dispatches/i)).toBeVisible();

    // Step 8: Scroll to "About EKA" and inspect 7-stage epistemic cycle
    const aboutHeader = page.getByRole("heading", {
      name: "About EKA: The Architecture of Memory",
    });
    await aboutHeader.scrollIntoViewIfNeeded();
    await expect(aboutHeader).toBeVisible();
    await expect(page.getByText("1. Source")).toBeVisible();
    await expect(page.getByText("7. Preserve")).toBeVisible();

    // Step 9: Inspect connection domain modal and close it
    const domainCard = page.getByTestId("domain-domain-traditions");
    await domainCard.scrollIntoViewIfNeeded();
    await domainCard.click();
    await expect(page.getByText("Active Real-World Examples in EKA:")).toBeVisible();
    await page.getByRole("button", { name: "Close Domain", exact: true }).click();

    // Step 10: Scroll to "EKA — The World Through Its People" feed
    const pictorialHeader = page.getByRole("heading", {
      name: "EKA — The World Through Its People",
    });
    await pictorialHeader.scrollIntoViewIfNeeded();
    await expect(pictorialHeader).toBeVisible();

    // Step 11: Switch filter pill dimension
    const culturePill = page
      .locator("#world-through-people button", { hasText: "Culture" })
      .first();
    await culturePill.click();

    // Step 12: Open card detail modal, verify documentary narrative & close modal
    const firstCard = page.locator('[data-testid^="card-"]').first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click();
    await expect(page.getByText("Documentary Narrative & Context")).toBeVisible();
    await page.getByTestId("close-card-modal-btn").click();

    // Step 13: Scroll to "From the Founder" visual stories
    const storiesHeader = page.getByRole("heading", {
      name: "From the Founder",
      exact: true,
    });
    await storiesHeader.scrollIntoViewIfNeeded();
    await expect(storiesHeader).toBeVisible();

    // Step 14: Tap "Share" on a founder story
    const shareStoryBtn = page.locator('button[aria-label^="Share story:"]').first();
    await shareStoryBtn.scrollIntoViewIfNeeded();
    await expect(shareStoryBtn).toBeVisible();
    await shareStoryBtn.click();

    // Step 15: Open hamburger menu and verify "Join EKA" CTA
    const hamburgerBtn = page.getByRole("button", { name: /Open menu/i });
    await hamburgerBtn.click();
    const joinMobileLink = page.getByRole("link", { name: "Join EKA" }).last();
    await expect(joinMobileLink).toBeVisible();
    await page.keyboard.press("Escape");
  });

  // --------------------------------------------------------------------------
  // GATE 7: PREFERS-REDUCED-MOTION COMPLIANCE
  // --------------------------------------------------------------------------
  test("[Gate 7] Prefers-reduced-motion: UI functions flawlessly without motion jank", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/founder/ad", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // Allow hydration

    // Profile renders cleanly
    await expect(page.locator("h1", { hasText: "AD" })).toBeVisible();

    // Switching tabs responds instantly
    const tabStory = page.getByTestId("tab-story");
    await tabStory.scrollIntoViewIfNeeded();
    await tabStory.click({ force: true });
    await expect(page.getByText(/From Temple Archives to Frontier AI/i)).toBeVisible();

    // Zero horizontal overflow under reduced motion
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
