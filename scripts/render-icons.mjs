#!/usr/bin/env node
// Renders the app icon, the Android adaptive icon foreground, the splash image and the favicon
// from assets/icon.svg with headless Chrome, so every PNG in assets/images comes from one source.
//
//   node scripts/render-icons.mjs            (CHROME_PATH overrides the browser)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = join(ROOT, 'assets', 'images');
const WORK = join(ROOT, 'node_modules', '.cache', 'render-icons');
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const source = readFileSync(join(ROOT, 'assets', 'icon.svg'), 'utf8');
const mark = source.match(/<g id="mark">[\s\S]*?<\/g>/)[0];
const defs = source.match(/<defs>[\s\S]*?<\/defs>/)[0];

// Each image: its size and the SVG drawn into it. The adaptive icon foreground has no background,
// because Android draws backgroundColor from app.json behind it; the splash image is the icon with
// rounded corners so it reads as the app icon on both splash backgrounds.
const IMAGES = [
  { file: 'icon.png', size: 1024, svg: source },
  {
    file: 'adaptive-icon.png',
    size: 1024,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${mark}</svg>`,
  },
  {
    file: 'splash-icon.png',
    size: 512,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}<rect width="1024" height="1024" rx="224" fill="url(#bg)"/>${mark}</svg>`,
  },
  { file: 'favicon.png', size: 48, svg: source },
];

function chrome() {
  const path = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!path) throw new Error('Chrome not found; set CHROME_PATH.');
  return path;
}

function render(browser, { file, size, svg }) {
  const page = join(WORK, `${file}.html`);
  const sized = svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
  writeFileSync(
    page,
    `<!doctype html><html><body style="margin:0;background:transparent">${sized}</body></html>`,
  );
  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--default-background-color=00000000',
      `--window-size=${size},${size}`,
      `--screenshot=${join(OUTPUT, file)}`,
      `file://${page}`,
    ],
    { stdio: 'ignore' },
  );
  console.log(`wrote assets/images/${file} (${size}x${size})`);
}

mkdirSync(WORK, { recursive: true });
mkdirSync(OUTPUT, { recursive: true });
const browser = chrome();
for (const image of IMAGES) render(browser, image);
rmSync(WORK, { recursive: true, force: true });
