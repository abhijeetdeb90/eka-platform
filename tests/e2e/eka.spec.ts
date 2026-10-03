import { test, expect } from "@playwright/test";

test.describe("EKA Platform Core User Journeys & Integrity", () => {
  test("Landing Page renders with full editorial hierarchy and branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(
      /EKA — (The Social Network for Your Inner Life|The Trusted Intelligence Layer)/,
    );

    // Verify Brand & Navigation
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(page.getByRole("link", { name: "EKA", exact: true })).toBeVisible();
    await expect(header.getByRole("link", { name: "Stories", exact: true })).toBeVisible();

    // Verify Hero Section
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify Primary CTAs
    await expect(page.getByRole("link", { name: /Join EKA/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore the Sanctuary/i })).toBeVisible();

    // Verify Pillars Section
    await expect(page.getByText("A QUIET PARADIGM SHIFT")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /The Pillars of Everyday Practice/i }),
    ).toBeVisible();
  });

  test("Practice Library renders faith-aware traditions correctly", async ({ page }) => {
    await page.goto("/practice");
    await expect(page).toHaveTitle(/Practice — A Faith-Aware Library on EKA/);

    // Verify tradition titles
    await expect(page.getByRole("heading", { name: "So-Hum Breath" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Anapanasati" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Naam Simran" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Lectio Divina" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dhikr" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Samayika" })).toBeVisible();
  });

  test("Sacred Observances calendar page loads", async ({ page }) => {
    await page.goto("/observe");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("body")).toContainText(/2026/);
  });

  test("Authentication & Onboarding page enforces accessibility and DPDP notices", async ({
    page,
  }) => {
    await page.goto("/auth");
    await expect(page.getByRole("heading", { name: /Join EKA|Welcome back/i })).toBeVisible({
      timeout: 15000,
    });

    // Verify Form Inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("autocomplete", "email");
    await expect(passwordInput).toBeVisible();

    // Verify DPDP Act and Legal links
    await expect(page.locator("body")).toContainText(/DPDP Act, 2023/);
    await expect(page.getByRole("link", { name: "Terms & Conditions" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
  });

  test("Privacy Policy & DPDP Statutory Disclosures render accurately", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Privacy Policy & DPDP Notice — EKA/);

    await expect(page.getByRole("heading", { name: /EKA Privacy Policy/i })).toBeVisible();
    await expect(page.locator("body")).toContainText("Data Fiduciary");
    await expect(page.locator("body")).toContainText("Grievance Redressal Desk");
    await expect(page.locator("body")).toContainText("grievance@eka.earth");
  });

  test("Terms of Service and Fair Fees are transparently disclosed", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /Terms & Conditions/i })).toBeVisible();
    await expect(page.locator("body")).toContainText("Community Standards");
    await expect(page.locator("body")).toContainText("Zero Miracle Guarantees");
  });

  test("Refund Policy is clearly stated", async ({ page }) => {
    await page.goto("/refund");
    await expect(page.getByRole("heading", { name: /Refund/i })).toBeVisible();
  });

  test("Cookie Policy provides explicit choice disclosures", async ({ page }) => {
    await page.goto("/cookies");
    await expect(page.getByRole("heading", { name: /Cookie Policy/i, level: 1 })).toBeVisible();
  });
});
