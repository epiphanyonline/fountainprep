import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

const paths = [
  {
    kicker: "LIVE TUTORS · LANGUAGES",
    title: "Language Tutors",
    text: "Build speaking confidence and connection through personal live lessons.",
    subjects: ["Yoruba", "Igbo", "Hausa", "French", "Spanish"],
    href: "/subjects?category=languages",
    imageClass: styles.liveLanguage,
  },
  {
    kicker: "LIVE TUTORS · ACADEMICS",
    title: "Academic Tutors",
    text: "Personal support for stronger foundations, school confidence and progress.",
    subjects: ["Maths", "English", "Science", "Primary", "Secondary"],
    href: "/subjects?category=academic",
    imageClass: styles.liveAcademic,
  },
  {
    kicker: "LIVE TUTORS · CREATIVE SKILLS",
    title: "Creative & Technology Tutors",
    text: "Develop creativity, problem-solving and practical digital capability.",
    subjects: ["Coding", "Music", "Digital Skills"],
    href: "/subjects?category=creative",
    imageClass: styles.liveCreative,
  },
];

export default function LiveTutorPaths() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Live one-to-one tutoring</p>
            <h2>Find the right tutor for the subject.</h2>
            <p>
              These are scheduled lessons with a real tutor. Choose the area your
              child needs and continue into the live-tutor booking pathway.
            </p>
          </div>
          <Link href="/subjects" className={styles.headerLink}>
            View all live-tutor subjects →
          </Link>
        </div>

        <div className={styles.livePathGrid}>
          {paths.map((path) => (
            <Link href={path.href} key={path.title} className={`${styles.livePathCard} ${path.imageClass}`}>
              <div className={styles.livePathOverlay} />
              <div className={styles.livePathContent}>
                <small>{path.kicker}</small>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
                <div className={styles.subjectChips}>
                  {path.subjects.map((subject) => <span key={subject}>{subject}</span>)}
                </div>
                <strong>Browse Tutors →</strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
