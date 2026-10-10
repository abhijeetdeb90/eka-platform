const fs = require('fs');
let content = fs.readFileSync('src/apps/consumer/components/ConsumerHeader.tsx', 'utf8');

// Filter left nav items
content = content.replace(
    /\{PRIMARY_NAV_ITEMS\.map\(\(l\) => \{/g,
    '{PRIMARY_NAV_ITEMS.filter(l => profile ? true : ["home", "discover"].includes(l.id)).map((l) => {'
);
content = content.replace(
    /\{PRIMARY_NAV_ITEMS\.map\(\(l, i\) => \{/g,
    '{PRIMARY_NAV_ITEMS.filter(l => profile ? true : ["home", "discover"].includes(l.id)).map((l, i) => {'
);

const targetString1 = {/* Ask EKA — persistent search/AI entry */};
// Wait, the character might be — or ?. I will use regex replacement for Ask EKA button.

content = content.replace(
    /<button[\s\S]+?Ask EKA anything\.\.\.[\s\S]+?<\/button>/,
    '{profile && (\n$&)}'
);

content = content.replace(
    /<div className="hidden lg:block shrink-0">\s*<DropdownMenu>\s*<DropdownMenuTrigger asChild>[\s\S]+?<\/DropdownMenu>\s*<\/div>/,
    '{profile && (\n$&)}'
);

content = content.replace(
    /<Button\s*asChild\s*size="sm"[\s\S]+?track\("create_started", \{ source: "header" \}\)\}      >        <Link to=\{CREATE_ACTION_ITEM\.to\}>          <Plus className="size-3\.5 mr-1 stroke-\[2\.5\]" \/>          <span>Create<\/span>        <\/Link>      <\/Button>/,
    '{profile && (\n$&)}'
);

// Fallback if formatting differs
content = content.replace(
    /<Button\s*asChild\s*size="sm"\s*className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-calm hover:shadow-lift hover:opacity-95 font-medium px-3\.5 py-1\.5 text-xs transition-all shrink-0"\s*onClick=\{\(\) => track\("create_started", \{ source: "header" \}\)\}\s*>\s*<Link to=\{CREATE_ACTION_ITEM\.to\}>\s*<Plus className="size-3\.5 mr-1 stroke-\[2\.5\]" \/>\s*<span>Create<\/span>\s*<\/Link>\s*<\/Button>/,
    '{profile && (\n$&)}'
);

content = content.replace(
    /<Link\s*to="\/search"[\s\S]+?<\/Link>\s*<Button\s*asChild\s*size="sm"\s*className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-xs font-medium px-2\.5 py-1 text-xs"[\s\S]+?<span>Create<\/span>\s*<\/Link>\s*<\/Button>/,
    '{profile && (<>\n$&</>)}'
);

content = content.replace(
    /<Button\s*asChild\s*size="sm"\s*className="w-full rounded-xl py-5 bg-gradient-to-r from-terracotta to-saffron text-white\s*font-medium shadow-calm"\s*onClick=\{\(\) => \{\s*track\("create_started", \{ source: "drawer" \}\);\s*setMobileMenuOpen\(false\);\s*\}\}\s*>\s*<Link to="\/create">\s*<Plus className="mr-1\.5 size-4 stroke-\[2\.5\]" \/>\s*<span>Contribute a Story<\/span>\s*<\/Link>\s*<\/Button>/,
    '{profile && (\n$&)}'
);

fs.writeFileSync('src/apps/consumer/components/ConsumerHeader.tsx', content);
