import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

export default function HomeHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.shell}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              Live 1-to-1 online learning for families worldwide
            </p>

            <h1 className={styles.heroTitle}>
              The Learning Partner
              <span>for Families Around the World.</span>
            </h1>

            <p className={styles.heroLead}>
              Give your child personal attention from a carefully
              selected tutor through live 1-to-1 online lessons
              built around their learning needs.
            </p>

            <div className={styles.heroActions}>
              <Link
                href="/start"
                className={styles.primaryButton}
              >
                Find a Tutor
              </Link>

              <Link
                href="/subjects"
                className={styles.secondaryButton}
              >
                Explore Subjects
              </Link>
            </div>

            <div className={styles.learningModePills}>
              <span>
                <strong>Live 1-to-1</strong>
                {" · "}
                personal attention
              </span>

              <span>
                <strong>Flexible scheduling</strong>
                {" · "}
                built around your family
              </span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroPhoto} />

            <div
              className={`${styles.heroFloatCard} ${styles.liveCard}`}
            >
              <small>LIVE 1-TO-1 LESSON</small>
              <strong>
                Personal guidance from an expert tutor
              </strong>
            </div>

            <div
              className={`${styles.heroFloatCard} ${styles.progressCard}`}
            >
              <small>PARENT PROGRESS</small>
              <strong>
                Clear learning updates you can follow
              </strong>
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