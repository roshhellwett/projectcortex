const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const filesToObfuscate = [
  'bg_auth.js',
  'content_ui.js',
  'content_ai.js'
];

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true, // Crashes DevTools if opened
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true, // Prevents pretty-printing and formatting
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable',
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false
};

// Create a dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy non-obfuscated files
const allFiles = fs.readdirSync(__dirname);
allFiles.forEach(file => {
  if (
    file.endsWith('.js') && 
    !filesToObfuscate.includes(file) && 
    file !== 'build.js' && 
    file !== 'package.json' && 
    file !== 'package-lock.json'
  ) {
    fs.copyFileSync(path.join(__dirname, file), path.join(distDir, file));
  }
});

// Copy HTML and CSS and JSON
fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(distDir, 'manifest.json'));
fs.copyFileSync(path.join(__dirname, 'content.css'), path.join(distDir, 'content.css'));
fs.copyFileSync(path.join(__dirname, 'options.html'), path.join(distDir, 'options.html'));
fs.copyFileSync(path.join(__dirname, 'popup.html'), path.join(distDir, 'popup.html'));

// Note: Ensure icons/ and demo/ are copied recursively if needed for production.

// Obfuscate target files
filesToObfuscate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const code = fs.readFileSync(filePath, 'utf8');
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscationOptions).getObfuscatedCode();
    fs.writeFileSync(path.join(distDir, file), obfuscatedCode, 'utf8');
    console.log(`Successfully obfuscated ${file}`);
  }
});

console.log('Build complete. Your secure extension is in the /dist folder ready to be packed!');
