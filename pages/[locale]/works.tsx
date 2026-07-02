import { makeLocaleRedirectGSSP } from '../../lib/redirect-helpers';

export default function WorksRedirect() {
  return null;
}

export const getServerSideProps = makeLocaleRedirectGSSP({
  destination: (locale) => `/${locale}/content#works`,
  permanent: false,
});
