import { makeLocaleRedirectGSSP } from '../../lib/redirect-helpers';

export default function LifeRedirect() {
  return null;
}

export const getServerSideProps = makeLocaleRedirectGSSP({
  destination: (locale) => `/${locale}/content#life`,
  permanent: false,
});
