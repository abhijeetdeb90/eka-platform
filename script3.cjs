const fs = require('fs');

let content = fs.readFileSync('src/routes/index.tsx', 'utf8');

// Add imports
if (!content.includes('useProfile')) {
    content = content.replace(
        'import { track } from "@/lib/analytics";',
        'import { track } from "@/lib/analytics";\nimport { useProfile } from "@/hooks/useProfile";\nimport { supabase } from "@/integrations/supabase/client";\nimport { toast } from "sonner";'
    );
}

// Inject LoginForm
const loginFormStr = `
function HomeLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back to EKA");
      navigate({ to: "/discover" });
    }
  };

  return (
    <div className="mt-8 bg-card/40 border border-border/60 rounded-2xl p-5 shadow-sm max-w-sm backdrop-blur-sm">
      <h3 className="font-serif text-lg font-medium mb-3">Sign in to EKA</h3>
      <form onSubmit={handleLogin} className="space-y-3">
        <Input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="h-10 bg-background/50 border-border/80"
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="h-10 bg-background/50 border-border/80"
        />
        <Button type="submit" disabled={loading} className="w-full rounded-xl bg-terracotta hover:bg-terracotta/90 text-white shadow-sm">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          New to EKA? <Link to="/join" className="text-terracotta hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
`;

if (!content.includes('function HomeLoginForm')) {
    content = content.replace('function EkaHomePage() {', loginFormStr + '\nfunction EkaHomePage() {');
}

// Inside EkaHomePage, call useProfile
content = content.replace(
    /function EkaHomePage\(\) \{\n\s*const \[askQuery, setAskQuery\] = useState\(""\);\n\s*const navigate = useNavigate\(\);/,
    'function EkaHomePage() {\n  const { data: profile } = useProfile();\n  const [askQuery, setAskQuery] = useState("");\n  const navigate = useNavigate();'
);

// Replace the Hero content conditionally
content = content.replace(
    /<div className="mt-8 flex flex-wrap gap-4">\s*<Link to="\/discover"[\s\S]+?<\/Link>\s*<\/div>/,
    `{profile ? (
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/discover" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                    Discover
                  </Link>
                  <Link to="/ask" search={{ q: "", mode: "canon" }} className="inline-flex items-center justify-center rounded-full border border-border bg-card/60 px-8 py-3.5 text-sm font-semibold hover:bg-accent transition-all active:scale-95">
                    Ask EKA
                  </Link>
                </div>
              ) : (
                <HomeLoginForm />
              )}`
);

fs.writeFileSync('src/routes/index.tsx', content);
