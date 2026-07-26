import Link from "next/link";

export default function FountainPrepLandingPage() {
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        padding: "4rem 0",
      }}
    >
      <div className="fp-container">

        <p className="fp-eyebrow">
          Welcome
        </p>

        <h1 className="fp-title">
          I'm Ayo.
          <br />
          I'll be your tutor.
        </h1>

        <p className="fp-subtitle">
          Learning here isn't a collection of lessons.
          It's a journey through stories, ideas and conversations
          designed to help you grow.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/fountainprep/home"
            className="fp-button fp-button-primary"
          >
            Begin
          </Link>

          <Link
            href="/fountainprep/design-system"
            className="fp-button fp-button-secondary"
          >
            Design System
          </Link>
        </div>

      </div>
    </section>
  );
}