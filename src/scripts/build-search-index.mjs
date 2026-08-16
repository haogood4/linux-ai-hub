#!/usr/bin/env node
/**
 * build-search-index.mjs — 站内搜索索引生成（零依赖轻量方案）
 *
 * Pagefind 因私有 registry 缺包无法安装，本脚本从 dist/ HTML 产物
 * 提取结构化文本，生成 dist/search-index.json（约几十 KB），配合
 * Header 中的轻量搜索框实现站内搜索。
 *
 * 提取内容：title / description / h1-h3 标题 / 正文纯文本（截断）。
 * 排除：404 页、/not-for-you 不参与？保留全部普通页面。
 * 输出：dist/search-index.json（生产）+ public/search-index.json（供 dev server 服务；gitignore）。
 *
 * 用法：
 *   pnpm build:search-index        # 构建后生成索引
 *   pnpm build:search-index --json # JSON 输出
 *
 * 退出码：
 *   0 = 成功
 *   1 = 失败（dist 缺失）
 *
 * 约束：Node ESM、零外部依赖。
 */
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const jsonMode = process.argv.includes('--json');

if (!existsSync(DIST)) {
  if (jsonMode) console.log(JSON.stringify({ ok: false, error: 'dist 缺失' }));
  else console.error('[search-index] 未找到 dist/，请先 pnpm build');
  process.exit(1);
}

function collect(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collect(full));
    else if (extname(full) === '.html') out.push(full);
  }
  return out;
}

function clean(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SKIP = ['404.html'];
const entries = [];

for (const file of collect(DIST)) {
  const rel = file.slice(DIST.length + 1);
  if (SKIP.includes(rel)) continue;
  const html = readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() || '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim() || '';
  const headings = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)]
    .map((m) => clean(m[1]))
    .filter(Boolean)
    .slice(0, 8);
  const body = html.match(/<body[\s\S]*<\/body>/)?.[0] || '';
  const text = clean(body).slice(0, 300);

  const url = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '').replace(/\.html$/, '/')}`;
  entries.push({ url, title, description, headings, text });
}

const out = {
  generatedAt: new Date().toISOString(),
  total: entries.length,
  entries,
};
const payload = JSON.stringify(out);
writeFileSync(join(DIST, 'search-index.json'), payload);
writeFileSync(join(ROOT, 'public', 'search-index.json'), payload);

if (jsonMode) console.log(JSON.stringify({ ok: true, total: entries.length, bytes: Buffer.byteLength(payload) }));
else console.log(`[search-index] 已生成 search-index.json：${entries.length} 页，${(Buffer.byteLength(payload) / 1024).toFixed(1)} KB（dist/ + public/）`);