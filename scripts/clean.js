// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const targets = [
  path.join(rootDir, 'dist'),
  path.join(rootDir, 'dist_webstore'),
  path.join(rootDir, 'releases'),
  path.join(rootDir, '.early.coverage'),
  path.join(rootDir, 'server', '.next')
];

console.log('Project Cortex — Cleaning build artifacts & temporary files...');

let removedCount = 0;
targets.forEach(target => {
  if (fs.existsSync(target)) {
    try {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`  ✓ Removed ${path.relative(rootDir, target)}`);
      removedCount++;
    } catch (err) {
      console.error(`  ✕ Error removing ${target}: ${err.message}`);
    }
  }
});

// Also remove any stray zip files from root if present
try {
  const rootFiles = fs.readdirSync(rootDir);
  rootFiles.forEach(file => {
    if (file.endsWith('.zip')) {
      fs.unlinkSync(path.join(rootDir, file));
      console.log(`  ✓ Removed loose zip: ${file}`);
      removedCount++;
    }
  });
} catch (_) {}

console.log(`Clean complete. (${removedCount} items removed)\n`);
