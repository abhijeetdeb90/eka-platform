const fs = require('fs');

let content = fs.readFileSync('src/routes/index.tsx', 'utf8');
content = content.replace(
    /className="lg:col-span-7 h-\[400px\] lg:h-\[500px\] rounded-3xl overflow-hidden shadow-2xl"/,
    'className="lg:col-span-7 h-[580px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl"'
);
fs.writeFileSync('src/routes/index.tsx', content);
