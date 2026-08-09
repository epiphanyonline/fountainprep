import Link from "next/link";
import styles from "../../styles/home-v3.module.css";

const reasons = [
  ["01", "Real expert tutors", "Human guidance, conversation and accountability when your child needs it most."],
  ["02", "Learning continues after class", "Guided academy lessons and practice extend learning beyond the live session."],
  ["03", "Parents stay informed", "See what was learned, what comes next and where support is needed."],
];

export default function WhyParentsChoose() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.parentFeature}>
          <div className={styles.parentPhoto} />
          <div className={styles.parentCopy}>
            <p className={styles.eyebrow}>Why parents choose FountainPrep</p>
            <h2>More than another app. A learning partner.</h2>
            <p className={styles.parentLead}>
              Children learn best when technology, great teaching and clear progression work together.
              FountainPrep is designed around that combination.
            </p>

            <div className={styles.reasonList}>
              {reasons.map(([number, title, text]) => (
                <article key={number}>
                  <span>{number}</span>
                  <div><strong>{title}</strong><p>{text}</p></div>
                </article>
              ))}
            </div>

            <Link href="/start" className={styles.textLink}>Find the right tutor →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
