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
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const ROOT = process.cwd();
const jsonMode = process.argv.includes('--json');

function dirList(p) {
  const full = join(ROOT, p);
  if (!existsSync(full)) return [];
  return readdirSync(full).filter((f) => f !== '.DS_Store');
}

const pages = dirList('src/pages');
const collections = {};
for (const c of ['tutorials', 'paths', 'tools', 'blog']) {
  const dir = join(ROOT, 'src/content', c);
  if (existsSync(dir)) collections[c] = readdirSync(dir).filter((f) => extname(f) === '.md' || extname(f) === '.mdx').length;
}

const distExists = existsSync(join(ROOT, 'dist'));
let sitemapUrls = 0;
if (distExists) {
  const sitemap = join(ROOT, 'dist', 'sitemap-0.xml');
  if (existsSync(sitemap)) {
    const xml = readFileSync(sitemap, 'utf8');
    sitemapUrls = (xml.match(/<url>/g) || []).length;
  }
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
const summary = { pages: pages.length, collections, dist: distExists, sitemapUrls, missingRisk, notes };

if (jsonMode) {
  console.log(JSON.stringify({ ok, summary }));
} else {
  console.log(`[audit] 页面数 ${pages.length} | 集合 ${Object.entries(collections).map(([k, v]) => `${k}=${v}`).join(' ')} | sitemap ${sitemapUrls} 页`);
  for (const p of missingRisk) console.error(`  ✗ ${p} 缺少「备份」风险提示`);
  for (const n of notes) console.error(`  ! ${n}`);
  if (ok) console.log('[audit] ✓ 关键项全部通过');
  else console.error('[audit] ✗ 存在关键问题');
}

process.exit(ok ? 0 : 1);