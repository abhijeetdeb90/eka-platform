// ==============================================================================
// EKA MULTILINGUAL & REGIONAL INTELLIGENCE — TYPES
// ==============================================================================

export type SupportedLocale =
  | "en" // English (Canonical Fallback)
  | "as" // অসমীয়া (Assamese)
  | "bn" // বাংলা (Bengali)
  | "hi" // हिन्दी (Hindi)
  | "ta" // தமிழ் (Tamil)
  | "te" // తెలుగు (Telugu)
  | "mr" // मराठी (Marathi)
  | "gu" // ગુજરાતી (Gujarati)
  | "kn" // ಕನ್ನಡ (Kannada)
  | "ml" // മലയാളം (Malayalam)
  | "or" // ଓଡ଼ିଆ (Odia)
  | "pa"; // ਪੰਜਾਬੀ (Punjabi)

export type TextDirection = "ltr" | "rtl";

export type RegionalContext =
  | "assam"
  | "tamil_nadu"
  | "bengal"
  | "maharashtra"
  | "gujarat"
  | "kerala"
  | "karnataka"
  | "punjab"
  | "hindi_belt"
  | "global";

export interface LocaleInfo {
  code: SupportedLocale;
  bcp47: string;
  name: string;
  nativeName: string;
  script: string;
  dir: TextDirection;
  defaultRegion: RegionalContext;
  regionName: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleInfo> = {
  en: {
    code: "en",
    bcp47: "en-US",
    name: "English",
    nativeName: "English",
    script: "Latin",
    dir: "ltr",
    defaultRegion: "global",
    regionName: "Global",
  },
  as: {
    code: "as",
    bcp47: "as-IN",
    name: "Assamese",
    nativeName: "অসমীয়া",
    script: "Bengali-Assamese",
    dir: "ltr",
    defaultRegion: "assam",
    regionName: "Assam",
  },
  bn: {
    code: "bn",
    bcp47: "bn-IN",
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    dir: "ltr",
    defaultRegion: "bengal",
    regionName: "West Bengal",
  },
  hi: {
    code: "hi",
    bcp47: "hi-IN",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    dir: "ltr",
    defaultRegion: "hindi_belt",
    regionName: "Hindi Belt",
  },
  ta: {
    code: "ta",
    bcp47: "ta-IN",
    name: "Tamil",
    nativeName: "தமிழ்",
    script: "Tamil",
    dir: "ltr",
    defaultRegion: "tamil_nadu",
    regionName: "Tamil Nadu",
  },
  te: {
    code: "te",
    bcp47: "te-IN",
    name: "Telugu",
    nativeName: "తెలుగు",
    script: "Telugu",
    dir: "ltr",
    defaultRegion: "global",
    regionName: "Andhra Pradesh & Telangana",
  },
  mr: {
    code: "mr",
    bcp47: "mr-IN",
    name: "Marathi",
    nativeName: "मराठी",
    script: "Devanagari",
    dir: "ltr",
    defaultRegion: "maharashtra",
    regionName: "Maharashtra",
  },
  gu: {
    code: "gu",
    bcp47: "gu-IN",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    script: "Gujarati",
    dir: "ltr",
    defaultRegion: "gujarat",
    regionName: "Gujarat",
  },
  kn: {
    code: "kn",
    bcp47: "kn-IN",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    script: "Kannada",
    dir: "ltr",
    defaultRegion: "karnataka",
    regionName: "Karnataka",
  },
  ml: {
    code: "ml",
    bcp47: "ml-IN",
    name: "Malayalam",
    nativeName: "മലയാളം",
    script: "Malayalam",
    dir: "ltr",
    defaultRegion: "kerala",
    regionName: "Kerala",
  },
  or: {
    code: "or",
    bcp47: "or-IN",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    script: "Odia",
    dir: "ltr",
    defaultRegion: "global",
    regionName: "Odisha",
  },
  pa: {
    code: "pa",
    bcp47: "pa-IN",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
    dir: "ltr",
    defaultRegion: "punjab",
    regionName: "Punjab",
  },
};

export const LOCALES_LIST = Object.values(SUPPORTED_LOCALES);
