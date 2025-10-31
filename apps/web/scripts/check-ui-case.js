#!/usr/bin/env node
/*
  Checks that all files under components/ui use lowercase filenames.
  This prevents case-sensitivity issues on Linux (e.g., Vercel builders).
*/
const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '..', 'components', 'ui');

function hasUppercase(s) {
  return /[A-Z]/.test(s);
}

function scan(dir) {
  let violations = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      violations = violations.concat(scan(full));
    } else if (hasUppercase(name)) {
      violations.push(path.relative(process.cwd(), full));
    }
  }
  return violations;
}

if (!fs.existsSync(uiDir)) {
  console.error('components/ui directory not found');
  process.exit(0);
}

const bad = scan(uiDir);
if (bad.length) {
  console.error('Found UI filenames with uppercase letters (rename to lowercase):');
  for (const f of bad) console.error(' -', f);
  process.exit(1);
}
console.log('UI case check passed: all filenames in components/ui are lowercase.');
