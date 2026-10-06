import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function generate() {
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome" });
  } catch (e) {
    browser = await chromium.launch({ channel: "msedge" });
  }
  const page = await browser.newPage();

  // Read SVGs
  const symbolSvgPath = path.join(rootDir, "public", "brand", "logo-symbol.svg");
  const appIconSvgPath = path.join(rootDir, "public", "brand", "app-icon.svg");
  const primarySvgPath = path.join(rootDir, "public", "brand", "logo-primary.svg");
  const faviconSvgPath = path.join(rootDir, "public", "brand", "favicon.svg");

  const symbolSvg = fs.readFileSync(symbolSvgPath, "utf-8");
  const appIconSvg = fs.readFileSync(appIconSvgPath, "utf-8");
  const primarySvg = fs.readFileSync(primarySvgPath, "utf-8");
  const faviconSvg = fs.readFileSync(faviconSvgPath, "utf-8");

  // 1. Render standalone symbol at 512x512 transparent
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; display: flex; align-items: center; justify-content: center; width: 512px; height: 512px; overflow: hidden; }
          svg { width: 440px; height: 440px; }
        </style>
      </head>
      <body>${symbolSvg}</body>
    </html>
  `);
  const symbolPng = await page.screenshot({ omitBackground: true });

  // Save to target locations
  fs.writeFileSync(path.join(rootDir, "public", "brand", "eka-logo.png"), symbolPng);
  fs.writeFileSync(path.join(rootDir, "src", "assets", "brand", "eka-logo.png"), symbolPng);
  fs.writeFileSync(path.join(rootDir, "src", "assets", "EKA Logo Icon (1).png"), symbolPng);
  fs.writeFileSync(path.join(rootDir, "src", "assets", "EKA Logo Icon (2).png"), symbolPng);
  console.log("✓ Rendered eka-logo.png (512x512 transparent PNG)");

  // 2. Render favicon at 64x64
  await page.setViewportSize({ width: 64, height: 64 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; overflow: hidden; }
          svg { width: 60px; height: 60px; }
        </style>
      </head>
      <body>${faviconSvg}</body>
    </html>
  `);
  const faviconPng = await page.screenshot({ omitBackground: true });
  fs.writeFileSync(path.join(rootDir, "public", "favicon.png"), faviconPng);
  console.log("✓ Rendered public/favicon.png (64x64)");

  // 3. Render app-icon at 512x512
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; width: 512px; height: 512px; overflow: hidden; }
          svg { width: 512px; height: 512px; }
        </style>
      </head>
      <body>${appIconSvg}</body>
    </html>
  `);
  const appIconPng = await page.screenshot({ omitBackground: true });
  fs.writeFileSync(path.join(rootDir, "public", "brand", "app-icon.png"), appIconPng);
  console.log("✓ Rendered public/brand/app-icon.png (512x512)");

  // 4. Render primary horizontal lockup at 1200x630 (social / OG preview)
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #11161F 0%, #1A222D 50%, #0E131A 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 1200px;
            height: 630px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #FFFFFF;
            overflow: hidden;
            position: relative;
          }
          .grid-overlay {
            position: absolute;
            inset: 0;
            background-image: 
              radial-gradient(circle at 50% 50%, rgba(194, 94, 62, 0.12) 0%, transparent 65%),
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 100% 100%, 48px 48px, 48px 48px;
            pointer-events: none;
          }
          .container {
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 40px;
          }
          .symbol-wrap {
            width: 140px;
            height: 140px;
            margin-bottom: 28px;
            filter: drop-shadow(0 12px 32px rgba(194, 94, 62, 0.25));
          }
          .symbol-wrap svg {
            width: 100%;
            height: 100%;
          }
          .brand-title {
            font-size: 52px;
            font-weight: 800;
            letter-spacing: 0.24em;
            margin: 0 0 12px 0;
            color: #F8FAFC;
          }
          .positioning {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 0.18em;
            color: #E2734E;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          .tagline {
            font-size: 22px;
            font-weight: 300;
            color: #94A3B8;
            max-width: 700px;
            line-height: 1.5;
            margin: 0;
          }
          .hook {
            margin-top: 24px;
            font-size: 15px;
            font-family: monospace;
            letter-spacing: 0.12em;
            color: #64748B;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 18px;
          }
        </style>
      </head>
      <body>
        <div class="grid-overlay"></div>
        <div class="container">
          <div class="symbol-wrap">
            ${symbolSvg.replace(/stroke="#1E2A38"/g, 'stroke="#F1F5F9"')}
          </div>
          <h1 class="brand-title">EKA</h1>
          <div class="positioning">The World's Trusted Cultural Intelligence Layer</div>
          <p class="tagline">One Within. One With All.</p>
          <div class="hook">DON'T JUST SCROLL THE WORLD. UNDERSTAND IT.</div>
        </div>
      </body>
    </html>
  `);
  const ogPng = await page.screenshot({ type: "jpeg", quality: 90 });
  fs.writeFileSync(path.join(rootDir, "public", "brand", "eka-banner.jpg"), ogPng);
  fs.writeFileSync(path.join(rootDir, "public", "brand", "eka-banner-sunset.jpg"), ogPng);
  fs.writeFileSync(path.join(rootDir, "src", "assets", "brand", "eka-banner.jpg"), ogPng);
  console.log("✓ Rendered universal OG banner image (1200x630 JPEG)");

  await browser.close();
  console.log("All brand assets generated successfully!");
}

generate().catch((err) => {
  console.error("Error generating brand assets:", err);
  process.exit(1);
});
