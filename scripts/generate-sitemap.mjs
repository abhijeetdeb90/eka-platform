#!/usr/bin/env node

/**
 * EKA Dynamic Sitemap Generator
 * Generates public/sitemap.xml during the build process
 * to ensure search engines (Googlebot, Bing, etc.) can discover and index
 * all canonical platform routes and dynamic cultural knowledge lineages.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const SITE_URL = (process.env.SITE_URL || "https://eka-platform.vercel.app").replace(/\/+$/, "");
const TODAY = new Date().toISOString().split("T")[0];

// 1. Define Core Canonical Routes with Priorities & Update Frequencies
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/discover", priority: "0.9", changefreq: "daily" },
  { path: "/stories", priority: "0.9", changefreq: "daily" },
  { path: "/ask", priority: "0.9", changefreq: "daily" },
  { path: "/search", priority: "0.8", changefreq: "daily" },
  { path: "/feed", priority: "0.8", changefreq: "daily" },
  { path: "/learn", priority: "0.8", changefreq: "weekly" },
  { path: "/community", priority: "0.8", changefreq: "weekly" },
  { path: "/practice", priority: "0.8", changefreq: "weekly" },
  { path: "/observe", priority: "0.8", changefreq: "weekly" },
  { path: "/standards", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/copyright", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.5", changefreq: "monthly" },
  { path: "/terms", priority: "0.5", changefreq: "monthly" },
  { path: "/cookies", priority: "0.5", changefreq: "monthly" },
  { path: "/refund", priority: "0.5", changefreq: "monthly" },
];

/**
 * Extract dynamic cultural knowledge slugs from knowledge-graph.ts
 */
function extractKnowledgeSlugs() {
  const knowledgeGraphPath = path.join(rootDir, "src", "lib", "knowledge", "knowledge-graph.ts");
  if (!fs.existsSync(knowledgeGraphPath)) {
    console.warn(`[sitemap] Warning: ${knowledgeGraphPath} not found. Skipping dynamic slugs.`);
    return [];
  }

  const content = fs.readFileSync(knowledgeGraphPath, "utf-8");
  const slugRegex = /slug:\s*["']([^"']+)["']/g;
  const slugs = new Set();

  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    const slug = match[1]?.trim();
    if (slug) {
      slugs.add(slug);
    }
  }

  return Array.from(slugs);
}

/**
 * Generate formatted sitemap.xml content
 */
function generateSitemapXml() {
  const dynamicSlugs = extractKnowledgeSlugs();
  const allUrls = [];

  // Add static routes
  for (const route of STATIC_ROUTES) {
    allUrls.push({
      loc: `${SITE_URL}${route.path}`,
      lastmod: TODAY,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  // Add dynamic knowledge detail pages
  for (const slug of dynamicSlugs) {
    allUrls.push({
      loc: `${SITE_URL}/knowledge/${encodeURIComponent(slug)}`,
      lastmod: TODAY,
      changefreq: "weekly",
      priority: "0.85",
    });
  }

  // XML Header & URL Set
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const item of allUrls) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  return { xml, count: allUrls.length, dynamicCount: dynamicSlugs.length };
}

function run() {
  console.log(`[sitemap] Generating sitemap for base URL: ${SITE_URL}...`);
  const { xml, count, dynamicCount } = generateSitemapXml();

  const publicDir = path.join(rootDir, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml, "utf-8");

  console.log(`[sitemap] Successfully wrote ${count} URLs (${dynamicCount} dynamic knowledge objects) to ${sitemapPath}`);
}

run();
