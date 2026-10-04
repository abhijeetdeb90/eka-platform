// ==============================================================================
// EKA INSTANT VISIBLE LANGUAGE SELECTOR
// ==============================================================================
// "Don't hide this inside Settings. Put something simple in the interface: অসমীয়া ▾"
// Lets users change language with zero latency.
// Persists instantly to localStorage, cookies, and Supabase profile.
// ==============================================================================

import React, { useState } from "react";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLocalization } from "@/lib/i18n";
import type { SupportedLocale } from "@/lib/i18n/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface LanguageSelectorProps {
  className?: string;
  variant?: "header" | "compact" | "pill" | "footer";
  showIcon?: boolean;
}

export function LanguageSelector({
  className = "",
  variant = "header",
  showIcon = true,
}: LanguageSelectorProps) {
  const { locale, localeInfo, localesList, setLocale, t } = useLocalization();
  const [open, setOpen] = useState(false);

  const handleSelectLanguage = async (newLocale: SupportedLocale) => {
    try {
      await setLocale(newLocale);
      const target = localesList.find((l) => l.code === newLocale);
      toast.success(
        `${t("system.languageChanged")}: ${target?.nativeName || newLocale}`,
        {
          description: target?.name ? `${target.name} (${target.regionName})` : undefined,
          duration: 3000,
        }
      );
      setOpen(false);
    } catch (err) {
      console.error("[EKA LanguageSelector] Failed to change language:", err);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("action.chooseLanguage")}
          title={t("action.chooseLanguage")}
          className={`group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-accent/60 hover:shadow-xs focus:outline-hidden ${
            variant === "pill"
              ? "px-3 py-1.5 text-xs bg-accent/40"
              : variant === "footer"
              ? "bg-card border-border/60 text-xs py-1.5 px-3"
              : ""
          } ${className}`}
        >
          {showIcon && (
            <Globe className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
          )}
          <span className="font-sans font-semibold tracking-tight text-foreground">
            {localeInfo.nativeName}
          </span>
          <ChevronDown className="size-3 text-muted-foreground transition-transform duration-200 group-hover:text-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-72 max-h-[420px] overflow-y-auto rounded-2xl p-2 shadow-xl border-border/80 bg-background/95 backdrop-blur-md"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-semibold text-foreground">
              {t("action.chooseLanguage")}
            </span>
            <Badge
              variant="outline"
              className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground border-border/60"
            >
              12 Indian & Global
            </Badge>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground font-sans leading-tight">
            Select your language for UI & cultural stories.
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5" />

        <div className="grid grid-cols-1 gap-0.5 py-1">
          {localesList.map((item) => {
            const isSelected = item.code === locale;
            return (
              <DropdownMenuItem
                key={item.code}
                onClick={() => handleSelectLanguage(item.code)}
                className={`flex items-center justify-between rounded-xl px-2.5 py-2 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-accent/70 text-foreground"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-medium leading-none">
                      {item.nativeName}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-none">
                      ({item.name})
                    </span>
                  </div>
                  <span className="mt-1 text-[10px] text-muted-foreground/80 font-mono">
                    {item.regionName}
                  </span>
                </div>

                {isSelected ? (
                  <Check className="size-4 text-primary shrink-0" />
                ) : (
                  <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">
                    {item.code}
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-1.5" />

        <div className="px-2 py-1 text-center">
          <p className="text-[10px] text-muted-foreground/80 font-serif italic">
            "One World. Many Cultures. Your Language."
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
