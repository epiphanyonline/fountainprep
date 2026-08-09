import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

const outcomes = [
  {
    title: "Language & Culture",
    description: "Help your child speak confidently with family and build a meaningful connection to language and heritage.",
    href: "/subjects",
    className: styles.outcomeLanguage,
    kicker: "Connection",
  },
  {
    title: "Academic Excellence",
    description: "Build confidence in Maths, English and Science with structured support from expert tutors.",
    href: "/subjects",
    className: styles.outcomeAcademic,
    kicker: "Confidence",
  },
  {
    title: "Coding & Future Skills",
    description: "Move from simply using technology to understanding, creating and building with it.",
    href: "/academies",
    className: styles.outcomeCoding,
    kicker: "Create",
  },
  {
    title: "Financial Literacy",
    description: "Give children practical money knowledge, better decision-making skills and an early financial advantage.",
    href: "/academies/financial-literacy",
    className: styles.outcomeFinance,
    kicker: "Life skill",
  },
];

export default function OutcomeGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>What your child can build</p>
          <h2>Learning that becomes confidence, capability and opportunity.</h2>
          <p>FountainPrep brings academic learning, culture and practical life skills into one guided learning experience.</p>
        </div>

        <div className={styles.outcomeGrid}>
          {outcomes.map((item) => (
            <Link href={item.href} key={item.title} className={`${styles.outcomeCard} ${item.className}`}>
              <div className={styles.outcomeOverlay} />
              <div className={styles.outcomeContent}>
                <small>{item.kicker}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Explore learning →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
