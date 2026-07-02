import type { GetStaticPaths } from 'next';
import { locales } from '../../i18n/config';
import { makeLocaleRedirectGSP } from '../../lib/redirect-helpers';

export default function ContactRedirect() {
  return null;
}

export const getStaticProps = makeLocaleRedirectGSP({
  destination: (locale) => `/${locale}/content#contact`,
  permanent: false,
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: locales.map((locale) => ({ params: { locale } })),
  fallback: false,
});
