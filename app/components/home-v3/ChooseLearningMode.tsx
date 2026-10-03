import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

export default function ChooseLearningMode() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>
            Personal learning, made simple
          </p>

          <h2>
            From finding the right tutor to starting the
            first lesson.
          </h2>

          <p>
            Fountain Prep makes it simple for parents to
            arrange structured, private online learning
            around their child and their schedule.
          </p>
        </div>

        <div className={styles.modeGrid}>
          <article
            className={`${styles.modeCard} ${styles.modeLive}`}
          >
            <div className={styles.modeTopline}>
              <span className={styles.modeBadge}>
                1 · CHOOSE
              </span>
              <span className={styles.modeMeta}>
                Find the right support
              </span>
            </div>

            <h3>Choose what your child wants to learn.</h3>

            <p>
              Explore subjects including Maths, English,
              Science, Coding and Nigerian languages.
            </p>

            <ul>
              <li>Academic subjects</li>
              <li>Yoruba, Igbo and Hausa</li>
              <li>Coding and future skills</li>
              <li>Learning matched to your child</li>
            </ul>

            <Link
              href="/subjects"
              className={styles.modeAction}
            >
              Explore Subjects →
            </Link>
          </article>

          <article
            className={`${styles.modeCard} ${styles.modeSelfPaced}`}
          >
            <div className={styles.modeTopline}>
              <span className={styles.modeBadge}>
                2 · SCHEDULE
              </span>
              <span className={styles.aiBadge}>
                Flexible
              </span>
            </div>

            <h3>
              Choose a tutor and timetable that works.
            </h3>

            <p>
              Select your preferred learning plan and
              arrange recurring live lessons around your
              family&apos;s schedule.
            </p>

            <ul>
              <li>Private 1-to-1 online lessons</li>
              <li>Carefully selected tutors</li>
              <li>Convenient recurring timetable</li>
              <li>Secure online payment</li>
            </ul>

            <Link
              href="/start"
              className={styles.modeAction}
            >
              Find a Tutor →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}