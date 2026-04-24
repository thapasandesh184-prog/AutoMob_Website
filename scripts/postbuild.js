/**
 * Post-build script for Next.js standalone output.
 * Copies required files that Next.js standalone doesn't include automatically:
 * 1. .next/static/ → .next/standalone/.next/static/
 * 2. Prisma query engines → .next/standalone/node_modules/.prisma/client/
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`[postbuild] Source not found, skipping: ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`[postbuild] Copied ${src} → ${dest}`);
}

// 1. Copy static files
const staticSrc = path.join(projectRoot, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
copyDir(staticSrc, staticDest);

// 2. Copy Prisma engine binaries
const prismaSrc = path.join(projectRoot, 'node_modules', '.prisma', 'client');
const prismaDest = path.join(standaloneDir, 'node_modules', '.prisma', 'client');
copyDir(prismaSrc, prismaDest);

// 3. Copy schema.prisma (Prisma client may need it at runtime)
const schemaSrc = path.join(projectRoot, 'prisma', 'schema.prisma');
const schemaDest = path.join(standaloneDir, 'prisma', 'schema.prisma');
if (fs.existsSync(schemaSrc)) {
  fs.mkdirSync(path.dirname(schemaDest), { recursive: true });
  fs.copyFileSync(schemaSrc, schemaDest);
  console.log(`[postbuild] Copied ${schemaSrc} → ${schemaDest}`);
}

console.log('[postbuild] Standalone build ready for deployment');
