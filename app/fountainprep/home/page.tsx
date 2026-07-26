import JourneyCard from "../components/learning/JourneyCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Page from "../components/ui/Page";
import {
  getAcademy,
  getFeaturedJourneys,
} from "../content/registry";

export default function FountainPrepHomePage() {
  const featuredJourneys = getFeaturedJourneys();

  return (
    <Page
      eyebrow="Learner Home"
      title="Good to see you."
      description="Continue your journey, explore what is next, and return to the ideas that stayed with you."
      actions={
        <Button href="/fountainprep/academy/bible" variant="secondary">
          Explore academies
        </Button>
      }
      width="wide"
    >
      <div className="fp-home-layout">
        <section className="fp-home-main">
          <div className="fp-section-heading">
            <div>
              <p className="fp-eyebrow">Continue learning</p>
              <h2 className="fp-section-title">
                Pick up where you left off.
              </h2>
            </div>
          </div>

          {featuredJourneys.length > 0 ? (
            <div className="fp-stack">
              {featuredJourneys.map((journey, index) => {
                const academy = getAcademyById(journey.academyId);

                return (
                  <JourneyCard
                    key={journey.id}
                    journey={journey}
                    academyTitle={academy?.title ?? "FountainPrep"}
                    progress={index === 0 ? 42 : 0}
                    status={index === 0 ? "in-progress" : "new"}
                  />
                );
              })}
            </div>
          ) : (
            <Card
              title="No journeys available"
              description="Featured journeys will appear here."
              padding="lg"
            >
              <p className="fp-muted">
                Add a featured journey to the content registry to display it
                on the learner home page.
              </p>
            </Card>
          )}

          <section className="fp-home-section">
            <div className="fp-section-heading">
              <div>
                <p className="fp-eyebrow">Recommended next</p>
                <h2 className="fp-section-title">
                  Journeys chosen for your growth.
                </h2>
              </div>
            </div>

            <Card
              title="More journeys are coming"
              description="Recommendations will be generated from the learner’s goals, progress, and reflection history."
              padding="lg"
            >
              <p className="fp-muted">
                Once Joseph, Esther, and the other journeys are registered,
                they will appear here automatically.
              </p>
            </Card>
          </section>
        </section>

        <aside className="fp-home-sidebar">
          <Card title="Ayo" description="Your tutor" padding="lg">
            <p className="fp-home-message">
              Welcome back. Your next learning moment is waiting for you.
            </p>

            {featuredJourneys[0] ? (
              <div style={{ marginTop: "1.5rem" }}>
                <Button
                  href={`/fountainprep/journey/${featuredJourneys[0].slug}`}
                >
                  Continue
                </Button>
              </div>
            ) : null}
          </Card>

          <Card
            title="Today’s reflection"
            description="A moment to pause"
            padding="lg"
          >
            <p className="fp-home-message">
              What does courage look like when nobody is watching?
            </p>

            <div style={{ marginTop: "1.5rem" }}>
              <Button
                href="/fountainprep/reflection"
                variant="secondary"
              >
                Reflect
              </Button>
            </div>
          </Card>

          <Card
            title="Your growth"
            description="Across your current journeys"
            padding="lg"
          >
            <div className="fp-growth-list">
              <GrowthItem label="Wisdom" value={68} />
              <GrowthItem label="Leadership" value={46} />
              <GrowthItem label="Faith" value={74} />
            </div>
          </Card>
        </aside>
      </div>
    </Page>
  );
}

function getAcademyById(academyId: string) {
  const academySlug = academyId.replace("academy-", "");
  return getAcademy(academySlug);
}

type GrowthItemProps = {
  label: string;
  value: number;
};

function GrowthItem({ label, value }: GrowthItemProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="fp-growth-item">
      <div className="fp-growth-label">
        <span>{label}</span>
        <span className="fp-muted">{safeValue}%</span>
      </div>

      <div
        className="fp-progress"
        aria-label={`${label}: ${safeValue}%`}
      >
        <div
          className="fp-progress-bar"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}