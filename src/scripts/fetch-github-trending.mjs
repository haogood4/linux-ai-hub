#!/usr/bin/env node
// 拉取 GitHub 最近一周高星仓库并翻译描述为中文，输出 public/data/github-trending.json
// 用法: DEEPSEEK_API_KEY=sk-xxx node src/scripts/fetch-github-trending.mjs
// 无 API key 时降级为原文（页面仍可用）
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = resolve(root, 'public/data/github-trending.json');
const apiKey = process.env.DEEPSEEK_API_KEY;
const days = 7;
const perPage = 15;

const fetchJson = async (url, headers = {}) => {
  const res = await fetch(url, { headers: { 'User-Agent': 'tuxai.cn', ...headers } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
};

const translate = async (items) => {
  const list = items.map((r) => ({ id: r.id, description: r.description || '' }));
  if (!apiKey) {
    console.log('[skip] 未设置 DEEPSEEK_API_KEY，描述保持原文');
    return new Map();
  }
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              '你是 GitHub 项目简介翻译器。把下面 JSON 数组中每个对象的 description 字段翻译成简体中文：' +
              '保留专有名词（技术名、工具名、协议名等）原文不译，表述通顺自然，长度与原文相当。' +
              '输出 JSON 数组，每个元素为 {"id": <原id>, "zh": "<译文>"}，字段名与输入一致。只输出 JSON。',
          },
          { role: 'user', content: JSON.stringify(list) },
        ],
      }),
    });
    if (!res.ok) throw new Error(`DeepSeek HTTP ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';
    const arr = JSON.parse(text.replace(/```json|```/g, '').trim());
    return new Map((Array.isArray(arr) ? arr : []).map((x) => [String(x.id), String(x.zh)]));
  } catch (e) {
    console.log(`[warn] 翻译失败（${e.message}），描述保持原文`);
    return new Map();
  }
};

const main = async () => {
  const weekAgo = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  const q = encodeURIComponent(`created:>${weekAgo}`);
  const data = await fetchJson(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=${perPage}`, {
    Accept: 'application/vnd.github+json',
  });
  const items = (data.items || []).map((r) => ({
    id: r.id,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description || '',
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    open_issues_count: r.open_issues_count,
    language: r.language || '',
    license: r.license?.spdx_id || r.license?.name || '',
    created_at: (r.created_at || '').slice(0, 10),
  }));

  const zh = await translate(items);
  const payload = {
    generatedAt: new Date().toISOString(),
    query: `created:>${weekAgo}`,
    total: data.total_count ?? items.length,
    items: items.map((r) => ({ ...r, descriptionZh: zh.get(String(r.id)) ?? r.description })),
  };

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2));
  const withZh = payload.items.filter((i) => i.descriptionZh !== i.description).length;
  console.log(`[ok] ${items.length} 个仓库 -> ${out}（翻译 ${withZh}/${items.length} 条）`);
};

main().catch((e) => {
  console.error('[error] ' + e.message);
  process.exit(1);
});
