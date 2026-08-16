import { defineCollection, z } from 'astro:content';

const tutorials = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string().default('TuxAI'),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    estimatedReadTime: z.number().int().positive(),
    environment: z.array(z.enum(['虚拟机', 'U盘', '双系统', '服务器', 'GPU', '容器'])).default([]),
  }),
});

const paths = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    level: z.enum(['入门', '进阶', '高级']).default('入门'),
    order: z.number().int().default(0),
  }),
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.string(),
    description: z.string(),
    platforms: z.array(z.string()).default([]),
    license: z.string().default('开源'),
    officialUrl: z.string().url(),
    rating: z.number().min(0).max(5).optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { tutorials, paths, tools };