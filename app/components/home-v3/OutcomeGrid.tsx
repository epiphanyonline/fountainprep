import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

const outcomes = [
  {
    title: "Language & Culture",
    description:
      "Help your child speak confidently with family and build a meaningful connection to language and heritage.",
    href: "/subjects",
    className: styles.outcomeLanguage,
    kicker: "Connection",
  },
  {
    title: "Academic Excellence",
    description:
      "Build confidence in Maths, English and Science with structured support from expert tutors.",
    href: "/subjects",
    className: styles.outcomeAcademic,
    kicker: "Confidence",
  },
  {
    title: "Coding & Future Skills",
    description:
      "Help your child understand technology, solve problems and build practical coding skills with personal guidance.",
    href: "/subjects",
    className: styles.outcomeCoding,
    kicker: "Create",
  },
];

export default function OutcomeGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>
            What your child can build
          </p>

          <h2>
            Learning that becomes confidence,
            capability and opportunity.
          </h2>

          <p>
            Fountain Prep connects learners with expert
            tutors for structured, private 1-to-1 online
            lessons.
          </p>
        </div>

        <div className={styles.outcomeGrid}>
          {outcomes.map((item) => (
            <Link
              href={item.href}
              key={item.title}
              className={`${styles.outcomeCard} ${item.className}`}
            >
              <div className={styles.outcomeOverlay} />

              <div className={styles.outcomeContent}>
                <small>{item.kicker}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Explore live learning →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}