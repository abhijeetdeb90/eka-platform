import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ChevronRight, Slash } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemData {
  label: string;
  to?: string;
  active?: boolean;
}

export interface EkaBreadcrumbProps {
  items?: BreadcrumbItemData[];
  className?: string;
  separator?: "chevron" | "slash";
  showHomeIcon?: boolean;
}

const ROUTE_NAME_MAP: Record<string, string> = {
  discover: "Discover",
  stories: "Stories",
  learn: "Learn",
  ask: "Ask EKA",
  community: "Community",
  knowledge: "Cultural Knowledge",
  junction: "Cultural Atlas",
  creator: "Creators",
  create: "Contribute",
  messages: "Messages",
  search: "Search",
  about: "About EKA",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  cookie: "Cookie Policy",
  guidelines: "Community Guidelines",
  my: "My Sanctuary",
};

function formatSlug(slug: string): string {
  if (ROUTE_NAME_MAP[slug.toLowerCase()]) {
    return ROUTE_NAME_MAP[slug.toLowerCase()];
  }
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function EkaBreadcrumb({
  items,
  className,
  separator = "chevron",
  showHomeIcon = true,
}: EkaBreadcrumbProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Auto-generate items from route if not explicitly supplied
  const effectiveItems = React.useMemo<BreadcrumbItemData[]>(() => {
    if (items && items.length > 0) return items;

    const segments = currentPath.split("/").filter(Boolean);
    if (segments.length === 0) return [];

    const generated: BreadcrumbItemData[] = [];
    let accumulatedPath = "";

    segments.forEach((seg, index) => {
      accumulatedPath += `/${seg}`;
      const isLast = index === segments.length - 1;
      generated.push({
        label: formatSlug(seg),
        to: isLast ? undefined : accumulatedPath,
        active: isLast,
      });
    });

    return generated;
  }, [items, currentPath]);

  if (effectiveItems.length === 0) {
    return null;
  }

  // Schema.org BreadcrumbList JSON-LD
  const schemaBreadcrumbs = [
    { name: "Home", url: "https://eka.earth/" },
    ...effectiveItems.map((item, index) => ({
      name: item.label,
      url: item.to ? `https://eka.earth${item.to}` : undefined,
    })),
  ];

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={cn(
        "flex items-center text-xs text-muted-foreground font-sans py-2.5 overflow-x-auto scrollbar-none",
        className,
      )}
    >
      {/* Microdata / Structured Data for Search Engine Hierarchy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: schemaBreadcrumbs.map((crumb, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: crumb.name,
              item: crumb.url,
            })),
          }),
        }}
      />

      <ol className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
        {/* Home Link */}
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group"
            title="Home"
          >
            {showHomeIcon && (
              <Home className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <span className="hidden sm:inline font-medium">Home</span>
          </Link>
        </li>

        {/* Separator & Breadcrumb Items */}
        {effectiveItems.map((item, idx) => {
          const isLast = idx === effectiveItems.length - 1;

          return (
            <React.Fragment key={`${item.label}-${idx}`}>
              <li
                aria-hidden="true"
                className="text-muted-foreground/40 shrink-0 select-none"
              >
                {separator === "slash" ? (
                  <Slash className="size-3 stroke-[1.5]" />
                ) : (
                  <ChevronRight className="size-3.5 stroke-[1.5]" />
                )}
              </li>

              <li
                className={cn(
                  "inline-flex items-center truncate max-w-[200px] sm:max-w-[320px]",
                  isLast && "font-medium text-foreground",
                )}
              >
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="truncate hover:text-foreground hover:underline underline-offset-4 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="truncate text-foreground/90 font-medium"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
