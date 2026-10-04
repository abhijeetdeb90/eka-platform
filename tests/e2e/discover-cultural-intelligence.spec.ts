import { test, expect } from "@playwright/test";

test.describe("EKA Discover & Global Culture Intelligence", () => {
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
    });
  });

  test("1. Discover page renders Cultural Guide Hero and 10 suggested prompts", async ({
    page,
  }) => {
    await page.goto("/discover", { waitUntil: "networkidle" });

    // Verify main Ask EKA hero headline
    await expect(page.getByRole("heading", { name: "Ask EKA", exact: true })).toBeVisible();
    await expect(
      page.getByText(/Understand the world, one question at a time/i),
    ).toBeVisible();

    // Verify query input
    const heroInput = page.getByTestId("ask-eka-hero-input");
    await expect(heroInput).toBeVisible();
    await expect(heroInput).toHaveAttribute("placeholder", "What are you curious about?");

    // Verify suggested prompts
    await expect(page.getByText("Why do people celebrate this?")).toBeVisible();
    await expect(page.getByText("What does this ritual mean?")).toBeVisible();
    await expect(page.getByText("Why is this food important?")).toBeVisible();
  });

  test("2. Global Cultural Intelligence Map renders with 7 regions and interactive pins", async ({
    page,
  }) => {
    await page.goto("/discover", { waitUntil: "networkidle" });

    const mapSection = page.getByTestId("eka-global-cultural-map");
    await expect(mapSection).toBeVisible();

    // Verify headings
    await expect(page.getByText("The World's Cultural Intelligence Map")).toBeVisible();
    await expect(
      page.getByText("Every place has a story. Every story connects to another."),
    ).toBeVisible();

    // Verify region buttons
    await expect(page.getByTestId("region-btn-india")).toBeVisible();
    await expect(page.getByTestId("region-btn-asia")).toBeVisible();
    await expect(page.getByTestId("region-btn-africa")).toBeVisible();
    await expect(page.getByTestId("region-btn-oceania")).toBeVisible();

    // Verify country cultural panel
    const countryPanel = page.getByTestId("country-cultural-panel");
    await expect(countryPanel).toBeVisible();

    // Verify creative illustrated map image is rendered
    await expect(
      page.locator("img[alt='EKA Global Cultural Intelligence Map']"),
    ).toBeVisible();
  });

  test("3. Clicking Ask EKA opens contextual modal with preloaded question and curiosity loops", async ({
    page,
  }) => {
    await page.goto("/discover", { waitUntil: "networkidle" });
    // Ensure React hydration has completed
    await expect(
      page.locator("[data-testid='eka-discover-page'][data-hydrated='true']"),
    ).toBeVisible({ timeout: 15000 });

    // Click suggested curiosity prompt to open modal
    const promptBtn = page.getByRole("button", { name: "🌍 Why do people celebrate this?" });
    await expect(promptBtn).toBeVisible();
    await promptBtn.click();

    // Verify modal dialog is open with question, answers, and curiosity loops
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/EKA Cultural Guide/i)).toBeVisible();
    await expect(modal.getByText(/You might also wonder/i)).toBeVisible();
    await expect(modal.getByText(/Verified source/i)).toBeVisible();
  });

  test("4. Compare Cultures section displays side-by-side cultural parallels and ONE WITH ALL", async ({
    page,
  }) => {
    await page.goto("/discover", { waitUntil: "networkidle" });

    const compareSection = page.getByTestId("compare-cultures-section");
    await expect(compareSection).toBeVisible();

    await expect(page.getByText("Compare Cultures · ONE WITH ALL")).toBeVisible();
    await expect(
      page.getByText("Different cultures. Similar human questions."),
    ).toBeVisible();

    // Verify parallel cultural cards
    await expect(page.getByText("Upanayana & Regional Rites")).toBeVisible();
    await expect(page.getByText("Seijin no Hi (Coming of Age Day)")).toBeVisible();
    await expect(page.getByText("Bar & Bat Mitzvah")).toBeVisible();
  });

  test("5. Visual Discover Feed renders cards with wonder questions and category filters", async ({
    page,
  }) => {
    await page.goto("/discover", { waitUntil: "networkidle" });

    const feed = page.getByTestId("visual-discover-feed");
    await expect(feed).toBeVisible();

    // Verify flagship wonder questions
    await expect(
      page.getByText("Why does Bali go silent for an entire day?"),
    ).toBeVisible();
    await expect(
      page.getByText("Why is tea more than a drink in Japan?"),
    ).toBeVisible();
  });

  test("6. Learn page renders simplified language and visual stories with real images", async ({
    page,
  }) => {
    await page.goto("/learn", { waitUntil: "networkidle" });

    // Verify simplified headline without jargon
    await expect(
      page.getByRole("heading", { name: "Understand the World Through Its Stories" }),
    ).toBeVisible();
    await expect(
      page.getByText("Learn how people live, celebrate, create and connect."),
    ).toBeVisible();

    // Verify map is embedded
    await expect(page.getByTestId("eka-global-cultural-map")).toBeVisible();

    // Verify visual story cards using headings
    await expect(page.getByRole("heading", { name: "Durga Puja" }).first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Japanese Tea Ceremony" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Maasai Traditions" }).first(),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Māori Culture" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Diwali" }).first()).toBeVisible();
  });
});
