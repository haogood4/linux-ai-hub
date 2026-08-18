export function stripMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^[#>\-\s]+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFaq(body: string, sectionTitle: '常见问题' | 'FAQ'): { q: string; a: string }[] {
  const section = body.split(new RegExp(`^## ${sectionTitle}\\s*$`, 'm'))[1] ?? '';
  if (!section) return [];
  const pairs: { q: string; a: string }[] = [];
  for (const match of section.matchAll(/\*\*([^*\n]+)\*\*\s*\n*(.+?)(?=\n\*\*|\n## |$)/gs)) {
    const q = stripMarkdown(match[1]);
    const a = stripMarkdown(match[2]);
    if (q && a) pairs.push({ q, a });
  }
  return pairs;
}

export function articleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author?: string;
  tags?: string[];
}): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
    datePublished: params.datePublished,
    dateModified: params.datePublished,
    author: { '@type': 'Organization', name: params.author ?? 'TuxAI' },
    publisher: { '@type': 'Organization', name: 'TuxAI', logo: { '@type': 'ImageObject', url: 'https://tuxai.cn/favicon.svg' } },
    inLanguage: params.url.includes('/en/') ? 'en' : 'zh-CN',
  };
  if (params.tags?.length) ld.keywords = params.tags.join(', ');
  return ld;
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]): Record<string, unknown> | null {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
