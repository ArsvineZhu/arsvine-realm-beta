import type { NextApiRequest, NextApiResponse } from 'next';
import { getPostBySlugAndContentLocale, type BlogContentLocale } from '../../../lib/blog';
import { serialize } from 'next-mdx-remote/serialize';

const VALID_LOCALES = ['zh-CN', 'zh-TW', 'en', 'ja', 'ru', 'fr'] as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { slug, lang } = req.query;
  if (typeof slug !== 'string' || typeof lang !== 'string') {
    return res.status(400).json({ error: 'missing_slug_or_lang' });
  }

  if (!(VALID_LOCALES as readonly string[]).includes(lang)) {
    return res.status(400).json({ error: 'invalid_locale' });
  }

  try {
    const variant = await getPostBySlugAndContentLocale(slug, lang as BlogContentLocale);
    const mdxSource = await serialize(variant.content);
    return res.status(200).json({
      meta: variant.meta,
      mdxSource,
    });
  } catch {
    return res.status(404).json({ error: 'not_found' });
  }
}
