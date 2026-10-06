// ==============================================================================
// EKA BRAND — APP STORE BADGES COMPONENT
// ==============================================================================
// Displays verified platform store access badges for Apple App Store (iOS)
// and Google Play (Android).
// Supports configurable availability states, beta preview notices, and telemetry.
// ==============================================================================

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { APP_STORE_CONFIG } from "@/config/app-stores";

export interface AppStoreBadgesProps {
  className?: string;
  showTitle?: boolean;
  title?: string;
  variant?: "row" | "column";
  size?: "sm" | "md";
  androidStoreUrl?: string;
  iosStoreUrl?: string;
  androidAvailable?: boolean;
  iosAvailable?: boolean;
}

/**
 * Official Apple App Store Vector Icon
 */
function AppleLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 170"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.98-12.02-14.69-6.3-9.76-11.3-21.14-15-34.13-3.7-13-5.55-25.13-5.55-36.4 0-14.34 3.73-26.25 11.2-35.73 7.47-9.48 16.9-14.28 28.3-14.4 5.37 0 11.2 1.48 17.48 4.45 6.28 2.97 10.23 4.51 11.86 4.62 1.85-.11 5.92-1.68 12.2-4.73 6.29-3.04 12.01-4.45 17.18-4.23 10.24.44 18.77 3.82 25.59 10.13 6.82 6.32 11.21 14.16 13.17 23.53-9.26 5.6-13.8 13.51-13.62 23.75.19 8.28 3.52 15.25 10 20.9 6.48 5.66 14.07 9.04 22.77 10.13-2.18 6.54-4.8 12.86-7.87 18.98zM119.22 33.15c0-6.9 2.51-13.38 7.53-19.45 5.03-6.08 11.23-10.14 18.62-12.2.65 3.92.33 7.85-.97 11.78-1.3 3.92-3.4 7.64-6.3 11.16-2.91 3.52-6.27 6.31-10.08 8.36-3.81 2.05-7.42 3.17-10.82 3.37-.1-1.01-.22-2.02-.32-3.02h.34z" />
    </svg>
  );
}

/**
 * Official Google Play Vector Icon
 */
function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path
        fill="#00E676"
        d="M325.3 234.3L100.8 9.8c-3.1 3.1-4.8 7.3-4.8 11.8v468.8c0 4.5 1.7 8.7 4.8 11.8l224.5-268.1z"
      />
      <path
        fill="#FFD600"
        d="M407.1 230.1L325.3 284 325.3 228l81.8-53.9c7.2 4.1 11.9 11.8 11.9 20.6v6.8c0 8.8-4.7 16.5-11.9 20.6z"
      />
      <path
        fill="#FF3D00"
        d="M100.8 502.2l224.5-218.2 81.8 53.9c-4.9 8.2-13.8 13.8-24.1 13.8H122.9c-8.2 0-15.8-3.4-22.1-9.5z"
      />
      <path
        fill="#00B0FF"
        d="M100.8 9.8c6.3-6.1 13.9-9.8 22.1-9.8h260.1c10.3 0 19.2 5.6 24.1 13.8l-81.8 53.9L100.8 9.8z"
      />
    </svg>
  );
}

export function AppStoreBadges({
  className,
  showTitle = true,
  title,
  variant = "row",
  size = "md",
  androidStoreUrl,
  iosStoreUrl,
  androidAvailable,
  iosAvailable,
}: AppStoreBadgesProps) {
  const finalTitle = title || APP_STORE_CONFIG.title;
  const iosConfig = APP_STORE_CONFIG.ios;
  const androidConfig = APP_STORE_CONFIG.android;

  const isIosAvailable = iosAvailable !== undefined ? iosAvailable : iosConfig.isAvailable;
  const isAndroidAvailable = androidAvailable !== undefined ? androidAvailable : androidConfig.isAvailable;

  const finalIosUrl = iosStoreUrl || iosConfig.storeUrl;
  const finalAndroidUrl = androidStoreUrl || androidConfig.storeUrl;

  const handleBadgeClick = (platform: "ios" | "android", isAvailable: boolean, url: string) => {
    track("app_store_badge_clicked", {
      platform,
      available: isAvailable,
      url,
    });

    if (!isAvailable) {
      const notice = platform === "ios" ? iosConfig.availabilityNotice : androidConfig.availabilityNotice;
      toast.info(notice, {
        description: "Public release is scheduled for Q4. Tap Join to request an invitation code.",
        duration: 4500,
      });
    }
  };

  const buttonSizeClasses = size === "sm" ? "px-3 py-2 text-xs" : "px-3.5 py-2.5 text-xs";

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {showTitle && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground/90 font-medium">
            {finalTitle}
          </span>
          <span className="h-px flex-1 bg-border/40" />
        </div>
      )}

      <div
        className={cn(
          "flex flex-wrap gap-2.5 items-stretch",
          variant === "column" ? "flex-col" : "flex-row sm:flex-nowrap"
        )}
      >
        {/* iOS App Store Badge */}
        {isIosAvailable ? (
          <a
            href={finalIosUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleBadgeClick("ios", true, finalIosUrl)}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-xl border border-border/80 bg-foreground/95 text-background shadow-xs transition-all hover:bg-foreground hover:scale-[1.02] active:scale-[0.99] select-none",
              buttonSizeClasses
            )}
            aria-label="Download EKA on the Apple App Store"
          >
            <AppleLogoIcon className="text-background" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] uppercase tracking-wider text-background/70 font-sans">
                {iosConfig.badgeHeading}
              </span>
              <span className="mt-0.5 text-xs font-semibold tracking-tight text-background font-display">
                {iosConfig.badgeSubheading}
              </span>
            </div>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => handleBadgeClick("ios", false, finalIosUrl)}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/75 text-foreground shadow-2xs transition-all hover:border-terracotta/50 hover:bg-card hover:scale-[1.01] active:scale-[0.99] text-left select-none cursor-pointer",
              buttonSizeClasses
            )}
            aria-label="Apple App Store preview information"
          >
            <AppleLogoIcon className="text-foreground/90" />
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-sans">
                  {iosConfig.badgeHeading}
                </span>
                <span className="inline-flex items-center px-1 rounded text-[7.5px] font-mono uppercase tracking-wider bg-accent text-terracotta font-semibold leading-none border border-terracotta/20">
                  {iosConfig.statusBadgeText}
                </span>
              </div>
              <span className="mt-0.5 text-xs font-semibold tracking-tight text-foreground font-display">
                {iosConfig.badgeSubheading}
              </span>
            </div>
          </button>
        )}

        {/* Google Play Badge */}
        {isAndroidAvailable ? (
          <a
            href={finalAndroidUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleBadgeClick("android", true, finalAndroidUrl)}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-xl border border-border/80 bg-foreground/95 text-background shadow-xs transition-all hover:bg-foreground hover:scale-[1.02] active:scale-[0.99] select-none",
              buttonSizeClasses
            )}
            aria-label="Get EKA on Google Play"
          >
            <GooglePlayIcon />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] uppercase tracking-wider text-background/70 font-sans">
                {androidConfig.badgeHeading}
              </span>
              <span className="mt-0.5 text-xs font-semibold tracking-tight text-background font-display">
                {androidConfig.badgeSubheading}
              </span>
            </div>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => handleBadgeClick("android", false, finalAndroidUrl)}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/75 text-foreground shadow-2xs transition-all hover:border-terracotta/50 hover:bg-card hover:scale-[1.01] active:scale-[0.99] text-left select-none cursor-pointer",
              buttonSizeClasses
            )}
            aria-label="Google Play Store preview information"
          >
            <GooglePlayIcon />
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-sans">
                  {androidConfig.badgeHeading}
                </span>
                <span className="inline-flex items-center px-1 rounded text-[7.5px] font-mono uppercase tracking-wider bg-accent text-terracotta font-semibold leading-none border border-terracotta/20">
                  {androidConfig.statusBadgeText}
                </span>
              </div>
              <span className="mt-0.5 text-xs font-semibold tracking-tight text-foreground font-display">
                {androidConfig.badgeSubheading}
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
