import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

const academies = [
  {
    title: "Financial Literacy",
    text: "Practical money skills through stories, cases, activities and guided practice.",
    topics: ["Saving", "Budgeting", "Assets", "Investing"],
    href: "/academies/financial-literacy",
    imageClass: styles.selfFinance,
    featured: true,
  },
  {
    title: "Coding",
    text: "Build computational thinking and practical technology skills step by step.",
    topics: ["Coding", "Projects", "Problem-solving"],
    href: "/academies/coding",
    imageClass: styles.selfCoding,
  },
  {
    title: "Language Academy",
    text: "Independent speaking, listening and language practice with guided support.",
    topics: ["Yoruba", "Igbo", "Hausa", "Mandarin"],
    href: "/academies/language",
    imageClass: styles.selfLanguage,
  },
  {
    title: "Biography of Greatness",
    text: "Discover remarkable lives, real impact and lessons that inspire young people.",
    topics: ["Leaders", "Innovators", "Change-makers"],
    href: "/academies/biography",
    imageClass: styles.selfBiography,
  },
];

export default function SelfPacedAcademies() {
  return (
    <section className={`${styles.section} ${styles.selfPacedSection}`}>
      <div className={styles.shell}>
        <div className={styles.selfPacedHeading}>
          <div>
            <div className={styles.selfPacedLabelRow}>
              <p className={styles.eyebrow}>Self-Paced Academies</p>
              <span className={styles.aiBadge}>Powered by Fountain AI</span>
            </div>
            <h2>Learn independently. Progress with guidance.</h2>
            <p>
              These are not live tutor bookings. Learners enter a structured,
              self-paced classroom with interactive lessons, activities and
              AI-assisted support they can use whenever they are ready to learn.
            </p>
          </div>
          <Link href="/academies" className={styles.selfPacedHeaderButton}>
            Explore Self-Paced Academy
          </Link>
        </div>

        <div className={styles.selfPacedGrid}>
          {academies.map((academy) => (
            <Link
              href={academy.href}
              key={academy.title}
              className={`${styles.selfPacedCard} ${academy.imageClass} ${academy.featured ? styles.selfFeatured : ""}`}
            >
              <div className={styles.selfPacedOverlay} />
              <div className={styles.selfPacedCardContent}>
                <div className={styles.selfPacedCardTop}>
                  <span>SELF-PACED</span>
                  <small>AI-assisted</small>
                </div>
                <h3>{academy.title}</h3>
                <p>{academy.text}</p>
                <div className={styles.subjectChips}>
                  {academy.topics.map((topic) => <span key={topic}>{topic}</span>)}
                </div>
                <strong>Explore Self-Paced Academy →</strong>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.switchPathBanner}>
          <div>
            <small>NEED PERSONAL GUIDANCE?</small>
            <strong>Switch to a live one-to-one tutor at any time.</strong>
          </div>
          <Link href="/subjects">Browse Live Tutors →</Link>
        </div>
      </div>
    </section>
  );
}
