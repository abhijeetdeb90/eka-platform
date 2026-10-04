export type BannerType =
  | "brand"
  | "festival"
  | "culture"
  | "place"
  | "knowledge"
  | "creator";

export interface EKABannerItem {
  id: string;
  type: BannerType;
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  curiosityQuestion?: string;
  image: string;
  location?: string;
  category?: string;
  ctaLabel: string;
  ctaRoute: string;
  secondaryCtaLabel?: string;
  secondaryCtaRoute?: string;
  season?: string;
  festival?: string;
  priority?: number;
  isActive?: boolean;
}
