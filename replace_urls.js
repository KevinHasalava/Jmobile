const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace /api URLs first
  content = content.replace(/'([^']*)http:\/\/localhost:5000\/api([^']*)'/g, "`$1\\${process.env.REACT_APP_API_URL}$2`");
  content = content.replace(/`([^`]*)http:\/\/localhost:5000\/api([^`]*)`/g, "`$1\\${process.env.REACT_APP_API_URL}$2`");

  // Replace remaining base URLs
  content = content.replace(/'([^']*)http:\/\/localhost:5000([^']*)'/g, "`$1\\${process.env.REACT_APP_BACKEND_URL}$2`");
  content = content.replace(/`([^`]*)http:\/\/localhost:5000([^`]*)`/g, "`$1\\${process.env.REACT_APP_BACKEND_URL}$2`");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Done!');
