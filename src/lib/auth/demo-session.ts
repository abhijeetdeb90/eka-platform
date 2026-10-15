// ==============================================================================
// EKA INVESTOR PRESENTATION — DEMO SESSION MANAGER
// ==============================================================================
// Provides least-privilege, safe investor presentation credentials and session
// context without exposing production secrets, service keys, or real user records.
// ==============================================================================

export type InvestorDemoRole = "consumer" | "admin" | "enterprise";

export interface InvestorDemoSession {
  active: boolean;
  role: InvestorDemoRole;
  email: string;
  name: string;
  userId: string;
  roles: string[];
  startedAt: string;
}

const STORAGE_KEY = "eka_investor_demo_session";

export const DEMO_CREDENTIALS: Record<
  InvestorDemoRole,
  {
    email: string;
    name: string;
    roleName: string;
    description: string;
    roles: string[];
  }
> = {
  consumer: {
    email: "investor.consumer@eka.demo",
    name: "Investor Evaluator (Consumer)",
    roleName: "Verified Consumer Member",
    description: "Evaluates public living sanctuary, reels, map, search, and personal passport.",
    roles: ["consumer"],
  },
  admin: {
    email: "investor.admin@eka.demo",
    name: "Investor Evaluator (Admin)",
    roleName: "Controlled Demo Admin",
    description: "Evaluates Founder Cockpit, Ops Radar, Studio, Platform Economics, and Trust Center in read-only sandbox mode.",
    roles: ["admin", "founder", "moderator"],
  },
  enterprise: {
    email: "investor.enterprise@eka.demo",
    name: "Investor Evaluator (Enterprise)",
    roleName: "Verified Institutional Brand",
    description: "Evaluates Brand Growth OS, Trend Radar, Brand Brain AI, closed-loop attribution, and enterprise workspaces.",
    roles: ["enterprise", "brand"],
  },
};

/**
 * Read active demo session from localStorage or cookie
 */
export function getInvestorDemoSession(): InvestorDemoSession | null {
  // Demo roles are unauthenticated local state and must never authorize production routes.
  if (!import.meta.env.DEV) return null;

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.active && parsed.role) {
          return parsed as InvestorDemoSession;
        }
      }
    } catch (err) {
      console.warn("[InvestorDemo] Error reading demo session from localStorage:", err);
    }

    if (typeof document !== "undefined") {
      const match = document.cookie.match(/eka_demo_role=(consumer|admin|enterprise)/);
      if (match && match[1]) {
        const role = match[1] as InvestorDemoRole;
        const creds = DEMO_CREDENTIALS[role];
        return {
          active: true,
          role,
          email: creds.email,
          name: creds.name,
          userId: `demo-usr-${role}`,
          roles: creds.roles,
          startedAt: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}

/**
 * Check if investor demo mode is currently active
 */
export function isInvestorDemoActive(): boolean {
  return getInvestorDemoSession() !== null;
}

/**
 * Start or switch an investor presentation demo session
 */
export function startInvestorDemoSession(role: InvestorDemoRole): InvestorDemoSession {
  if (!import.meta.env.DEV) {
    throw new Error("Investor demo sessions are disabled outside development.");
  }

  const creds = DEMO_CREDENTIALS[role];
  const session: InvestorDemoSession = {
    active: true,
    role,
    email: creds.email,
    name: creds.name,
    userId: `demo-usr-${role}`,
    roles: creds.roles,
    startedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      if (typeof document !== "undefined") {
        document.cookie = `eka_demo_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }
      window.dispatchEvent(new CustomEvent("eka:demo-session-change", { detail: session }));
    } catch (err) {
      console.error("[InvestorDemo] Error saving demo session:", err);
    }
  }

  return session;
}

/**
 * End the investor demo session
 */
export function endInvestorDemoSession(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      if (typeof document !== "undefined") {
        document.cookie = "eka_demo_role=; path=/; max-age=0; SameSite=Lax";
      }
      window.dispatchEvent(new CustomEvent("eka:demo-session-change", { detail: null }));
    } catch (err) {
      console.error("[InvestorDemo] Error clearing demo session:", err);
    }
  }
}
