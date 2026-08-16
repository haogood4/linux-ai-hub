#!/usr/bin/env node
/**
 * inject-version.mjs — 构建版本注入
 *
 * 读取 package.json 的 name / version，生成 dist/version.json
 * （含构建时间），并把版本号注入 dist/index.html 的 <head> 中
 * 生成 <meta name="generator" content="linux-ai-hub@0.0.1">。
 * 幂等：重复运行不会重复注入。
 *
 * 用法：
 *   pnpm build:inject-version
 *
 * 退出码：
 *   0 = 成功
 *   1 = 失败（dist 缺失 / 无 index.html）
 *
 * 约束：Node ESM、零外部依赖。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const jsonMode = process.argv.includes('--json');

function fail(msg) {
  if (jsonMode) console.log(JSON.stringify({ ok: false, error: msg }));
  else console.error(`[inject-version] ${msg}`);
  process.exit(1);
}

if (!existsSync(DIST)) fail('未找到 dist/ 目录，请先运行 pnpm build');

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const version = pkg.version || '0.0.0';
const builtAt = new Date().toISOString();

const versionFile = join(DIST, 'version.json');
writeFileSync(versionFile, JSON.stringify({ name: pkg.name, version, builtAt }, null, 2) + '\n');

const indexFile = join(DIST, 'index.html');
if (!existsSync(indexFile)) fail('未找到 dist/index.html');

const html = readFileSync(indexFile, 'utf8');
const meta = `<meta name="generator" content="${pkg.name}@${version}">`;
if (html.includes(meta)) {
  if (jsonMode) console.log(JSON.stringify({ ok: true, version, builtAt, injected: false, reason: 'already-injected' }));
  else console.log(`[inject-version] 版本 ${pkg.name}@${version} 已注入（幂等跳过）`);
  process.exit(0);
}

if (!html.includes('<head>')) fail('dist/index.html 缺少 <head> 标签');
const injected = html.replace('<head>', `<head>\n    ${meta}`);
writeFileSync(indexFile, injected);

if (jsonMode) console.log(JSON.stringify({ ok: true, version, builtAt, injected: true }));
else {
  console.log(`[inject-version] 已生成 dist/version.json（${pkg.name}@${version}，构建于 ${builtAt}）`);
  console.log(`[inject-version] 已注入 ${indexFile.replace(ROOT, '.')} 的 <head>`);
}