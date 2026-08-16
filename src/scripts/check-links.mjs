#!/usr/bin/env node
/**
 * check-links.mjs — 死链检查（站内）
 *
 * 扫描 dist/ 下所有 HTML 产物中的站内链接（a href / img src / link href），
 * 验证目标文件是否存在。站外链接仅报告、不请求。
 *
 * 用法：
 *   pnpm check:links            # 人类可读输出，死链时退出码 1
 *   pnpm check:links --json     # JSON 输出（含 summary / broken / external）
 *
 * 退出码：
 *   0 = 无死链
 *   1 = 发现死链
 *   2 = 参数错误 / dist 不存在
 *
 * 约束：Node ESM、零外部依赖。
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const jsonMode = process.argv.includes('--json');

function fail(msg) {
  if (jsonMode) {
    console.log(JSON.stringify({ ok: false, error: msg }));
  } else {
    console.error(`[check-links] ${msg}`);
  }
  process.exit(2);
}

if (!existsSync(DIST)) {
  fail('未找到 dist/ 目录，请先运行 pnpm build');
}

/** 递归收集 dist 下所有文件路径 */
function collectFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collectFiles(full));
    else out.push(full);
  }
  return out;
}

const files = collectFiles(DIST);
const htmlFiles = files.filter((f) => extname(f) === '.html');

const attrRe = /(?:href|src)="([^"]+)"/g;
const broken = [];
const external = new Set();
let checked = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  let m;
  while ((m = attrRe.exec(html)) !== null) {
    const raw = m[1];
    if (!raw || raw.startsWith('data:') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
    if (raw.includes('${')) continue; // JS 模板字符串占位符（如 picker 内联脚本）

    let target = raw;
    if (target.startsWith('//')) {
      external.add(target);
      continue;
    }
    const isExternal = /^https?:/i.test(target);
    if (isExternal) {
      external.add(target);
      continue;
    }

    // 去锚点 / 查询串
    target = target.split('#')[0].split('?')[0];
    if (!target) continue; // 纯锚点

    checked++;

    // 绝对路径 → dist 内；相对路径 → 当前文件所在目录
    const base = target.startsWith('/') ? DIST : dirname(file);
    const resolved = join(base, target);
    const candidate = !extname(resolved) && !resolved.endsWith('/') ? `${resolved}.html` : resolved;
    const indexCandidate = !extname(candidate) ? join(candidate, 'index.html') : null;

    const ok =
      existsSync(resolved) ||
      existsSync(candidate) ||
      (indexCandidate && existsSync(indexCandidate));

    if (!ok) {
      broken.push({ from: relativeToDist(file), to: raw });
    }
  }
}

function dirname(p) {
  return p.slice(0, p.lastIndexOf('/'));
}

function relativeToDist(p) {
  return p.slice(DIST.length).replace(/\\/g, '/');
}

const summary = { htmlFiles: htmlFiles.length, linksChecked: checked, broken: broken.length, external: external.size };

if (jsonMode) {
  console.log(JSON.stringify({ ok: broken.length === 0, summary, broken, external: [...external].sort() }));
} else {
  console.log(`[check-links] 检查 ${htmlFiles.length} 个 HTML，站内链接 ${checked} 个，站外链接 ${external.size} 个`);
  for (const b of broken) {
    console.error(`  ✗ ${b.from} → ${b.to}`);
  }
  if (broken.length === 0) {
    console.log('[check-links] ✓ 未发现站内死链');
  } else {
    console.error(`[check-links] ✗ 发现 ${broken.length} 个站内死链`);
  }
}

process.exit(broken.length === 0 ? 0 : 1);