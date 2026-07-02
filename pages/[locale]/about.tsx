import { makeLocaleRedirectGSSP } from '../../lib/redirect-helpers';

export default function AboutRedirect() {
  return null;
}

export const getServerSideProps = makeLocaleRedirectGSSP({
  destination: (locale) => `/${locale}/content#about`,
  permanent: false,
});
