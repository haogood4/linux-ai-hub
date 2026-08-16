#!/usr/bin/env node
/**
 * audit-completion.mjs — 项目完成度核查（轻量版）
 *
 * 统计页面数、内容集合条目、构建产物、sitemap 收录数，并校验
 * 安装/分区/双系统页面必须包含备份风险提示（AGENTS.md §7）。
 *
 * 用法：
 *   pnpm audit            # 人类可读输出
 *   pnpm audit:json       # JSON 输出
 *
 * 退出码：
 *   0 = 通过（含提示项不阻断）
 *   1 = 关键项失败（风险提示缺失 / 无构建产物）
 *   2 = 参数错误
 *
 * 约束：Node ESM、零外部依赖。
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const jsonMode = process.argv.includes('--json');

function collectFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) collectFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

const pages = collectFiles(join(ROOT, 'src/pages')).filter((f) => /\.(astro|md|mdx)$/.test(f)).length;
const collections = {};
for (const c of ['tutorials', 'paths', 'tools', 'blog', 'distros']) {
  const dir = join(ROOT, 'src/content', c);
  if (existsSync(dir)) collections[c] = readdirSync(dir).filter((f) => extname(f) === '.md' || extname(f) === '.mdx').length;
}

const distExists = existsSync(join(ROOT, 'dist'));
let sitemapUrls = 0;
let builtHtml = 0;
if (distExists) {
  const sitemap = join(ROOT, 'dist', 'sitemap-0.xml');
  if (existsSync(sitemap)) {
    const xml = readFileSync(sitemap, 'utf8');
    sitemapUrls = (xml.match(/<url>/g) || []).length;
  }
  builtHtml = collectFiles(join(ROOT, 'dist'), []).filter((f) => f.endsWith('.html')).length;
}

// 安装 / 分区 / 双系统页面必须包含备份提示
const riskPages = ['src/pages/try/install.astro', 'src/pages/try/dual-boot.astro', 'src/pages/try/virtualbox.astro'];
const missingRisk = [];
for (const p of riskPages) {
  const full = join(ROOT, p);
  if (!existsSync(full)) continue;
  if (!readFileSync(full, 'utf8').includes('备份')) missingRisk.push(p);
}

const notes = [];
if (!distExists) notes.push('dist/ 不存在，请先运行 pnpm build');
if (sitemapUrls === 0) notes.push('未找到 sitemap-0.xml，检查 @astrojs/sitemap 配置');

const ok = missingRisk.length === 0 && distExists;
const summary = { pages, builtHtml, collections, dist: distExists, sitemapUrls, missingRisk, notes };

if (jsonMode) {
  console.log(JSON.stringify({ ok, summary }));
} else {
  console.log(`[audit] 页面源文件 ${pages} | 构建 HTML ${builtHtml} | sitemap ${sitemapUrls} 页`);
  console.log(`[audit] 集合 ${Object.entries(collections).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  for (const p of missingRisk) console.error(`  ✗ ${p} 缺少「备份」风险提示`);
  for (const n of notes) console.error(`  ! ${n}`);
  if (ok) console.log('[audit] ✓ 关键项全部通过');
  else console.error('[audit] ✗ 存在关键问题');
}

process.exit(ok ? 0 : 1);