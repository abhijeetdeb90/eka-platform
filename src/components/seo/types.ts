export interface SchemaOrgData {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export interface MetaTagsProps {
  /** Page title (auto-formats with site name if suffix is enabled) */
  title: string;
  /** Meta description (recommended 120-160 characters) */
  description?: string;
  /** OpenGraph title (defaults to title) */
  ogTitle?: string;
  /** OpenGraph description (defaults to description) */
  ogDescription?: string;
  /** OpenGraph image URL (defaults to /brand/eka-banner.jpg) */
  ogImage?: string;
  /** OpenGraph image alt text */
  ogImageAlt?: string;
  /** OpenGraph image width */
  ogImageWidth?: number | string;
  /** OpenGraph image height */
  ogImageHeight?: number | string;
  /** OpenGraph type (website, article, profile, etc.) */
  ogType?: "website" | "article" | "profile" | "book" | "place" | "video.other";
  /** Canonical URL or pathname (e.g. "/stories" or "https://eka-platform.vercel.app/stories") */
  canonicalUrl?: string;
  /** Twitter card format */
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  /** Twitter title (defaults to ogTitle or title) */
  twitterTitle?: string;
  /** Twitter description (defaults to ogDescription or description) */
  twitterDescription?: string;
  /** Twitter image (defaults to ogImage) */
  twitterImage?: string;
  /** Twitter creator handle (e.g. "@ekaplatform") */
  twitterCreator?: string;
  /** Twitter site handle */
  twitterSite?: string;
  /** Comma-separated list or array of keywords */
  keywords?: string | string[];
  /** Author name */
  author?: string;
  /** Whether to prevent search engines from indexing this page */
  noIndex?: boolean;
  /** Published time for articles (ISO string) */
  publishedTime?: string;
  /** Modified time for articles (ISO string) */
  modifiedTime?: string;
  /** Cultural tradition or category tag */
  tradition?: string;
  /** Site name (defaults to "EKA Platform") */
  siteName?: string;
  /** Language/Locale (defaults to "en_US") */
  locale?: string;
  /** Schema.org structured data object or array of objects */
  structuredData?: SchemaOrgData | SchemaOrgData[];
  /** Whether to append " | EKA" to the title. Defaults to true unless title already contains EKA */
  appendSiteName?: boolean;
}
