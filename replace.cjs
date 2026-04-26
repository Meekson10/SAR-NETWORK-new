const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace setActivePage prop with nothing if it's the only prop, or remove it from destructuring
  content = content.replace(/\{ setActivePage \}/g, '');
  content = content.replace(/setActivePage,/g, '');
  content = content.replace(/, setActivePage/g, '');
  
  // If we have an empty destructuring like `({  }) =>`, change to `() =>`
  content = content.replace(/\(\{\s*\}\)/g, '()');

  // Add useNavigate import if needed
  if (content.includes('setActivePage(') && !content.includes('useNavigate')) {
    content = content.replace(
      /import \{ Link \} from 'react-router-dom';/,
      `import { Link, useNavigate } from 'react-router-dom';`
    );
    
    // Inject `const navigate = useNavigate();` at the beginning of the component
    content = content.replace(
      /(const [A-Z][a-zA-Z0-9_]* = \([^)]*\) => (?:\{|\())/,
      `$1\n  const navigate = useNavigate();\n`
    );
    
    // Some components might have `const Comp = () => (` which we changed to `const Comp = () => (\n  const navigate = useNavigate();\n`. 
    // If it's an implicit return with `(`, we need to change it to `{ return (`
    if (content.match(/const [A-Z][a-zA-Z0-9_]* = \([^)]*\) => \(\n  const navigate/)) {
      content = content.replace(
        /(const [A-Z][a-zA-Z0-9_]* = \([^)]*\)) => \(/,
        `$1 => {\n  const navigate = useNavigate();\n  return (`
      );
      // And we need to close the `)` with `);}` at the end.
      // But it's easier to just do it manually for the few pages. Let's just do a naive replace and fix if needed.
    }
  }

  // Replace setActivePage('route') with navigate('/route')
  content = content.replace(/setActivePage\('([^']+)'\)/g, "navigate('/$1')");

  fs.writeFileSync(filePath, content);
};

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
files.forEach(f => {
  processFile(path.join(pagesDir, f));
});

console.log('setActivePage replaced');
