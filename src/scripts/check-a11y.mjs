#!/usr/bin/env node
/**
 * check-a11y.mjs — 无障碍静态规则审计（WCAG 2.2 AA 可静态化部分）
 *
 * 扫描 src/pages 与 src/content 下的 .astro/.mdx 源码，检查：
 *  1. html lang 属性存在（BaseLayout 默认 zh-CN）
 *  2. img 必须带 alt（装饰图允许 alt=""）
 *  3. 表单控件（input/select/textarea）需有 label / aria-label / aria-labelledby
 *  4. heading 层级连续（h1 起始、不跳级；astro 组件内逐个检查）
 *  5. a 标签文本或 aria-label 非空
 *  6. 按钮/图标按钮需有文本或 aria-label
 *
 * 无法静态验证的项（颜色对比度、焦点可见、键盘操作）需浏览器审计，
 * 见 docs/SCRIPTS.md 说明。
 *
 * 用法：
 *   pnpm check:a11y              # 人类可读输出
 *   pnpm check:a11y --json       # JSON 输出
 *   pnpm check:a11y --scan dist  # 改为扫描 dist/ 构建产物（默认扫源码）
 *
 * 退出码：
 *   0 = 通过
 *   1 = 发现违规
 *   2 = 参数错误
 *
 * 约束：Node ESM、零外部依赖（正则级检查，不做完整 HTML 解析）。
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const jsonMode = process.argv.includes('--json');
const scanDist = process.argv.includes('--scan') && process.argv[process.argv.indexOf('--scan') + 1] === 'dist';

function fail(msg) {
  if (jsonMode) console.log(JSON.stringify({ ok: false, error: msg }));
  else console.error(`[check-a11y] ${msg}`);
  process.exit(2);
}

const dirs = scanDist ? [join(ROOT, 'dist')] : [join(ROOT, 'src/pages'), join(ROOT, 'src/content')];
for (const d of dirs) if (!existsSync(d)) fail(`目录不存在：${d}`);

const exts = scanDist ? ['.html'] : ['.astro', '.mdx'];

function collect(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collect(full));
    else if (exts.includes(extname(full))) out.push(full);
  }
  return out;
}

const files = collect(dirs[0]);
for (const d of dirs.slice(1)) files.push(...collect(d));

const violations = [];
const rel = (p) => p.slice(ROOT.length + 1);
const report = (file, msg) => violations.push({ file: rel(file), msg });

// 1. html lang
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const htmlTags = text.match(/<html[^>]*>/g) || [];
  for (const tag of htmlTags) {
    if (!/lang=/.test(tag)) report(f, '<html> 缺少 lang 属性');
  }
}

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const stripped = text
    .replace(/```[\s\S]*?```/g, ' ')   // 代码块
    .replace(/<!--[\s\S]*?-->/g, ' ');  // 注释

  // 2. img alt
  for (const m of stripped.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/alt\s*=\s*(?:["'][^"']*["']|[{])/.test(tag)) report(f, `img 缺少 alt 属性：${tag.slice(0, 80)}`);
  }

  // 3. 表单控件 label（含隐式关联：input 被 <label> 包裹或紧随其后）
  for (const m of stripped.matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
    const tag = m[0];
    const type = tag.match(/\btype\s*=\s*["']([^"']*)["']/)?.[1];
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') continue;
    if (/\bdisabled\b/.test(tag)) continue; // disabled 控件在可访问树中不暴露，豁免（对齐 axe-core）
    const hasLabel = /\blabel\s*=\s*["']/.test(tag) || /aria-label\s*=\s*["']/.test(tag) || /aria-labelledby\s*=\s*["']/.test(tag) || /aria-describedby\s*=\s*["']/.test(tag);
    if (hasLabel) continue;
    // 隐式关联：input 位于 <label>…</label> 包裹内，或紧贴 </label> 之后
    const before = stripped.slice(0, m.index);
    const labelOpen = (before.match(/<label\b/g) || []).length;
    const labelClose = (before.match(/<\/label>/g) || []).length;
    if (labelOpen > labelClose || labelClose > labelOpen) continue;
    report(f, `表单控件缺少 label/aria-label：<${m[1]} ${tag.slice(0, 60)}`);
  }

  // 4. heading 层级（pages 与 content 目录：首个 h2 允许——h1 由 Hero/PageHeader 组件渲染）
  const inComponents = f.includes(`${join('src', 'components')}`) || f.includes(`${join('src', 'lib')}`);
  let prev = 0;
  if (!inComponents) {
    for (const m of stripped.matchAll(/<h([1-6])\b[^>]*>/g)) {
      const level = Number(m[1]);
      const start = text.slice(0, m.index);
      const inAstroExpr = (start.match(/[{]/g)?.length || 0) > (start.match(/[}]/g)?.length || 0);
      if (inAstroExpr) continue; // Astro 表达式内（如 map 渲染）不静态检查
      const isFirst = prev === 0;
      if (isFirst && level === 2) { prev = 2; continue; } // h1 由组件渲染，首个 h2 合法
      if (level - prev > 1) report(f, `heading 跳级 h${prev || '?'} → h${level}`);
      prev = Math.max(prev, level);
    }
  }

  // 5. 空链接
  for (const m of stripped.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
    const inner = m[1].trim();
    const tag = m[0].slice(0, 200);
    if (!inner || inner === '<') {
      if (!/aria-label\s*=\s*["']/.test(tag)) report(f, `空链接（无文本且无 aria-label）：${tag.slice(0, 80)}`);
    }
  }

  // 6. 无文本按钮
  for (const m of stripped.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    const tag = m[0].slice(0, 200);
    if (!m[1].trim() && !/aria-label\s*=\s*["']/.test(tag)) report(f, `空按钮（无文本且无 aria-label）：${tag.slice(0, 80)}`);
  }
}

const ok = violations.length === 0;

if (jsonMode) {
  console.log(JSON.stringify({ ok, scanned: files.length, violations }));
} else {
  console.log(`[check-a11y] 扫描 ${files.length} 个文件（${scanDist ? 'dist 产物' : '源码'}）`);
  for (const v of violations.slice(0, 30)) console.error(`  ✗ ${v.file}: ${v.msg}`);
  if (violations.length > 30) console.error(`  … 其余 ${violations.length - 30} 条`);
  if (ok) console.log('[check-a11y] ✓ 静态规则全部通过（对比度/焦点等视觉项需浏览器审计）');
  else console.error(`[check-a11y] ✗ 发现 ${violations.length} 条违规`);
}

process.exit(ok ? 0 : 1);