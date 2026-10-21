// node screenshot.mjs <url> [label] [width]
// Saves full-page PNGs to ./temporary screenshots/screenshot-N[-label].png
import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const candidates = [process.env.PUPPETEER_DIR, process.cwd()].filter(Boolean);
let puppeteer;
for (const dir of candidates) {
  try { puppeteer = require(require.resolve('puppeteer-core', { paths: [dir] })); break; } catch {}
  try { puppeteer = require(require.resolve('puppeteer', { paths: [dir] })); break; } catch {}
}
if (!puppeteer) throw new Error('puppeteer not found — set PUPPETEER_DIR to a folder with puppeteer(-core) installed');

const [url = 'http://localhost:3000', label, width = '1440'] = process.argv.slice(2);
const outDir = join(fileURLToPath(new URL('.', import.meta.url)), 'temporary screenshots');
await mkdir(outDir, { recursive: true });
const nums = (await readdir(outDir)).map(f => +(f.match(/^screenshot-(\d+)/)?.[1] ?? 0));
const n = Math.max(0, ...nums) + 1;
const out = join(outDir, `screenshot-${n}${label ? '-' + label : ''}.png`);

const chrome = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const browser = await puppeteer.launch({ headless: true, ...(chrome && { executablePath: chrome }) });
const page = await browser.newPage();
await page.setViewport({ width: +width, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
// reveal scroll-triggered content before capture
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in')));
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
