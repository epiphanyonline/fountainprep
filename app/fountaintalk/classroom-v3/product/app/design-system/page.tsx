import { AyoMessage, Button, Card, EpisodeRow, JourneyTile, Progress } from "../../design-system";

const swatches = [
  ["Canvas", "#F7F3EB"], ["Paper", "#FFFDF8"], ["Ink", "#211F1B"], ["Forest", "#365244"],
  ["Olive", "#71805B"], ["Gold", "#C59A45"], ["Sky", "#AFC6D4"], ["Night", "#101722"],
];

export default function DesignSystemPage() {
  return (
    <main className="ds-page">
      <section className="ds-hero">
        <span className="fp-kicker">FountainPrep</span>
        <h1>Design System 1.0</h1>
        <p>A calm, warm and cinematic visual language for every learner-facing experience.</p>
        <div className="ds-actions"><Button>Begin journey</Button><Button variant="secondary">Explore academy</Button><Button variant="quiet">Quiet action</Button></div>
      </section>

      <section className="ds-section">
        <header><span className="fp-kicker">Foundations</span><h2>Colour</h2><p>Earth, paper, olive trees, evening skies and warm light.</p></header>
        <div className="ds-swatches">{swatches.map(([name, value]) => <div className="ds-swatch" key={name}><span style={{ background: value }} /><strong>{name}</strong><code>{value}</code></div>)}</div>
      </section>

      <section className="ds-section">
        <header><span className="fp-kicker">Typography</span><h2>Hierarchy through type</h2></header>
        <div className="ds-type"><p className="ds-display">Before there was a king, there was a shepherd.</p><h2>Learning that stays with you.</h2><p>Body copy is quiet, readable and generous. It guides without crowding the learner.</p><span className="fp-kicker">Small labels remain precise</span></div>
      </section>

      <section className="ds-section">
        <header><span className="fp-kicker">Components</span><h2>Built for journeys</h2></header>
        <div className="ds-grid ds-grid--2">
          <JourneyTile title="David" subtitle="From shepherd to king." progress={42}><Button>Continue</Button></JourneyTile>
          <Card><span className="fp-kicker">Reflection</span><h3>What stayed with you today?</h3><textarea aria-label="Reflection example" placeholder="Write a few words..." rows={5} /><Button>Save reflection</Button></Card>
        </div>
        <div className="ds-stack">
          <EpisodeRow number={1} title="The Shepherd" subtitle="Faithfulness before recognition." state="complete" />
          <EpisodeRow number={2} title="The Calling" subtitle="Chosen where no one was looking." />
          <EpisodeRow number={3} title="The Valley" subtitle="Courage in the face of fear." state="locked" />
        </div>
      </section>

      <section className="ds-section ds-section--night">
        <header><span className="fp-kicker">Classroom mode</span><h2>Cinematic, never noisy</h2></header>
        <div className="ds-scene"><div><span className="fp-kicker">The Shepherd · Scene 1</span><h2>The hills were quiet that morning.</h2><p>David watched the flock while the world carried on without noticing him.</p><AyoMessage>What do you notice?</AyoMessage></div></div>
      </section>

      <section className="ds-section">
        <header><span className="fp-kicker">System states</span><h2>Progress and feedback</h2></header>
        <div className="ds-grid ds-grid--3"><Card><h3>Journey progress</h3><Progress value={68} label="4 of 6 episodes" /></Card><Card><h3>Focus</h3><p>One primary action per screen.</p></Card><Card><h3>Accessibility</h3><p>Clear focus, reduced motion and readable contrast are defaults.</p></Card></div>
      </section>
    </main>
  );
}
