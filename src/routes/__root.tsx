import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { SafeNavigationProvider } from "@/components/security/SafeNavigationProvider";
import { CookieConsentBanner } from "@/components/common/CookieConsentBanner";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { LocalizationProvider } from "@/lib/i18n";
import { CulturalCommandPaletteProvider } from "@/components/search";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { registerOfflineShell } from "@/lib/offline-shell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-calm transition-all hover:bg-primary/90 hover:shadow-lift"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error instanceof Error ? error : new Error(String(error)), {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-calm transition-all hover:bg-primary/90 hover:shadow-lift"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" },
      { name: "theme-color", content: "#FAF7F2" },
      { title: "EKA Platform — The World's Trusted Cultural Intelligence Layer" },
      {
        name: "description",
        content:
          "A cultural and spiritual intelligence platform connecting communities, traditions, and creators. One Within. One With All. Don't just scroll the world. Understand it.",
      },
      { property: "og:title", content: "EKA Platform — The World's Trusted Cultural Intelligence Layer" },
      {
        property: "og:description",
        content:
          "A cultural and spiritual intelligence platform connecting communities, traditions, and creators.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/brand/eka-banner.jpg" },
      {
        property: "og:image:alt",
        content: "EKA — The World's Trusted Cultural Intelligence Layer",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/brand/eka-banner.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Karla:wght@300;400;500;600&display=swap",
      },
      { rel: "icon", href: "/brand/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/brand/eka-logo.png", type: "image/png" },
      { rel: "shortcut icon", href: "/brand/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/brand/app-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    registerOfflineShell();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <SmoothScrollProvider>
          {/* Keyboard accessibility: Skip link for screen reader and keyboard-only navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lift focus:outline-hidden"
          >
            Skip to main content
          </a>

          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <SafeNavigationProvider>
            <CulturalCommandPaletteProvider>
              <GlobalErrorBoundary boundaryName="eka_root_outlet">
                <Outlet />
              </GlobalErrorBoundary>
              <MobileBottomNav />
              <Toaster position="top-center" />
              <CookieConsentBanner />
            </CulturalCommandPaletteProvider>
          </SafeNavigationProvider>
        </SmoothScrollProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
