// ==============================================================================
// BUILD NATURAL EARTH EDITORIAL WORLD MAP SVG PATHS
// ==============================================================================
// Converts official Natural Earth 110m GeoJSON into lightweight, precise SVG paths
// mapped to a 1000 x 500 coordinate plane.
// ==============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const GEOJSON_URL = "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson";

// Project [lng, lat] to [x, y] in 1000 x 500 space
// Miller-like / Equirectangular with aesthetic vertical compression
function project(lng, lat) {
  // Clamp latitudes
  const clampedLat = Math.max(-80, Math.min(84, lat));
  const x = ((lng + 180) / 360) * 1000;
  // Natural Earth / Equirectangular projection
  const y = ((85 - clampedLat) / 165) * 500;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

function coordsToSvgPath(coordinates, type) {
  let pathStr = "";

  if (type === "Polygon") {
    for (const ring of coordinates) {
      if (!ring || ring.length < 3) continue;
      pathStr += "M " + ring.map(([lng, lat]) => {
        const [x, y] = project(lng, lat);
        return `${x} ${y}`;
      }).join(" L ") + " Z ";
    }
  } else if (type === "MultiPolygon") {
    for (const poly of coordinates) {
      for (const ring of poly) {
        if (!ring || ring.length < 3) continue;
        pathStr += "M " + ring.map(([lng, lat]) => {
          const [x, y] = project(lng, lat);
          return `${x} ${y}`;
        }).join(" L ") + " Z ";
      }
    }
  }

  return pathStr.trim();
}

async function run() {
  console.log("Fetching Natural Earth 110m GeoJSON...");
  const res = await fetch(GEOJSON_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const geojson = await res.json();

  console.log(`Loaded ${geojson.features.length} country boundaries.`);

  // Group paths into continents/regions and individual countries
  const countryPaths = [];
  let allLandPath = "";

  for (const feature of geojson.features) {
    const name = feature.properties.name || feature.properties.ADMIN || "Unknown";
    const code = feature.properties.iso_a3 || feature.id || name;
    const geometry = feature.geometry;
    if (!geometry) continue;

    // Filter out Antarctica to keep the world map focused and balanced on human culture
    if (name.toLowerCase().includes("antarctica") || code === "ATA") continue;

    const d = coordsToSvgPath(geometry.coordinates, geometry.type);
    if (d) {
      countryPaths.push({ name, code, d });
      allLandPath += d + " ";
    }
  }

  console.log(`Generated ${countryPaths.length} country SVG paths.`);

  // Output as a clean TS module
  const outputCode = `// ==============================================================================
// NATURAL EARTH 110M EDITORIAL WORLD MAP PATHS
// ==============================================================================
// Standard Natural Earth cartographic geometry projected to 1000 x 500 space.
// ==============================================================================

export interface CountrySvgPath {
  name: string;
  code: string;
  d: string;
}

export const NATURAL_EARTH_WORLD_PATH = ${JSON.stringify(allLandPath.trim())};

export const NATURAL_EARTH_COUNTRIES: CountrySvgPath[] = ${JSON.stringify(countryPaths, null, 2)};
`;

  const outputPath = path.join(rootDir, "src", "components", "atlas", "natural-earth-data.ts");
  fs.writeFileSync(outputPath, outputCode, "utf-8");
  console.log(`✓ Saved Natural Earth map data to: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
}

run().catch(console.error);
