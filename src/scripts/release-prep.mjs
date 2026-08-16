#!/usr/bin/env node
/**
 * release-prep.mjs — release 准备就绪度核查
 *
 * 发布前跑一遍，聚合以下检查：
 *  1. package.json version 合法（非 0.0.0 占位）
 *  2. 构建产物存在（dist/ + sitemap）
 *  3. 站内死链为 0（扫描 dist HTML，逻辑同 check-links 精简版）
 *  4. 安装/分区/双系统页面源码含「备份」风险提示（AGENTS.md §7）
 *  5. git 工作区干净（未提交改动会在发布时被遗漏）
 *  6. CHANGELOG.md 存在（提示项，不阻断）
 *
 * 用法：
 *   pnpm release-prep             # 人类可读输出
 *   pnpm release-prep --json      # JSON 输出
 *   pnpm release-prep --skip-git  # 跳过 git 检查（CI 浅克隆等场景）
 *
 * 退出码：
 *   0 = 就绪（提示项不阻断）
 *   1 = 存在阻断项
 *   2 = 参数错误
 *
 * 约束：Node ESM、零外部依赖。
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const jsonMode = process.argv.includes('--json');
const skipGit = process.argv.includes('--skip-git');

function fail(msg) {
  if (jsonMode) console.log(JSON.stringify({ ok: false, error: msg }));
  else console.error(`[release-prep] ${msg}`);
  process.exit(2);
}

const blocking = [];
const warnings = [];
const info = [];

// 1. 版本号
let version = null;
try {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  version = pkg.version;
  if (!version || version === '0.0.0' || version === '1.0.0') {
    warnings.push(`package.json version 仍为占位值「${version || '空'}」，发布前请确认`);
  } else {
    info.push(`版本 ${pkg.name}@${version}`);
  }
} catch {
  fail('无法读取 package.json');
}

// 2. 构建产物
const dist = join(ROOT, 'dist');
if (!existsSync(dist)) {
  blocking.push('dist/ 不存在，请先运行 pnpm build');
} else {
  const sitemap = join(dist, 'sitemap-0.xml');
  if (!existsSync(sitemap)) blocking.push('sitemap 产物缺失（检查 @astrojs/sitemap 配置）');
  else info.push('sitemap 已生成');
}

// 3. 站内死链（精简逻辑）
function collectFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collectFiles(full));
    else out.push(full);
  }
  return out;
}

let brokenLinks = 0;
if (existsSync(dist)) {
  const htmlFiles = collectFiles(dist).filter((f) => extname(f) === '.html');
  const attrRe = /(?:href|src)="([^"]+)"/g;
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    let m;
    while ((m = attrRe.exec(html)) !== null) {
      const raw = m[1];
      if (!raw || /^(data:|mailto:|tel:|https?:|\/\/)/.test(raw) || raw.includes('${')) continue;
      const target = raw.split('#')[0].split('?')[0];
      if (!target) continue;
      const base = target.startsWith('/') ? dist : file.slice(0, file.lastIndexOf('/'));
      const resolved = join(base, target);
      const candidates = [resolved, !extname(resolved) && !resolved.endsWith('/') ? `${resolved}.html` : null, !extname(resolved) ? join(resolved, 'index.html') : null].filter(Boolean);
      if (!candidates.some((c) => existsSync(c))) {
        brokenLinks++;
        if (brokenLinks <= 10) blocking.push(`死链 ${file.replace(ROOT, '.')} → ${raw}`);
      }
    }
  }
  if (brokenLinks > 0) blocking.push(`共 ${brokenLinks} 个站内死链（发布前必须修复）`);
  else info.push(`死链检查：${htmlFiles.length} 个 HTML 无死链`);
}

// 4. 风险提示覆盖
const riskPages = ['src/pages/try/install.astro', 'src/pages/try/dual-boot.astro', 'src/pages/try/virtualbox.astro'];
for (const p of riskPages) {
  const full = join(ROOT, p);
  if (!existsSync(full)) continue;
  if (!readFileSync(full, 'utf8').includes('备份')) blocking.push(`${p} 缺少「备份」风险提示`);
}
if (!blocking.some((b) => b.includes('风险提示'))) info.push('安装类页面风险提示齐全');

// 5. git 状态
if (!skipGit && existsSync(join(ROOT, '.git'))) {
  try {
    const out = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (out) warnings.push('git 工作区有未提交改动（发布内容可能不完整）：\n' + out.split('\n').slice(0, 10).map((l) => `    ${l}`).join('\n'));
    else info.push('git 工作区干净');
  } catch {
    warnings.push('git 检查失败（跳过）');
  }
} else if (!skipGit) {
  warnings.push('非 git 仓库，跳过工作区检查');
}

// 6. CHANGELOG（提示项）
if (!existsSync(join(ROOT, 'CHANGELOG.md'))) {
  warnings.push('未发现 CHANGELOG.md（建议发布前补充变更记录）');
}

const ok = blocking.length === 0;

if (jsonMode) {
  console.log(JSON.stringify({ ok, version, blocking, warnings, info }));
} else {
  console.log(`[release-prep] 就绪度核查：${ok ? '✓ 通过' : '✗ 存在阻断项'}`);
  for (const i of info) console.log(`  ✓ ${i}`);
  for (const w of warnings) console.warn(`  ! ${w.split('\n')[0]}`);
  for (const b of blocking) console.error(`  ✗ ${b}`);
  console.log(`[release-prep] 阻断 ${blocking.length} | 警告 ${warnings.length}${skipGit ? '（--skip-git）' : ''}`);
}

process.exit(ok ? 0 : 1);