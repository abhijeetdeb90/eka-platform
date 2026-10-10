const fs = require('fs');

let content = fs.readFileSync('src/components/navigation/MobileBottomNav.tsx', 'utf8');

// Add import
content = content.replace('import { MOBILE_PRIMARY_TABS } from "@/config/navigation";', 'import { MOBILE_PRIMARY_TABS } from "@/config/navigation";\nimport { useProfile } from "@/hooks/useProfile";');

// Add profile hook
content = content.replace('export function MobileBottomNav() {', 'export function MobileBottomNav() {\n  const { data: profile } = useProfile();');

// Filter
content = content.replace('{MOBILE_PRIMARY_TABS.map((item) => {', '{MOBILE_PRIMARY_TABS.filter(t => profile ? true : ["home", "discover"].includes(t.id)).map((item) => {');

fs.writeFileSync('src/components/navigation/MobileBottomNav.tsx', content);
