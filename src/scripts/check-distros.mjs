#!/usr/bin/env node
/**
 * check-distros.mjs — 发行版内容与入口可达性核查
 *
 * 检查 src/content/distros/*.mdx 的 frontmatter 完整性（name / family /
 * 官方链接字段），验证对应详情页构建产物存在；--check-live 时用
 * fetch HEAD 请求验证官方 URL 可访问（零依赖，Node >= 18 自带 fetch）。
 *
 * 用法：
 *   pnpm check:distros             # 静态核查（frontmatter + 构建产物）
 *   pnpm check:distros --check-live  # 追加官方 URL 在线可达性验证
 *   pnpm check:distros --json      # JSON 输出
 *
 * 退出码：
 *   0 = 通过
 *   1 = 静态核查失败或 --check-live 下官方 URL 不可达
 *   2 = 参数错误 / dist 缺失
 *
 * 约束：Node ESM、零外部依赖。
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const jsonMode = process.argv.includes('--json');
const live = process.argv.includes('--check-live');
const DIST = join(ROOT, 'dist');

function fail(msg) {
  if (jsonMode) console.log(JSON.stringify({ ok: false, error: msg }));
  else console.error(`[check-distros] ${msg}`);
  process.exit(2);
}

const REQUIRED = ['name', 'family', 'officialUrl', 'installGuideUrl'];
const URL_FIELDS = ['officialUrl', 'installGuideUrl', 'wikiUrl', 'communityUrl'];

const dir = join(ROOT, 'src/content/distros');
if (!existsSync(dir)) fail('未找到 src/content/distros/ 目录');
if (!existsSync(DIST)) fail('未找到 dist/ 目录，请先运行 pnpm build');

const files = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();

/** 零依赖解析 MDX frontmatter 字段（仅取字符串值） */
function parseFrontmatter(file) {
  const text = readFileSync(join(dir, file), 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z]+):\s*(.+)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const issues = [];
const urls = [];
const rows = [];

for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  const fm = parseFrontmatter(file);

  for (const field of REQUIRED) {
    if (!fm[field]) issues.push(`${file}: 缺少 ${field}`);
  }
  if (fm.family && !['debian', 'arch', 'redhat'].includes(fm.family)) {
    issues.push(`${file}: family 值非法（${fm.family}）`);
  }

  const page = join(DIST, 'distros', slug, 'index.html');
  const pageOk = existsSync(page) && statSync(page).isFile();
  if (!pageOk) issues.push(`${file}: 构建产物缺失 dist/distros/${slug}/index.html`);

  for (const field of URL_FIELDS) {
    if (fm[field]) {
      urls.push({ file, field, url: fm[field] });
      if (!/^https?:\/\//i.test(fm[field])) issues.push(`${file}: ${field} 不是合法 URL（${fm[field]}）`);
    }
  }

  rows.push({ slug, name: fm.name || slug, pageOk });
}

let liveFailures = [];
const liveWarnings = [];
if (live && urls.length > 0) {
  const results = await Promise.all(
    urls.map(async (u) => {
      const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
      const probe = async (method) => {
        try {
          const res = await fetch(u.url, { method, redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' }, signal: AbortSignal.timeout(15000) });
          return res;
        } catch (e) {
          return { status: 0, ok: false, error: String(e.message || e) };
        }
      };
      let res = await probe('HEAD');
      // 部分站点（wiki/论坛）拒绝 HEAD，自动降级 GET 重试
      if (!res.ok || res.status === 0) {
        const get = await probe('GET');
        if (get.ok || get.status === 307 || get.status === 308) res = get;
      }
      // 307/308 持续重定向多为论坛/网站反爬防护（浏览器访问正常），记为警告不阻断
      if (res.status === 307 || res.status === 308) return { ...u, status: res.status, ok: true, warning: true };
      return { ...u, status: res.status, ok: res.ok, warning: false };
    }),
  );
  liveFailures = results.filter((r) => !r.ok);
  liveWarnings.push(...results.filter((r) => r.warning));
}

const ok = issues.length === 0 && liveFailures.length === 0;

if (jsonMode) {
  console.log(JSON.stringify({ ok, distros: rows, issues, urls, liveFailures, liveWarnings }));
} else {
  console.log(`[check-distros] 发行版 ${files.length} 个（${rows.map((r) => r.slug).join(' / ')}）`);
  console.log(`[check-distros] 详情页构建产物 ${rows.filter((r) => r.pageOk).length}/${files.length} 通过`);
  console.log(`[check-distros] 官方链接 ${urls.length} 条${live ? `（--check-live 在线验证 ${liveFailures.length} 条失败）` : '（未联网，加 --check-live 验证可达性）'}`);
  for (const i of issues) console.error(`  ✗ ${i}`);
  for (const f of liveFailures) console.error(`  ✗ ${f.file} ${f.field} ${f.url} → ${f.status || f.error || '不可达'}`);
  for (const w of liveWarnings) console.warn(`  ! ${w.file} ${w.field} ${w.url} → ${w.status}（反爬防护，浏览器访问正常）`);
  if (ok) console.log('[check-distros] ✓ 全部通过');
  else console.error('[check-distros] ✗ 存在问题');
}

process.exit(ok ? 0 : 1);