const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filePath = path.join(pagesDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix double navigate
  content = content.replace(/const navigate = useNavigate\(\);\n\s*return \(\n\s*const navigate = useNavigate\(\);\n/g, 'const navigate = useNavigate();\n  return (\n');
  
  // Fix implicit returns that were broken
  if (content.match(/=> {\n  const navigate = useNavigate\(\);\n  return \(/) && content.endsWith(';\n')) {
    // replace `); \n export default` with `);\n};\nexport default`
    content = content.replace(/\);\n\n\nexport default/, ');\n};\n\nexport default');
    content = content.replace(/\);\n\nexport default/, ');\n};\n\nexport default');
  }

  // A more robust fix for the closing bracket:
  // if the file contains `return (` but does not end with `};\nexport default`, fix it
  if (content.includes('return (') && !content.includes('};\nexport default')) {
    content = content.replace(/\);\n*export default/, ');\n};\n\nexport default');
  }

  fs.writeFileSync(filePath, content);
});

console.log('Syntax fixed');
