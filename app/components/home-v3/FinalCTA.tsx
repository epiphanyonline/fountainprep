import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

export default function FinalCTA() {
  return (
    <section className={styles.finalSection}>
      <div className={styles.shell}>
        <div className={styles.finalPanel}>
          <div className={styles.finalImage} />

          <div className={styles.finalCopy}>
            <p className={styles.eyebrow}>
              Learning starts with the right support
            </p>

            <h2>
              Ready to find the right tutor for your child?
            </h2>

            <p>
              Choose a subject, find a tutor and schedule
              live 1-to-1 online lessons around your
              family&apos;s timetable.
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
          </div>
        </div>
      </div>
    </section>
  );
}