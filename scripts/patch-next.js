/**
 * Hostinger auto-detected Next.js runs `next build` directly, ignoring
 * our `--webpack` flag in package.json. This patch forces `--webpack`
 * into process.argv before Next.js parses it, so Turbopack is disabled
 * and webpack is used (safe chunk names, no `~` characters).
 */
const fs = require('fs');
const path = require('path');

const nextBin = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next');

if (!fs.existsSync(nextBin)) {
  console.log('[patch-next] next binary not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(nextBin, 'utf8');

// Only patch if not already patched
if (content.includes('/* HOSTINGER_WEBPACK_PATCH */')) {
  console.log('[patch-next] Already patched, skipping');
  process.exit(0);
}

// Inject before program.parse(process.argv)
const target = 'program.parse(process.argv)';
if (content.includes(target)) {
  content = content.replace(
    target,
    `/* HOSTINGER_WEBPACK_PATCH */\nif (process.argv.includes('build') && !process.argv.includes('--webpack')) {\n  process.argv.push('--webpack');\n}\n${target}`
  );
  fs.writeFileSync(nextBin, content);
  console.log('[patch-next] Patched next binary to force --webpack on build');
} else {
  console.log('[patch-next] Could not find injection point, skipping');
}
