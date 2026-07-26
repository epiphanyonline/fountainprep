import JourneyCard from "../components/learning/JourneyCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Page from "../components/ui/Page";
import { bibleAcademy } from "../content/academies/bible";
import { davidJourney } from "../content/journeys/david";

export default function FountainPrepDesignSystemPage() {
  return (
    <Page
      eyebrow="Foundation"
      title="FountainPrep Design System"
      description="Every component is built and approved here before it becomes part of the learner experience."
    >
      <section className="fp-stack">
        <Card
          title="Buttons"
          description="Primary and secondary learner actions."
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Button>Primary Action</Button>

            <Button variant="secondary">
              Secondary Action
            </Button>
          </div>
        </Card>

        <Card
          title="Typography"
          description="Calm, spacious, and readable."
        >
          <p className="fp-muted">
            Learning should feel focused rather than overwhelming.
          </p>
        </Card>

        <section>
          <p className="fp-eyebrow">FountainPrep Components</p>

          <h2
            style={{
              marginTop: 0,
              marginBottom: "2rem",
            }}
          >
            Journey Card
          </h2>

          <JourneyCard
            journey={davidJourney}
            academyTitle={bibleAcademy.title}
            progress={42}
            status="in-progress"
          />
        </section>
      </section>
    </Page>
  );
}