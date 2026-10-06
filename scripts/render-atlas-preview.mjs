// ==============================================================================
// RENDER NATURAL EARTH EDITORIAL ATLAS PREVIEW SCREENSHOT
// ==============================================================================

import { chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import { NATURAL_EARTH_COUNTRIES } from "../src/components/atlas/natural-earth-data.ts";
import { ATLAS_CATEGORIES, ATLAS_CULTURAL_OBJECTS, ATLAS_CLUSTERS } from "../src/lib/cultural-intelligence/cultural-atlas-data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const screenshotDir = path.resolve(rootDir, "..", "screenshots");

function project(lng, lat) {
  const clampedLat = Math.max(-80, Math.min(84, lat));
  const x = ((lng + 180) / 360) * 1000;
  const y = ((85 - clampedLat) / 165) * 500;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

async function renderAtlas() {
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome" });
  } catch (e) {
    browser = await chromium.launch({ channel: "msedge" });
  }

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 960 });

  // Render Natural Earth country paths
  const countriesSvg = NATURAL_EARTH_COUNTRIES
    .map(c => {
      const isIndia = c.name === "India";
      return `<path d="${c.d}" fill="${isIndia ? '#EAE3D2' : '#F1ECE1'}" stroke="#D5CDBE" stroke-width="${isIndia ? '1.2' : '0.75'}" stroke-linejoin="round" />`;
    })
    .join("\n");

  // Render objects
  const objectsSvg = ATLAS_CULTURAL_OBJECTS
    .map(o => {
      let px, py;
      if (o.coordinates.lat !== undefined && o.coordinates.lng !== undefined) {
        [px, py] = project(o.coordinates.lng, o.coordinates.lat);
      } else {
        px = (o.coordinates.x / 100) * 1000;
        py = (o.coordinates.y / 100) * 500;
      }
      const cat = ATLAS_CATEGORIES.find(c => c.id === o.category) || ATLAS_CATEGORIES[0];
      const isSelected = o.id === "obj-jaipur-blue-pottery";

      return `
        ${isSelected ? `
          <circle cx="${px}" cy="${py}" r="15" fill="${cat.accentColor}" fill-opacity="0.22" />
          <circle cx="${px}" cy="${py}" r="9" fill="none" stroke="${cat.accentColor}" stroke-width="1.2" stroke-dasharray="3 2" />
        ` : ""}
        <circle cx="${px}" cy="${py}" r="${isSelected ? 6 : 4.5}" fill="${isSelected ? cat.accentColor : '#1E2A38'}" stroke="#FFFFFF" stroke-width="${isSelected ? 2 : 1.5}" />
        <circle cx="${px}" cy="${py}" r="1.8" fill="${isSelected ? '#FFFFFF' : cat.accentColor}" />
      `;
    })
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background-color: #F8F5EE;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1C1917;
          padding: 40px;
          display: flex;
          justify-content: center;
        }
        .atlas-card {
          width: 100%;
          max-width: 1320px;
          border-radius: 28px;
          border: 1px solid rgba(28, 25, 23, 0.12);
          background: #FFFFFF;
          overflow: hidden;
          box-shadow: 0 16px 48px -24px rgba(28, 25, 23, 0.22);
        }
        .atlas-header {
          padding: 32px 40px;
          background: rgba(246, 242, 233, 0.45);
          border-bottom: 1px solid rgba(28, 25, 23, 0.08);
        }
        .atlas-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #C25E3E;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .atlas-title {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 600;
          color: #1C1917;
          margin-bottom: 8px;
        }
        .atlas-subtitle {
          font-size: 13.5px;
          color: #57534E;
          max-width: 680px;
          line-height: 1.6;
        }
        .region-bar {
          display: flex;
          gap: 8px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(28, 25, 23, 0.08);
        }
        .region-btn {
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid rgba(28, 25, 23, 0.12);
          background: #FFFFFF;
          color: #57534E;
        }
        .region-btn.active {
          background: #1C1917;
          color: #FFFFFF;
          font-weight: 600;
        }
        .category-bar {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .category-pill {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          border: 1px solid rgba(28, 25, 23, 0.08);
          background: rgba(246, 242, 233, 0.6);
          color: #57534E;
        }
        .category-pill.active {
          background: rgba(194, 94, 62, 0.15);
          border-color: #C25E3E;
          color: #C25E3E;
          font-weight: 600;
        }
        .map-stage {
          position: relative;
          width: 100%;
          height: 600px;
          background: #F4EFE6;
          overflow: hidden;
        }
        .story-card-overlay {
          position: absolute;
          left: 28px;
          bottom: 28px;
          width: 380px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(28, 25, 23, 0.12);
          padding: 22px;
          box-shadow: 0 20px 48px -12px rgba(28, 25, 23, 0.18);
        }
        .story-cat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #C25E3E;
          font-weight: 600;
        }
        .story-loc {
          font-size: 11px;
          color: #78716C;
          margin-left: 6px;
        }
        .story-h3 {
          font-family: 'Fraunces', serif;
          font-size: 19px;
          font-weight: 700;
          color: #1C1917;
          margin: 4px 0 6px 0;
        }
        .story-desc {
          font-size: 12px;
          color: #57534E;
          line-height: 1.55;
          margin-bottom: 14px;
        }
        .story-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 9999px;
          background: #9E472A;
          color: #FFFFFF;
          font-size: 11.5px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="atlas-card">
        <div class="atlas-header">
          <div class="atlas-badge">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #C25E3E; display: inline-block;"></span>
            EXPLORE THE LIVING WORLD · LIVING CULTURAL ATLAS
          </div>
          <h1 class="atlas-title">The world is full of living stories. EKA helps you understand them.</h1>
          <p class="atlas-subtitle">Cartographic discovery across sacred geography, master artisan guilds, oral epics, and ancestral foodways. Every marker links to verified human keepers.</p>
          
          <div class="region-bar">
            <div class="region-btn active">🌍 All World</div>
            <div class="region-btn">🇮🇳 India</div>
            <div class="region-btn">⛩️ Asia</div>
            <div class="region-btn">🕌 Middle East</div>
            <div class="region-btn">🦁 Africa</div>
            <div class="region-btn">🏛️ Europe</div>
            <div class="region-btn">🌽 Americas</div>
          </div>

          <div class="category-bar">
            <div class="category-pill active">✦ All Living Culture (14)</div>
            <div class="category-pill">🔥 Living Traditions (4)</div>
            <div class="category-pill">🛕 Sacred Places (2)</div>
            <div class="category-pill">🔨 Master Crafts (4)</div>
            <div class="category-pill">🍲 Foodways (1)</div>
            <div class="category-pill">📜 Oral Lore (1)</div>
            <div class="category-pill">👥 Community (2)</div>
          </div>
        </div>

        <div class="map-stage">
          <svg viewBox="0 0 1000 500" style="width: 100%; height: 100%;">
            <defs>
              <pattern id="sea-graticule" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(194, 94, 62, 0.08)" stroke-width="0.4" />
              </pattern>
            </defs>

            <!-- Ocean Base -->
            <rect width="1000" height="500" fill="#EDE7DA" />
            <rect width="1000" height="500" fill="url(#sea-graticule)" />

            <!-- Parallels -->
            <line x1="0" y1="257.5" x2="1000" y2="257.5" stroke="#C25E3E" stroke-width="0.75" stroke-dasharray="6 4" opacity="0.35" />
            <line x1="0" y1="186.3" x2="1000" y2="186.3" stroke="#9E472A" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.25" />
            <line x1="0" y1="328.7" x2="1000" y2="328.7" stroke="#9E472A" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.25" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#9E472A" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.2" />

            <text x="24" y="254" fill="#C25E3E" opacity="0.5" font-size="7.5" font-family="monospace">EQUATOR · 0°</text>
            <text x="24" y="183" fill="#9E472A" opacity="0.4" font-size="7" font-family="monospace">TROPIC OF CANCER · 23.5° N</text>

            <!-- Genuine Natural Earth Countries -->
            <g class="natural-earth-countries">
              ${countriesSvg}
            </g>

            <!-- Objects -->
            ${objectsSvg}
          </svg>

          <div class="story-card-overlay">
            <div>
              <span class="story-cat">MASTER CRAFTS</span>
              <span class="story-loc">· Rajasthan, India</span>
            </div>
            <div class="story-h3">Jaipur Blue Pottery</div>
            <p class="story-desc">An ancient non-clay ceramic tradition shaped by ground quartz, glass, and copper oxide glazes passing through centuries of master guilds.</p>
            <button class="story-btn">Explore Story →</button>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(600);

  const outputPath = path.join(screenshotDir, "living-cultural-atlas.png");
  await page.screenshot({ path: outputPath });
  console.log(`✓ Natural Earth screenshot saved to: ${outputPath}`);

  await browser.close();
}

renderAtlas().catch(console.error);
