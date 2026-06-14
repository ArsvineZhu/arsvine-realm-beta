import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslations } from 'next-intl';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import MDXComponents from '../../../components/mdx/MDXComponents';
import LocaleFallbackBanner from '../../../components/shared/LocaleFallbackBanner';
import HreflangLinks from '../../../components/shared/HreflangLinks';
import { AnimatedTitleChars } from '../../../components/shared/AnimatedTitleChars';
import {
  getPostBySlugAndLocale,
  getPostBySlugAndContentLocale,
  getAllPostsForLocale,
  getPostSlugs,
  getAvailablePostContentLocales,
  getBlogPostEntry,
  type BlogContentLocale,
} from '../../../lib/blog';
import { loadMessages } from '../../../lib/i18n-data';
import type { BlogPostMeta, TranslationStatus } from '../../../types';
import styles from '../../../styles/BlogDetailView.module.scss';
import hudStyles from '../../../styles/Home.module.scss';
import { useApp } from '../../../contexts/AppContext';
import { useTransition } from '../../../contexts/TransitionContext';
import { getSiteUrl } from '../../../data/site';
import { locales, defaultLocale, type Locale } from '../../../i18n/config';
import { formatReadingTime } from '../../../lib/format-reading-time';

const blogContentLocaleLabels: Record<BlogContentLocale, string> = {
  'zh-CN': '简中',
  'zh-TW': '繁中',
  en: 'English',
  ja: '日本語',
  ru: 'Русский',
  fr: 'Français',
};

function isBlogContentLocale(value: unknown): value is BlogContentLocale {
  return typeof value === 'string' && value in blogContentLocaleLabels;
}

interface BlogVariantPayload {
  meta: BlogPostMeta;
  mdxSource: MDXRemoteSerializeResult;
}

interface BlogPostPageProps {
  locale: Locale;
  messages: Record<string, unknown>;
  meta: BlogPostMeta;
  mdxSource: MDXRemoteSerializeResult;
  allPosts: BlogPostMeta[];
  translationStatus: TranslationStatus;
  actualLocale: Locale;
  availableContentLocales: BlogContentLocale[];
  contentVariants: Partial<Record<BlogContentLocale, BlogVariantPayload>>;
  access?: { mode: string; group?: string };
}

export default function BlogPostPage({
  locale,
  meta,
  mdxSource,
  allPosts,
  translationStatus,
  actualLocale,
  availableContentLocales,
  contentVariants,
  access,
}: BlogPostPageProps) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(!access || access.mode === 'public');
  const [authRedirecting, setAuthRedirecting] = useState(false);
  const [lazyVariants, setLazyVariants] = useState<Partial<Record<BlogContentLocale, BlogVariantPayload>>>({});
  const [loadingLang, setLoadingLang] = useState<BlogContentLocale | null>(null);

  useEffect(() => {
    if (!access || access.mode === 'public' || !access.group) {
      setAuthChecked(true);
      return;
    }
    fetch(`/api/access/check-grant?group=${encodeURIComponent(access.group)}`)
      .then((r) => r.json())
      .then((data: { ok: boolean; granted: boolean }) => {
        if (data.granted) {
          setAuthChecked(true);
        } else {
          setAuthRedirecting(true);
          router.replace(
            `/${locale}/access/${access.group}?next=${encodeURIComponent(`/${locale}/blog/${meta.slug}`)}`,
          );
        }
      })
      .catch(() => {
        setAuthRedirecting(true);
        router.replace(
          `/${locale}/access/${access.group}?next=${encodeURIComponent(`/${locale}/blog/${meta.slug}`)}`,
        );
      });
  }, [access, locale, meta.slug, router]);

  const queryLang = Array.isArray(router.query.lang) ? router.query.lang[0] : router.query.lang;
  const requestedLang = isBlogContentLocale(queryLang) ? queryLang : null;
  const allVariants = { ...contentVariants, ...lazyVariants };
  const derivedContentLocale = requestedLang && allVariants[requestedLang]
    ? requestedLang
    : actualLocale;
  const [selectedContentLocale, setSelectedContentLocale] = useState<BlogContentLocale>(derivedContentLocale);
  const selectedVariant = allVariants[selectedContentLocale] ?? { meta, mdxSource };
  const suppressFallbackBanner = Boolean(queryLang && isBlogContentLocale(queryLang));
  const effectiveStatus: TranslationStatus = suppressFallbackBanner
    ? 'source'
    : translationStatus;
  const effectiveOriginLocale: Locale = (selectedVariant.meta.originLocale
    ?? meta.originLocale
    ?? actualLocale) as Locale;

  if (router.isFallback || authRedirecting) {
    return <BlogLoadingShell />;
  }

  if (!authChecked) {
    return <BlogLoadingShell />;
  }

  return (
    <BlogDetailContent
      key={`${locale}:${meta.slug}`}
      locale={locale}
      meta={selectedVariant.meta}
      mdxSource={selectedVariant.mdxSource}
      allPosts={allPosts}
      translationStatus={effectiveStatus}
      actualLocale={actualLocale}
      originLocale={effectiveOriginLocale}
      selectedContentLocale={selectedContentLocale}
      setSelectedContentLocale={setSelectedContentLocale}
      availableContentLocales={availableContentLocales}
      slug={meta.slug}
      lazyVariants={lazyVariants}
      setLazyVariants={setLazyVariants}
      loadingLang={loadingLang}
      setLoadingLang={setLoadingLang}
    />
  );
}

function BlogLoadingShell() {
  const { isInverted } = useApp();
  const tCommon = useTranslations('common');
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.pageWrapper} ${isInverted ? hudStyles.inverted : ''}`}>
      <Head><title>{tCommon('loading')}</title></Head>
      <div className={styles.mainContent}>
        <header className={`${styles.headerSection} ${entered ? styles.entered : ''}`}>
          <div className={styles.headerContent}>
            <span className={styles.headerSignal}>{tCommon('signalFragment')}</span>
          </div>
        </header>
        <section className={styles.contentSection}>
          <div className={styles.loadingIndicator}>
            <span className={styles.loadingText}>{tCommon('decoding')}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function BlogDetailContent({
  locale,
  meta,
  mdxSource,
  allPosts,
  translationStatus,
  actualLocale,
  originLocale,
  selectedContentLocale,
  setSelectedContentLocale,
  availableContentLocales,
  slug,
  lazyVariants,
  setLazyVariants,
  loadingLang,
  setLoadingLang,
}: Omit<BlogPostPageProps, 'messages' | 'contentVariants' | 'access'> & {
  selectedContentLocale: BlogContentLocale;
  setSelectedContentLocale: React.Dispatch<React.SetStateAction<BlogContentLocale>>;
  originLocale: Locale;
  slug: string;
  lazyVariants: Partial<Record<BlogContentLocale, BlogVariantPayload>>;
  setLazyVariants: React.Dispatch<React.SetStateAction<Partial<Record<BlogContentLocale, BlogVariantPayload>>>>;
  loadingLang: BlogContentLocale | null;
  setLoadingLang: React.Dispatch<React.SetStateAction<BlogContentLocale | null>>;
}) {
  const { isInverted } = useApp();
  const { navigateTo } = useTransition();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const router = useRouter();
  const readingLabel = formatReadingTime(meta.readingMinutes, locale);

  const currentIndex = allPosts.findIndex((p) => p.slug === meta.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [titleDone, setTitleDone] = useState(false);

  useEffect(() => {
    if (!titleRef.current) { setTitleDone(true); return; }
    const timer = setTimeout(() => {
      if (!titleRef.current) { setTitleDone(true); return; }
      const wrappers = titleRef.current.querySelectorAll(`.${styles.charWrapper}`);
      const inners = titleRef.current.querySelectorAll(`.${styles.charInner}`);
      if (inners.length === 0) { setTitleDone(true); return; }
      wrappers.forEach((wrapper, i) => {
        const inner = inners[i];
        gsap.set(wrapper, { overflow: 'hidden', display: 'inline-block', position: 'relative', verticalAlign: 'top' });
        gsap.set(inner, { y: '110%', opacity: 0, display: 'inline-block' });
        gsap.to(inner, {
          y: '0%',
          opacity: 1,
          duration: 0.6,
          delay: 0.4 + i * 0.06,
          ease: 'power3.out',
          onComplete: i === inners.length - 1 ? () => setTitleDone(true) : undefined,
        });
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [meta.title, selectedContentLocale]);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!titleDone) return;
    const body = contentBodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    const children = Array.from(body.children) as HTMLElement[];
    if (children.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting);
        entering.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${i * 0.07}s`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.addEventListener('transitionend', () => {
            el.style.transitionDelay = '';
            el.style.transform = 'none';
          }, { once: true });
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: wrapper },
    );

    const timer = setTimeout(() => {
      children.forEach((child) => observer.observe(child));
    }, 200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [titleDone, selectedContentLocale]);

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(`/${locale}/blog`);
  }, [navigateTo, locale]);

  const [activeNav, setActiveNav] = useState('header');
  const [isPastHeader, setIsPastHeader] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-nav-id');
            if (id) setActiveNav(id);
          }
        });
      },
      { threshold: 0.3, root: wrapper }
    );

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.getAttribute('data-nav-id') === 'header') {
            setIsPastHeader(!entry.isIntersecting);
          }
        });
      },
      { threshold: 0.55, root: wrapper }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) {
        navObserver.observe(el);
        if (el.getAttribute('data-nav-id') === 'header') {
          headerObserver.observe(el);
        }
      }
    });

    return () => {
      navObserver.disconnect();
      headerObserver.disconnect();
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const navItems = useMemo(() => [
    { id: 'header', label: tNav('top') },
    { id: 'content', label: tNav('content') },
    { id: 'end', label: tNav('end') },
  ], [tNav]);

  const updateContentLocaleQuery = useCallback((nextContentLocale: BlogContentLocale) => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    if (nextContentLocale === actualLocale) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', nextContentLocale);
    }
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [actualLocale]);

  const handleContentLocaleChange = useCallback((nextContentLocale: BlogContentLocale) => {
    if (nextContentLocale === selectedContentLocale || loadingLang) return;
    if (lazyVariants[nextContentLocale]) {
      setSelectedContentLocale(nextContentLocale);
      updateContentLocaleQuery(nextContentLocale);
      return;
    }
    setLoadingLang(nextContentLocale);
    fetch(`/api/blog/variant?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(nextContentLocale)}`)
      .then((r) => r.json())
      .then((data: { meta: BlogPostMeta; mdxSource: MDXRemoteSerializeResult }) => {
        setLazyVariants((prev) => ({ ...prev, [nextContentLocale]: data }));
        setSelectedContentLocale(nextContentLocale);
        updateContentLocaleQuery(nextContentLocale);
        setLoadingLang(null);
      })
      .catch(() => {
        setLoadingLang(null);
      });
  }, [
    lazyVariants,
    loadingLang,
    selectedContentLocale,
    setLazyVariants,
    setLoadingLang,
    setSelectedContentLocale,
    slug,
    updateContentLocaleQuery,
  ]);

  return (
    <div ref={wrapperRef} className={`${styles.pageWrapper} ${isInverted ? hudStyles.inverted : ''}`}>
      <Head>
        <title>{`${meta.title} // Blog`}</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${getSiteUrl()}/${locale}/blog/${meta.slug}`} />
        <meta property="article:published_time" content={meta.date} />
        {meta.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <HreflangLinks basePath={`/blog/${meta.slug}`} />
      </Head>

      <div className={styles.mainContent}>

        {translationStatus !== 'source' && (
          <LocaleFallbackBanner requestedLocale={locale} actualLocale={actualLocale} originLocale={originLocale} status={translationStatus} />
        )}

        <header
          key={`header:${selectedContentLocale}`}
          className={`${styles.headerSection} ${entered ? styles.entered : ''}`}
          ref={(el) => { sectionRefs.current['header'] = el; }}
          data-nav-id="header"
        >
          <div className={styles.headerContent}>
            <span className={styles.headerSignal}>{tCommon('signalFragment')}</span>
            <h1 ref={titleRef} className={styles.headerTitle}>
              <AnimatedTitleChars
                text={meta.title}
                wrapperClassName={styles.charWrapper}
                innerClassName={styles.charInner}
                wordWrapperClassName={styles.wordWrapper}
                uppercase={false}
              />
            </h1>
            <div className={styles.headerMeta}>
              {meta.date && <span className={styles.headerDate}>{meta.date}</span>}
              {readingLabel && <span className={styles.headerReadingTime}>{readingLabel}</span>}
            </div>
            {availableContentLocales.length > 1 && (
              <div className={styles.articleLocaleSwitcher} aria-label="Article language switcher">
                {availableContentLocales.map((contentLocale) => (
                  <button
                    key={contentLocale}
                    type="button"
                    className={`${styles.articleLocaleButton} ${selectedContentLocale === contentLocale ? styles.activeArticleLocaleButton : ''}`}
                    onClick={() => handleContentLocaleChange(contentLocale)}
                    disabled={Boolean(loadingLang)}
                  >
                    {blogContentLocaleLabels[contentLocale]}
                  </button>
                ))}
              </div>
            )}
            {meta.tags.length > 0 && (
              <div className={styles.headerTags}>
                {meta.tags.map((tag) => (
                  <span key={tag} className={styles.headerTag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </header>

        <section
          key={`section:${selectedContentLocale}`}
          className={styles.contentSection}
          ref={(el) => { sectionRefs.current['content'] = el; }}
          data-nav-id="content"
        >
          {(!titleDone || Boolean(loadingLang)) && (
            <div className={styles.loadingIndicator}>
              <span className={styles.loadingText}>{tCommon('decoding')}</span>
            </div>
          )}
          <div key={selectedContentLocale} ref={contentBodyRef} className={styles.contentBody}>
            <MDXRemote {...mdxSource} components={MDXComponents} />
          </div>
        </section>

        <footer
          className={`${styles.footer} ${entered ? styles.entered : ''}`}
          ref={(el) => { sectionRefs.current['end'] = el; }}
          data-nav-id="end"
        >
          <div className={styles.endMarker}>
            <span className={styles.endSignal}>{tCommon('endTransmission')}</span>
          </div>
          <div className={styles.footerNav}>
            {prevPost ? (
              <Link
                href={`/${locale}/blog/${prevPost.slug}`}
                className={`${styles.footerNavButton} ${styles.footerNavPrev}`}
                onClick={(e) => { e.preventDefault(); navigateTo(`/${locale}/blog/${prevPost.slug}`); }}
                data-cursor-label="PREVIOUS"
              >
                <span className={styles.footerNavArrow}>←</span>
                <span className={styles.footerNavTitle}>{prevPost.title}</span>
              </Link>
            ) : (
              <Link
                href={`/${locale}/blog`}
                className={`${styles.footerNavButton} ${styles.footerNavPrev}`}
                onClick={handleBack}
                data-cursor-label="BACK"
              >
                <span className={styles.footerNavArrow}>←</span>
                <span className={styles.footerNavTitle}>{tCommon('returnToIndex')}</span>
              </Link>
            )}
            {nextPost ? (
              <Link
                href={`/${locale}/blog/${nextPost.slug}`}
                className={`${styles.footerNavButton} ${styles.footerNavNext}`}
                onClick={(e) => { e.preventDefault(); navigateTo(`/${locale}/blog/${nextPost.slug}`); }}
                data-cursor-label="NEXT"
              >
                <span className={styles.footerNavTitle}>{nextPost.title}</span>
                <span className={styles.footerNavArrow}>→</span>
              </Link>
            ) : (
              <Link
                href={`/${locale}/blog`}
                className={`${styles.footerNavButton} ${styles.footerNavNext}`}
                onClick={handleBack}
                data-cursor-label="BACK"
              >
                <span className={styles.footerNavTitle}>{tCommon('returnToIndex')}</span>
                <span className={styles.footerNavArrow}>→</span>
              </Link>
            )}
          </div>
        </footer>
      </div>

      <nav className={`${styles.rightNav} ${isPastHeader ? styles.visible : ''}`}>
        <button className={styles.rightNavBack} onClick={handleBack} data-cursor-label="BACK" aria-label="BACK" />
        <div className={styles.rightNavDivider} />
        {navItems.map((nav) => (
          <button
            key={nav.id}
            className={`${styles.rightNavLink} ${activeNav === nav.id ? styles.active : ''}`}
            onClick={() => scrollToSection(nav.id)}
          >
            {nav.label}
          </button>
        ))}
      </nav>

    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPostSlugs();
  const paths = slugs.flatMap((slug) =>
    locales.map((locale) => ({ params: { locale, slug } })),
  );
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const locale = (params?.locale as Locale) || defaultLocale;
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  if (!slug) {
    return { notFound: true };
  }

  try {
    const entry = await getBlogPostEntry(slug);
    if (!entry) {
      return { notFound: true };
    }

    if (entry.access.mode === 'totp' && !entry.access.group) {
      return { notFound: true };
    }

    const { meta, content, actualLocale, translationStatus } = await getPostBySlugAndLocale(slug, locale);
    const mdxSource = await serialize(content);
    const allPosts = await getAllPostsForLocale(locale);
    const messages = await loadMessages(locale);
    const availableContentLocales = await getAvailablePostContentLocales(slug);

    return {
      props: {
        locale,
        messages,
        meta,
        mdxSource,
        allPosts,
        translationStatus,
        actualLocale,
        availableContentLocales,
        contentVariants: {},
        access: normalizeAccess(entry.access),
      },
      revalidate: 300,
    };
  } catch {
    return { notFound: true };
  }
};

function normalizeAccess(access?: { mode: string; group?: string }): { mode: string; group?: string } {
  if (access?.mode === 'totp') {
    return { mode: 'totp', group: access.group?.trim() || undefined };
  }
  return { mode: 'public' };
}
