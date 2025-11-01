
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const appDir = path.join(projectRoot, 'app');

const isPageFile = (p) =>
  p.endsWith(path.sep + 'page.tsx') || p.endsWith(path.sep + 'page.jsx') ||
  p.endsWith(path.sep + 'page.ts')  || p.endsWith(path.sep + 'page.js');

const looksDbHeavy = (src) => {
  const needles = [
    "@prisma/client",
    "from 'prisma'", 'from "prisma"',
    "from '@/lib/db'", 'from "@/lib/db"', 'from "@/server/db"',
    "prisma.", "db.", "await prisma", "await db",
    "getData", "loadData", "server only"
  ];
  return needles.some(n => src.includes(n));
};

const alreadyTagged = (src) =>
  src.includes("export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'") ||
  src.includes("export const dynamic") || src.includes("export const revalidate");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

if (!fs.existsSync(appDir)) {
  console.log("No app directory found; nothing to do.");
  process.exit(0);
}

const files = walk(appDir).filter(isPageFile);

let changed = 0;
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  if (alreadyTagged(src)) continue;
  if (!looksDbHeavy(src)) continue;

  const injection = "export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'\n";
  
  // Handle 'use client' directive - it must be first
  if (src.trim().startsWith("'use client'") || src.trim().startsWith('"use client"')) {
    const lines = src.split('\n');
    const useClientLine = lines[0];
    const rest = lines.slice(1).join('\n');
    fs.writeFileSync(file, useClientLine + '\n' + injection + rest, 'utf8');
  } else {
    fs.writeFileSync(file, injection + src, 'utf8');
  }
  
  changed++;
  console.log(`[dynamic] tagged: ${path.relative(projectRoot, file)}`);
}
console.log(`Done. Pages tagged: ${changed}`);
