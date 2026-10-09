import type { SchemaOrgData } from "./types";

/**
 * Creates a WebApplication schema for EKA apps
 */
export function createWebApplicationSchema(custom?: Partial<SchemaOrgData>): SchemaOrgData {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "EKA Platform",
    applicationCategory: "LifestyleApplication, EducationalApplication",
    operatingSystem: "All",
    description: "A cultural and spiritual intelligence platform connecting communities, traditions, and creators. One Within. One With All.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    ...custom,
  };
}

/**
 * Creates an Article / Story schema
 */
export function createArticleSchema(options: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  tradition?: string;
}): SchemaOrgData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
    image: options.imageUrl || "https://eka-platform.vercel.app/brand/eka-banner.jpg",
    datePublished: options.datePublished || new Date().toISOString(),
    dateModified: options.dateModified || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: options.authorName || "EKA Cultural Living Archive",
    },
    publisher: {
      "@type": "Organization",
      name: "EKA Platform",
      logo: {
        "@type": "ImageObject",
        url: "https://eka-platform.vercel.app/brand/eka-logo.png",
      },
    },
    articleSection: options.tradition || "Cultural Knowledge",
  };
}

/**
 * Creates a FAQ / Question schema for Ask EKA queries
 */
export function createFaqPageSchema(questions: Array<{ question: string; answer: string }>): SchemaOrgData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Creates a BreadcrumbList schema
 */
export function createBreadcrumbSchema(items: Array<{ name: string; item: string }>): SchemaOrgData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith("http") ? crumb.item : `https://eka-platform.vercel.app${crumb.item}`,
    })),
  };
}
