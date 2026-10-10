const fs = require('fs');

let content = fs.readFileSync('src/routes/index.tsx', 'utf8');
content = content.replace(
    'function EkaHomePage() {\n  const [askQuery, setAskQuery] = useState("");\n  const navigate = useNavigate();',
    'function EkaHomePage() {\n  const { data: profile } = useProfile();\n  const [askQuery, setAskQuery] = useState("");\n  const navigate = useNavigate();'
);
fs.writeFileSync('src/routes/index.tsx', content);
