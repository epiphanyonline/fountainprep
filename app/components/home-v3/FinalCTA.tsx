import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

export default function FinalCTA() {
  return (
    <section className={styles.finalSection}>
      <div className={styles.shell}>
        <div className={styles.finalPanel}>
          <div className={styles.finalImage} />
          <div className={styles.finalCopy}>
            <p className={styles.eyebrow}>One platform. Two ways to learn.</p>
            <h2>Ready to give your child a learning advantage?</h2>
            <p>
              Choose personal one-to-one tutoring or an AI-assisted self-paced academy.
              FountainPrep makes the pathway clear from the very first click.
            </p>
            <div className={styles.heroActions}>
              <Link href="/start" className={styles.primaryButton}>Book a Live Tutor</Link>
              <Link href="/academies" className={styles.secondaryButton}>Explore Self-Paced Academy</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
