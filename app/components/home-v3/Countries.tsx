import styles from "../../styles/home-v3.module.css";

const countries = ["United Kingdom", "United States", "Canada", "Australia", "Nigeria and more"];

export default function Countries() {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.globalPanel}>
          <div>
            <p className={styles.eyebrow}>Built for global families</p>
            <h2>Learning that travels with your family.</h2>
            <p>
              Whether your priority is academic confidence, heritage language or future-ready skills,
              FountainPrep brings a consistent learning experience across borders.
            </p>
          </div>

          <div className={styles.countryGrid}>
            {countries.map((country) => (
              <div key={country}><span /><strong>{country}</strong></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
