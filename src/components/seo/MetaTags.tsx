import React, { useEffect, useId } from "react";
import type { MetaTagsProps, SchemaOrgData } from "./types";

const DEFAULT_SITE_NAME = "EKA Platform";
const DEFAULT_BANNER = "/brand/eka-banner.jpg";
const DEFAULT_TWITTER_HANDLE = "@ekaplatform";

function getCanonical(rawUrl?: string): string {
  if (!rawUrl) {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${window.location.pathname}`;
    }
    return "https://eka-platform.vercel.app";
  }
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  const cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${cleanPath}`;
  }
  return `https://eka-platform.vercel.app${cleanPath}`;
}

function resolveAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return DEFAULT_BANNER;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const clean = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${clean}`;
  }
  return `https://eka-platform.vercel.app${clean}`;
}

/**
 * Updates or creates a <meta> tag in the document head client-side.
 */
function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  if (typeof document === "undefined") return;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Updates or creates a <link rel="canonical"> tag in document head.
 */
function setCanonicalTag(url: string) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * Injects or updates a Schema.org <script type="application/ld+json"> tag.
 */
function setJsonLdScript(id: string, data: unknown) {
  if (typeof document === "undefined" || !data) return;
  const scriptId = `schema-jsonld-${id}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Reusable MetaTags component.
 * Renders standard SEO, OpenGraph, and Twitter tags.
 * Hoists tags into <head> via React 19 natively and synchronizes document.head dynamically
 * during client-side route transitions for social scrapers, bots, and browser tabs.
 */
export function MetaTags({
  title,
  description = "A cultural and spiritual intelligence platform connecting communities, traditions, and creators. One Within. One With All.",
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_BANNER,
  ogImageAlt = "EKA Platform — The World's Trusted Cultural Intelligence Layer",
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogType = "website",
  canonicalUrl,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCreator = DEFAULT_TWITTER_HANDLE,
  twitterSite = DEFAULT_TWITTER_HANDLE,
  keywords,
  author = "EKA Cultural Archive",
  noIndex = false,
  publishedTime,
  modifiedTime,
  tradition,
  siteName = DEFAULT_SITE_NAME,
  locale = "en_US",
  structuredData,
  appendSiteName = true,
}: MetaTagsProps) {
  const instanceId = useId().replace(/:/g, "_");

  // Format page title
  const finalTitle =
    appendSiteName && !title.toLowerCase().includes("eka")
      ? `${title} | EKA`
      : title;

  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDesc = ogDescription || description;
  const finalOgImage = resolveAbsoluteUrl(ogImage);
  const finalTwitterTitle = twitterTitle || finalOgTitle;
  const finalTwitterDesc = twitterDescription || finalOgDesc;
  const finalTwitterImage = twitterImage ? resolveAbsoluteUrl(twitterImage) : finalOgImage;
  const finalCanonical = getCanonical(canonicalUrl);

  const parsedKeywords = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords || "cultural intelligence, world traditions, living knowledge, sacred places, wisdom, stories, communities, rituals";

  // Dynamic DOM synchronization during client-side SPA navigation
  useEffect(() => {
    if (typeof document === "undefined") return;

    // 1. Update Title
    document.title = finalTitle;

    // 2. Canonical
    setCanonicalTag(finalCanonical);

    // 3. Basic Meta
    setMetaTag('meta[name="description"]', "name", "description", description);
    setMetaTag('meta[name="robots"]', "name", "robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    if (parsedKeywords) {
      setMetaTag('meta[name="keywords"]', "name", "keywords", parsedKeywords);
    }
    if (author) {
      setMetaTag('meta[name="author"]', "name", "author", author);
    }

    // 4. OpenGraph Tags
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", siteName);
    setMetaTag('meta[property="og:title"]', "property", "og:title", finalOgTitle);
    setMetaTag('meta[property="og:description"]', "property", "og:description", finalOgDesc);
    setMetaTag('meta[property="og:url"]', "property", "og:url", finalCanonical);
    setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
    setMetaTag('meta[property="og:image"]', "property", "og:image", finalOgImage);
    setMetaTag('meta[property="og:image:alt"]', "property", "og:image:alt", ogImageAlt);
    if (ogImageWidth) {
      setMetaTag('meta[property="og:image:width"]', "property", "og:image:width", String(ogImageWidth));
    }
    if (ogImageHeight) {
      setMetaTag('meta[property="og:image:height"]', "property", "og:image:height", String(ogImageHeight));
    }
    setMetaTag('meta[property="og:locale"]', "property", "og:locale", locale);

    if (publishedTime) {
      setMetaTag('meta[property="article:published_time"]', "property", "article:published_time", publishedTime);
    }
    if (modifiedTime) {
      setMetaTag('meta[property="article:modified_time"]', "property", "article:modified_time", modifiedTime);
    }
    if (tradition) {
      setMetaTag('meta[property="article:section"]', "property", "article:section", tradition);
    }

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", twitterCard);
    setMetaTag('meta[name="twitter:site"]', "name", "twitter:site", twitterSite);
    setMetaTag('meta[name="twitter:creator"]', "name", "twitter:creator", twitterCreator);
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", finalTwitterTitle);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", finalTwitterDesc);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", finalTwitterImage);
    setMetaTag('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", ogImageAlt);

    // 6. Schema.org JSON-LD
    if (structuredData) {
      setJsonLdScript(instanceId, structuredData);
    }

    return () => {
      // Clean up injected script if component unmounts
      if (typeof document !== "undefined") {
        const script = document.getElementById(`schema-jsonld-${instanceId}`);
        if (script) {
          script.remove();
        }
      }
    };
  }, [
    finalTitle,
    description,
    finalOgTitle,
    finalOgDesc,
    finalOgImage,
    ogImageAlt,
    ogImageWidth,
    ogImageHeight,
    ogType,
    finalCanonical,
    twitterCard,
    finalTwitterTitle,
    finalTwitterDesc,
    finalTwitterImage,
    twitterCreator,
    twitterSite,
    parsedKeywords,
    author,
    noIndex,
    publishedTime,
    modifiedTime,
    tradition,
    siteName,
    locale,
    structuredData,
    instanceId,
  ]);

  // React 19 native head element hoisting
  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      {parsedKeywords && <meta name="keywords" content={parsedKeywords} />}
      {author && <meta name="author" content={author} />}
      <link rel="canonical" href={finalCanonical} />

      {/* OpenGraph Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDesc} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      {ogImageWidth && <meta property="og:image:width" content={String(ogImageWidth)} />}
      {ogImageHeight && <meta property="og:image:height" content={String(ogImageHeight)} />}
      <meta property="og:locale" content={locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {tradition && <meta property="article:section" content={tradition} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDesc} />
      <meta name="twitter:image" content={finalTwitterImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Structured Data (Schema.org) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
}
