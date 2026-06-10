import type { GetServerSideProps } from 'next';

// /license 永久重定向到 /copyright（两者是同一页内容）
// 用 getServerSideProps 而非 getStaticProps：Next.js 不允许 prerender 时返回 redirect。
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/copyright',
    permanent: true,
  },
});

export default function LicenseRedirect() {
  return null;
}
