import Link from 'next/link';
import styles from '../../styles/Home.module.scss';
import Noise from '../effects/Noise';
import { siteConfig } from '../../data/site';

export default function AboutSection({
  aboutSectionRef,
  aboutContentRef,
  runtime,
  totalVisits,
  currentVisitors,
}) {
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > siteConfig.copyrightYearStart
      ? `${siteConfig.copyrightYearStart}-${currentYear}`
      : `${siteConfig.copyrightYearStart}`;
  return (
    <div id="about-section" ref={aboutSectionRef} className={`${styles.contentSection} ${styles.aboutSection}`}>
      <Noise />
      <div ref={aboutContentRef} className={styles.aboutContentInner}>
        <h2>ABOUT</h2>
        <div className={styles.siteStatsContainer}>
          <p>System Uptime: {runtime}</p>
          <p>Total Visits: {totalVisits}</p>
          <p>Online Now: {currentVisitors}</p>
        </div>
        <div className={styles.footerInfo}>
          <p>Code licensed under MIT.</p>
          <p>Content licensed under CC BY-NC-ND 4.0 unless otherwise stated.</p>
          <p><Link href="/copyright">Details →</Link></p>
          <p>© {yearRange} {siteConfig.author}.</p>
        </div>

      </div>

    </div>
  );
}
