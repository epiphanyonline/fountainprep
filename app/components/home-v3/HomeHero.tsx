import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

export default function HomeHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.shell}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Premium learning for families worldwide</p>
            <h1 className={styles.heroTitle}>
              The learning partner
              <span>for families around the world.</span>
            </h1>
            <p className={styles.heroLead}>
              Choose expert live tutoring or flexible self-paced academies.
              Both are designed to help children build confidence, master
              important skills and make progress parents can see.
            </p>
            <div className={styles.heroActions}>
              <Link href="/start" className={styles.primaryButton}>Book a Live Tutor</Link>
              <Link href="/academies" className={styles.secondaryButton}>Explore Self-Paced Academy</Link>
            </div>
            <div className={styles.learningModePills}>
              <span><strong>Live Tutors</strong> · scheduled 1-to-1 learning</span>
              <span><strong>Self-Paced Academies</strong> · AI-assisted, learn anytime</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroPhoto} />
            <div className={`${styles.heroFloatCard} ${styles.liveCard}`}>
              <small>LIVE 1-TO-1 LESSON</small>
              <strong>Personal guidance from an expert tutor</strong>
            </div>
            <div className={`${styles.heroFloatCard} ${styles.progressCard}`}>
              <small>PARENT PROGRESS</small>
              <strong>Clear learning updates you can follow</strong>
            </div>
          </div>
        </div>

        <div className={styles.countryStrip}>
          <span>Designed for families across</span>
          <strong>United Kingdom</strong>
          <strong>United States</strong>
          <strong>Canada</strong>
          <strong>Australia</strong>
          <strong>Nigeria and more</strong>
        </div>
      </div>
    </section>
  );
}
