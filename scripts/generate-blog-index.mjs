#!/usr/bin/env node

/**
 * generate-blog-index.mjs
 *
 * Reads MDX files from arsvine-content/blog/ and generates a blog-index.json
 * with pre-computed readingMinutes for each variant.
 *
 * Usage:
 *   node scripts/generate-blog-index.mjs [--repo <path-to-arsvine-content>] [--output <output-path>]
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import matter from 'gray-matter';

const { values } = parseArgs({
  options: {
    repo: { type: 'string', default: '' },
    output: { type: 'string', default: '' },
    stdout: { type: 'boolean', default: false },
  },
  strict: false,
});

function findContentRepo() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const projectRoot = resolve(scriptDir, '..');
  const candidates = Array.from(
    new Set([
      // Canonical workspace layout: arsvine-realm and arsvine-content are siblings.
      resolve(projectRoot, '..', 'arsvine-content'),
      // Legacy fallback for older local setups that nested the content repo in arsvine-realm.
      resolve(projectRoot, 'arsvine-content'),
      resolve(process.cwd(), '..', 'arsvine-content'),
      resolve(process.cwd(), 'arsvine-content'),
    ]),
  );

  for (const p of candidates) {
    if (existsSync(join(p, 'blog'))) return p;
    if (existsSync(join(p, 'archive', 'blog'))) return p;
  }
  console.error(
    `Cannot find arsvine-content repo. Checked:\n- ${candidates.join('\n- ')}\nUse --repo <path>.`,
  );
  process.exit(1);
}

const CONTENT_REPO = values.repo || findContentRepo();
const BLOG_DIR = existsSync(join(CONTENT_REPO, 'archive', 'blog'))
  ? join(CONTENT_REPO, 'archive', 'blog')
  : join(CONTENT_REPO, 'blog');

// ── Reading-time estimation (mirrors lib/blog.ts) ──

const CJK_CHAR_RE = /[㐀-䶿一-鿿-鿿぀-ゟ゠-ヿ가-힯]/g;
const LATIN_WORD_RE = /[A-Za-zÀ-ɏЀ-ӿ]+(?:[''-][A-Za-zÀ-ɏЀ-ӿ]+)*/g;

function estimateReadingMinutes(content, locale = 'zh-CN') {
  if (!content) return 1;

  const stripped = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/<\/?[a-zA-Z][^>]*>/g, ' ')
    .replace(/^\s*(?:import|export)\s.+$/gm, ' ');

  const cjkChars = stripped.match(CJK_CHAR_RE)?.length ?? 0;
  const latinWords = stripped.match(LATIN_WORD_RE)?.length ?? 0;

  const cpm = 200;
  const wpm = 115;

  const minutes = cjkChars / cpm + latinWords / wpm;
  return Math.max(1, Math.ceil(minutes));
}

// ── Main ──

function processBlogDir() {
  if (!existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const slugs = readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const posts = [];

  for (const slug of slugs) {
    const slugDir = join(BLOG_DIR, slug);
    const files = readdirSync(slugDir).filter((f) => f.endsWith('.mdx'));

    if (files.length === 0) continue;

    const variants = {};
    const availableLocales = [];
    let sharedDate = '';
    let sharedUpdatedAt = '';
    let sharedTags = [];
    let sharedPinned = false;
    let sharedAccess = { mode: 'public' };

    for (const file of files) {
      const locale = basename(file, '.mdx');
      const raw = readFileSync(join(slugDir, file), 'utf8');
      const { data, content } = matter(raw);

      availableLocales.push(locale);
      variants[locale] = {
        title: data.title || slug,
        excerpt: data.excerpt || '',
        readingMinutes: estimateReadingMinutes(content, locale),
        ...(data.originLocale ? { originLocale: data.originLocale } : {}),
      };

      // Use first locale's shared fields as source of truth
      if (!sharedDate && data.date) sharedDate = String(data.date);
      if (!sharedUpdatedAt && data.updated) sharedUpdatedAt = String(data.updated);
      if (data.tags && data.tags.length > 0 && sharedTags.length === 0) sharedTags = data.tags;
      if (data.pinned !== undefined) sharedPinned = Boolean(data.pinned);
      if (data.access && typeof data.access === 'object') sharedAccess = data.access;
    }

    posts.push({
      slug,
      date: sharedDate,
      updatedAt: sharedUpdatedAt || (sharedDate ? `${sharedDate}T00:00:00.000Z` : ''),
      tags: sharedTags,
      pinned: sharedPinned,
      access: sharedAccess,
      availableLocales: availableLocales.sort((a, b) => {
        const order = ['zh-CN', 'zh-TW', 'en', 'ja', 'ru', 'fr'];
        return order.indexOf(a) - order.indexOf(b);
      }),
      variants,
    });
  }

  // Sort: pinned first, then by date descending
  posts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    posts,
  };
}

const index = processBlogDir();
const json = JSON.stringify(index, null, 2);

if (values.stdout || !values.output) {
  process.stdout.write(json + '\n');
} else {
  writeFileSync(values.output, json, 'utf8');
  console.error(`Written to ${values.output} (${index.posts.length} posts)`);
}
