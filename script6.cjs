const fs = require('fs');
let content = fs.readFileSync('src/routes/index.tsx', 'utf8');

content = content.replace(
    /<div className="mt-8 flex flex-wrap gap-4">\s*<Link to="\/discover" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3\.5 text-sm font-semibold hover:bg-foreground\/90 transition-all shadow-md hover:shadow-lg active:scale-95">\s*Discover\s*<\/Link>\s*<Link to="\/ask" search=\{\{ q: "", mode: "canon" \}\} className="inline-flex items-center justify-center rounded-full border border-border bg-card\/60 px-8 py-3\.5 text-sm font-semibold hover:bg-accent transition-all active:scale-95">\s*Ask EKA\s*<\/Link>\s*<\/div>/,
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
