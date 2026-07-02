import { makeLocaleRedirectGSSP } from '../../lib/redirect-helpers';

export default function ContactRedirect() {
  return null;
}

export const getServerSideProps = makeLocaleRedirectGSSP({
  destination: (locale) => `/${locale}/content#contact`,
  permanent: false,
});
