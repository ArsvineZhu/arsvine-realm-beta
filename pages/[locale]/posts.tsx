import type { GetServerSideProps } from 'next';
import { defaultLocale, isLocale, type Locale } from '../../i18n/config';

export default function PostsRedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const rawLocale = params?.locale as string | undefined;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return {
    redirect: {
      destination: `/${locale}/content#blog`,
      permanent: false,
    },
  };
};
