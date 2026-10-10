import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldAlert,
  Compass,
  ArrowRight,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";
import {
  getInvestorDemoSession,
  startInvestorDemoSession,
  endInvestorDemoSession,
  type InvestorDemoRole,
  type InvestorDemoSession,
} from "@/lib/auth/demo-session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function InvestorDemoBanner() {
  const [session, setSession] = useState<InvestorDemoSession | null>(() => getInvestorDemoSession());
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionChange = (e: Event) => {
      const customEvent = e as CustomEvent<InvestorDemoSession | null>;
      setSession(customEvent.detail ?? getInvestorDemoSession());
    };

    window.addEventListener("eka:demo-session-change", handleSessionChange);
    return () => {
      window.removeEventListener("eka:demo-session-change", handleSessionChange);
    };
  }, []);

  if (!session || !session.active) return null;

  const handleSwitchRole = (newRole: InvestorDemoRole) => {
    startInvestorDemoSession(newRole);
    toast.success(`Switched to Investor Demo role: ${newRole.toUpperCase()}`);
    if (newRole === "admin") {
      navigate({ to: "/founder-admin" });
    } else if (newRole === "enterprise") {
      navigate({ to: "/brands-enterprise" });
    } else {
      navigate({ to: "/" });
    }
  };

  const handleExit = () => {
    endInvestorDemoSession();
    toast.info("Exited Investor Demo Mode.");
    navigate({ to: "/investor" });
  };

  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
        <Button
          size="sm"
          onClick={() => setCollapsed(false)}
          className="rounded-full bg-amber-500 text-neutral-950 hover:bg-amber-400 font-mono text-xs font-semibold shadow-lg gap-1.5 px-3 border border-amber-300/40"
        >
          <ShieldAlert className="size-3.5" />
          <span>Demo Mode: {session.role.toUpperCase()}</span>
        </Button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Investor Presentation Mode Notice"
      className="bg-neutral-900 border-b border-amber-500/30 text-neutral-200 px-3 sm:px-4 py-2 text-xs relative z-50 shadow-md"
    >
      <div className="container-eka flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wider">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Investor Demo Mode
          </span>

          <span className="text-neutral-400 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="text-neutral-400">Active Role:</span>
            <span className="font-semibold text-white font-mono uppercase bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
              {session.role}
            </span>
            <span className="text-neutral-500 hidden md:inline text-[11px]">
              ({session.email})
            </span>
          </div>

          <span className="text-neutral-500 hidden lg:inline">•</span>
          <span className="text-[11px] text-emerald-400/90 hidden lg:flex items-center gap-1">
            <ShieldCheck className="size-3" />
            Production Data Protected · Sandboxed Write Actions
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs rounded-lg border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 gap-1 px-2.5 font-medium"
              >
                <span>Switch Surface</span>
                <ChevronDown className="size-3 text-neutral-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800 text-neutral-200">
              <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                Switch Investor Surface
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-800" />
              <DropdownMenuItem
                onClick={() => handleSwitchRole("consumer")}
                className="cursor-pointer text-xs hover:bg-neutral-800 focus:bg-neutral-800"
              >
                <Compass className="size-3.5 mr-2 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">EKA Consumer</span>
                  <span className="text-[10px] text-neutral-400">Discovery, Reels & Map</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSwitchRole("admin")}
                className="cursor-pointer text-xs hover:bg-neutral-800 focus:bg-neutral-800"
              >
                <Layers className="size-3.5 mr-2 text-amber-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">EKA Admin OS</span>
                  <span className="text-[10px] text-neutral-400">Cockpit, Economics & Ops</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSwitchRole("enterprise")}
                className="cursor-pointer text-xs hover:bg-neutral-800 focus:bg-neutral-800"
              >
                <Building2 className="size-3.5 mr-2 text-blue-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">EKA Enterprise</span>
                  <span className="text-[10px] text-neutral-400">Brand Growth & Trend Radar</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Investor Gateway Link */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-neutral-300 hover:text-white px-2"
          >
            <Link to="/investor">
              <span>Investor Hub</span>
              <ArrowRight className="size-3 ml-1 text-amber-400" />
            </Link>
          </Button>

          {/* Exit Demo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="h-7 text-xs text-neutral-400 hover:text-red-400 px-2"
            title="Exit Investor Demo"
          >
            <LogOut className="size-3 mr-1" />
            <span className="hidden sm:inline">Exit Demo</span>
          </Button>

          {/* Minimize */}
          <button
            onClick={() => setCollapsed(true)}
            className="text-neutral-500 hover:text-neutral-300 text-xs px-1"
            title="Minimize banner"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
