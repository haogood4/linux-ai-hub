#!/usr/bin/env node
/**
 * check-lhci.mjs — LHCI（Lighthouse CI）门禁壳
 *
 * 本项目脚本遵循「零外部依赖」约束，无法内置 Lighthouse 运行时，
 * 本脚本负责：
 *  1. 检测环境是否已具备 LHCI 能力（lighthouserc 配置 + 可用的 lhci 命令）
 *  2. 具备 → 透传调用 `lhci autorun`（或传入的参数）
 *  3. 不具备 → 输出引导说明，退出码 2（未就绪，不作为门禁失败）
 *
 * 用法：
 *   pnpm check:lhci                      # 检测并运行 LHCI
 *   pnpm check:lhci --json               # JSON 输出（检测结果）
 *   pnpm check:lhci --dry                # 仅检测，不运行
 *   CHROME_PATH=/usr/bin/google-chrome pnpm check:lhci   # 覆盖 Chrome 路径（CI 场景）
 *
 * 退出码：
 *   0 = LHCI 已运行且通过 / --dry 下环境就绪
 *   1 = LHCI 运行失败（性能门禁未通过）
 *   2 = 环境未就绪（缺 lighthouserc 或 lhci 命令）
 *
 * 约束：Node ESM、零外部依赖。
 */
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const jsonMode = process.argv.includes('--json');
const dry = process.argv.includes('--dry');

const hasConfig = ['lighthouserc.json', 'lighthouserc.js', 'lighthouserc.cjs', '.lighthouserc.json'].some((f) => existsSync(join(ROOT, f)));
const probe = spawnSync('lhci', ['--version'], { encoding: 'utf8', shell: true, timeout: 15000 });
const hasLhci = probe.status === 0 && !probe.error;

const ready = hasConfig && hasLhci;

function out(obj, human) {
  if (jsonMode) console.log(JSON.stringify(obj));
  else console.log(human);
}

if (!ready) {
  const missing = [!hasConfig ? '缺少 lighthouserc.json 配置' : null, !hasLhci ? '未安装 @lhci/cli' : null].filter(Boolean);
  out(
    { ok: false, ready: false, missing },
    `[check-lhci] 环境未就绪：${missing.join('；')}\n[check-lhci] 接入步骤：\n  1. pnpm add -D @lhci/cli\n  2. 创建 lighthouserc.json（collect: dist 静态服务 + assert: 性能门禁）\n  3. 重新运行 pnpm check:lhci`,
  );
  process.exit(2);
}

if (dry) {
  out({ ok: true, ready: true }, '[check-lhci] 环境就绪（--dry 未运行）');
  process.exit(0);
}

const args = ['autorun', ...process.argv.slice(2).filter((a) => !a.startsWith('--json') && a !== '--dry' && a !== '--scan')];

let configArg = [];
let tmpConfig = null;
const chromePath = process.env.CHROME_PATH;
if (chromePath) {
  const cfgFile = ['lighthouserc.json', 'lighthouserc.js', 'lighthouserc.cjs', '.lighthouserc.json'].find((f) => existsSync(join(ROOT, f)));
  const raw = readFileSync(join(ROOT, cfgFile), 'utf8');
  const cfg = JSON.parse(raw);
  cfg.ci.collect.settings = { ...(cfg.ci.collect.settings || {}), chromePath };
  tmpConfig = join(ROOT, '.lighthouserc.ci.json');
  writeFileSync(tmpConfig, JSON.stringify(cfg, null, 2));
  configArg = ['--config=' + tmpConfig];
  if (!jsonMode) console.log(`[check-lhci] CHROME_PATH=${chromePath}（临时配置 ${tmpConfig}）`);
}

const run = spawnSync('lhci', [...configArg, ...args], { stdio: 'inherit', shell: true, cwd: ROOT, timeout: 600000 });

if (tmpConfig) {
  try {
    unlinkSync(tmpConfig);
  } catch {}
}

if (jsonMode) console.log(JSON.stringify({ ok: run.status === 0, ready: true }));
process.exit(run.status === 0 ? 0 : 1);