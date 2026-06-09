const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (filePath.includes('api.js')) return; // Skip api.js

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace backtick patterns first
  content = content.split('`http://localhost:5000/api').join('`${process.env.REACT_APP_API_URL}');
  content = content.split('`http://localhost:5000').join('`${process.env.REACT_APP_BACKEND_URL}');

  // Replace single quote patterns that start with the URL
  content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, "`\\${process.env.REACT_APP_API_URL}$1`");
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, "`\\${process.env.REACT_APP_BACKEND_URL}$1`");

  // Replace the specific error messages in Products.jsx
  content = content.split("'Products endpoint not found. Please check backend is running on http://localhost:5000'").join("`Products endpoint not found. Please check backend is running on \\${process.env.REACT_APP_BACKEND_URL}`");
  content = content.split("'Cannot connect to backend server. Make sure it\\'s running on http://localhost:5000'").join("`Cannot connect to backend server. Make sure it's running on \\${process.env.REACT_APP_BACKEND_URL}`");

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
