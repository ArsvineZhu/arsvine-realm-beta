import type { GetServerSideProps } from 'next';
import { defaultLocale, isLocale, type Locale } from '../../../i18n/config';

export default function PostSlugRedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const rawLocale = params?.locale as string | undefined;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  if (!slug) {
    return {
      redirect: {
        destination: `/${locale}/content#blog`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/${locale}/blog/${slug}`,
      permanent: false,
    },
  };
};
