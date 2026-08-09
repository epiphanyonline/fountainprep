import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

export default function ChooseLearningMode() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Two ways to learn</p>
          <h2>Choose how your child learns best.</h2>
          <p>
            Scheduled personal support with an expert tutor, or flexible
            self-paced learning available anytime.
          </p>
        </div>

        <div className={styles.modeGrid}>
          <article className={`${styles.modeCard} ${styles.modeLive}`}>
            <div className={styles.modeTopline}>
              <span className={styles.modeBadge}>LIVE TUTORS</span>
              <span className={styles.modeMeta}>Human-led · scheduled</span>
            </div>
            <h3>Personal one-to-one lessons.</h3>
            <p>
              For learners who benefit from conversation, individual guidance,
              accountability and real-time feedback.
            </p>
            <ul>
              <li>Expert human tutor</li>
              <li>Scheduled weekly lessons</li>
              <li>Real-time questions and feedback</li>
              <li>Parent progress visibility</li>
            </ul>
            <Link href="/subjects" className={styles.modeAction}>
              Browse Live Tutor Subjects →
            </Link>
          </article>

          <article className={`${styles.modeCard} ${styles.modeSelfPaced}`}>
            <div className={styles.modeTopline}>
              <span className={styles.modeBadge}>SELF-PACED ACADEMIES</span>
              <span className={styles.aiBadge}>AI-assisted</span>
            </div>
            <h3>Learn independently, anytime.</h3>
            <p>
              Structured academies combine interactive lessons, practice and
              AI-assisted guidance so learners can progress at their own pace.
            </p>
            <ul>
              <li>Learn whenever it suits your family</li>
              <li>Interactive lessons and practice</li>
              <li>AI-assisted explanations and feedback</li>
              <li>Progress saved across the learning journey</li>
            </ul>
            <Link href="/academies" className={styles.modeAction}>
              Explore Self-Paced Academy →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
