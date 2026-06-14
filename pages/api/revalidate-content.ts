import type { NextApiRequest, NextApiResponse } from 'next';
import { locales } from '../../i18n/config';

type ResponseBody =
  | { revalidated: true; paths: string[]; skipped?: string[] }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const secret = typeof req.body?.secret === 'string' ? req.body.secret : '';
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const slug =
    typeof req.body?.slug === 'string' && /^[a-z0-9-]+$/.test(req.body.slug)
      ? req.body.slug
      : '';
  const contentPaths = locales.map((locale) => `/${locale}/content`);
  const blogPaths = slug ? locales.map((locale) => `/${locale}/blog/${slug}`) : [];

  try {
    for (const path of contentPaths) {
      await res.revalidate(path);
    }

    const skipped: string[] = [];
    for (const path of blogPaths) {
      try {
        await res.revalidate(path);
      } catch {
        skipped.push(path);
      }
    }

    return res.status(200).json({
      revalidated: true,
      paths: [...contentPaths, ...blogPaths.filter((path) => !skipped.includes(path))],
      ...(skipped.length > 0 ? { skipped } : {}),
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Error revalidating',
    });
  }
}
