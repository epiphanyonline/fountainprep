import styles from "../../styles/home-v3.module.css";

const steps = [
  ["01", "Choose what matters", "Select a subject, language or practical skill."],
  ["02", "Learn with expert support", "Meet a tutor or begin a guided academy pathway."],
  ["03", "Practise with purpose", "Use structured activities, cases, stories and guided practice."],
  ["04", "See real progress", "Parents and learners can follow what has been completed and what comes next."],
];

export default function LearningJourney() {
  return (
    <section className={`${styles.section} ${styles.journeySection}`}>
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>A clear learning journey</p>
          <h2>From the first lesson to visible capability.</h2>
          <p>No confusing pathways. Every step should move the learner toward something they can understand, do or explain with confidence.</p>
        </div>

        <div className={styles.journeyGrid}>
          {steps.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
