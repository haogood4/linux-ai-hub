import { defineCollection, z } from 'astro:content';

const tutorialSchema = z.object({
  title: z.string(),
  author: z.string().default('TuxAI'),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  estimatedReadTime: z.number().int().positive(),
  environment: z.array(z.enum(['虚拟机', 'U盘', '双系统', '服务器', 'GPU', '容器'])).default([]),
});

const tutorials = defineCollection({
  type: 'content',
  schema: tutorialSchema,
});

const tutorialsEn = defineCollection({
  type: 'content',
  schema: tutorialSchema,
});

const paths = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.enum(['入门', '进阶', '高级']).default('入门'),
    order: z.number().int().default(0),
    goal: z.string(),
    duration: z.string(),
    audience: z.string(),
    steps: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
        note: z.string(),
      }),
    ),
  }),
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    platforms: z.array(z.string()).default([]),
    license: z.string().default('开源'),
    officialUrl: z.string().url(),
    rating: z.number().min(0).max(5).optional(),
    updated: z.coerce.date().optional(),
  }),
});

const blogSchema = z.object({
  title: z.string(),
  author: z.string().default('TuxAI'),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  excerpt: z.string(),
});

const blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const blogEn = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const distros = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    family: z.enum(['debian', 'arch', 'redhat']),
    tagline: z.string(),
    difficulty: z.string(),
    desktop: z.string(),
    stability: z.string(),
    updateCycle: z.string(),
    supportCycle: z.string(),
    requirements: z.string(),
    officialUrl: z.string().url(),
    installGuideUrl: z.string().url(),
    wikiUrl: z.string().url().optional(),
    communityUrl: z.string().url().optional(),
    date: z.coerce.date(),
  }),
});

export const collections = {
  tutorials,
  'tutorials-en': tutorialsEn,
  paths,
  tools,
  blog,
  'blog-en': blogEn,
  distros,
} as const;