import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Ayotunde Samuel Fasanmi | Business Builder & Systems Thinker",
  description:
    "Ayotunde Samuel Fasanmi builds businesses and practical systems across education, finance, technology and mobility.",
};

const ventures = [
  {
    number: "01",
    name: "Fountain Prep",
    category: "EDUCATION · AI · TECHNOLOGY",
    title: "Building a better learning system for families.",
    description:
      "Fountain Prep combines live 1-to-1 tutoring, structured learning and technology to help families access high-quality education wherever they live.",
    href: "/",
    link: "Explore Fountain Prep",
  },
  {
    number: "02",
    name: "Epiphany Centre for Empowerment",
    category: "FINANCE · OPERATIONS · FINANCIAL INCLUSION",
    title: "Helping productive people stay productive.",
    description:
      "Built around a simple idea: hardworking people should not lose their livelihood because access to productive assets and finance is difficult. The operation has supported thousands of people in Nigeria's informal transport economy.",
    href: "#my-story",
    link: "Part of my journey",
  },
  {
    number: "03",
    name: "Fountain Ride",
    category: "MOBILITY · MARKETPLACE · TECHNOLOGY",
    title: "Rethinking access to drivers and transportation.",
    description:
      "A technology platform being developed around pre-booked transportation, driver services and vehicle access while creating stronger economic opportunities for drivers.",
    href: "#my-story",
    link: "Currently building",
  },
];

const principles = [
  {
    number: "01",
    title: "Build systems, not dependencies.",
    text: "A business becomes stronger when routine decisions, knowledge and processes no longer depend on one person.",
  },
  {
    number: "02",
    title: "Technology should solve a real problem.",
    text: "I am less interested in technology for its own sake and more interested in what it can simplify, automate or make possible.",
  },
  {
    number: "03",
    title: "Turn knowledge into process.",
    text: "If an important process only exists in someone's head, the organisation has not finished building it.",
  },
  {
    number: "04",
    title: "Learn enough to stop being helpless.",
    text: "You do not have to become an expert in everything, but understanding how things work changes what you are able to build.",
  },
];

const questions = [
  "How should this process actually work?",
  "What should happen automatically?",
  "What decisions should the team make without the founder?",
  "Where can AI or technology remove repetitive work?",
  "What should management be able to see at a glance?",
  "How do we turn an informal process into a repeatable operating system?",
];

export default function AyotundeFasanmiPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      {/* HERO */}
      <section className="relative border-b border-slate-200">
        <div className="absolute right-[-10%] top-[-20%] h-[650px] w-[650px] rounded-full bg-purple-100/70 blur-3xl" />

        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.12fr_.88fr] lg:px-8 lg:py-24">
          {/* Hero copy */}
          <div>
            <Link
              href="/"
              className="mb-14 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-purple-700"
            >
              <span aria-hidden="true">←</span>
              Fountain Prep
            </Link>

            <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-purple-700 sm:text-sm">
              Ayotunde Samuel Fasanmi
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-[4.4rem]">
              I build businesses.
              <span className="block text-purple-700">
                Then I build systems
              </span>
              <span className="block">that help them scale.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              I work at the intersection of business, finance and technology —
              turning ideas and operational problems into practical systems
              that reduce founder dependency and create room for growth.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-full bg-purple-700 px-7 py-3.5 text-sm font-bold !text-white shadow-sm transition hover:bg-purple-800"
              >
                Explore my work →
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition hover:border-purple-400 hover:text-purple-700"
              >
                Let&apos;s connect
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-7 text-sm text-slate-500">
              <span>Business</span>
              <span>Finance</span>
              <span>Technology</span>
              <span>Systemization</span>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative min-h-[570px] overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-50 via-purple-50 to-purple-100 sm:min-h-[640px]">
              <div className="absolute left-7 top-7 z-10 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-purple-700 shadow-sm backdrop-blur">
                Business · Finance · Technology
              </div>

              <Image
                src="/images/ayotunde/ayotunde-fasanmi.png"
                alt="Ayotunde Samuel Fasanmi"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-contain object-bottom pt-16"
              />
              
            </div>

            <div className="absolute -bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-6 py-3 shadow-lg">
  <p className="text-xs font-semibold text-slate-700">
    United Kingdom · Building globally
  </p>
</div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
              What connects my work
            </p>
          </div>

          <div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Building is one thing.
              <br />
              Building a system is another.
            </h2>

            <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-slate-600">
              <p>
                My work has taken me across finance, entrepreneurship,
                education and technology. At first glance, they may look like
                different worlds.
              </p>

              <p>
                But the same question keeps showing up:{" "}
                <strong className="font-semibold text-slate-950">
                  how do you turn something that works because of one person
                  into a system that can work consistently for thousands?
                </strong>
              </p>

              <p>
                That question has shaped the businesses I have built and the
                kind of problems I now enjoy solving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section
        id="work"
        className="scroll-mt-24 bg-slate-950 py-24 text-white lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-300">
              Selected work
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Different industries.
              <br />
              The same obsession with systems.
            </h2>
          </div>

          <div className="divide-y divide-slate-800 border-y border-slate-800">
            {ventures.map((venture) => (
              <article
                key={venture.name}
                className="grid gap-7 py-12 lg:grid-cols-[.15fr_.7fr_1.2fr_.4fr] lg:gap-10"
              >
                <p className="text-sm font-semibold text-slate-500">
                  {venture.number}
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {venture.name}
                  </h3>
                  <p className="mt-3 text-xs font-bold leading-6 tracking-[0.12em] text-purple-300">
                    {venture.category}
                  </p>
                </div>

                <div>
                  <h4 className="text-2xl font-semibold tracking-tight text-white">
                    {venture.title}
                  </h4>

                  <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                    {venture.description}
                  </p>
                </div>

                <div className="lg:text-right">
                  <Link
                    href={venture.href}
                    className="text-sm font-semibold text-white underline decoration-purple-500 decoration-2 underline-offset-8 transition hover:text-purple-300"
                  >
                    {venture.link} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section
        id="my-story"
        className="scroll-mt-24 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
      >
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
              My journey
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              I didn&apos;t start as a technologist.
            </h2>

            <p className="mt-7 max-w-md text-lg leading-8 text-slate-500">
              I started with economics, finance and a desire to understand how
              businesses and productive assets create value.
            </p>
          </div>

          <div className="space-y-6 text-lg leading-8 text-slate-600">
            <p>
              My background is in economics, finance and investment. I started
              by solving business and financial problems, not writing code.
            </p>

            <p>
              Building businesses repeatedly exposed me to the same
              frustration: good ideas could quickly become limited by manual
              processes, fragmented tools and too much dependence on the
              founder.
            </p>

            <p>
              So I started learning how the technology itself worked — enough
              to design, build and improve the systems behind the ideas.
            </p>

            <blockquote className="my-10 border-l-4 border-purple-600 pl-7 text-2xl font-semibold leading-9 tracking-tight text-slate-950 sm:text-3xl sm:leading-10">
              “I learned technology because I got tired of having good ideas
              that depended on someone else to build them.”
            </blockquote>

            <p>
              Today, I am increasingly interested in that intersection:
              understanding the business deeply enough to know what should
              happen, and understanding technology well enough to help build
              the system that makes it happen.
            </p>
          </div>
        </div>
      </section>

      {/* SYSTEMIZATION */}
      <section className="bg-purple-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
              Systemization
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              I&apos;m interested in businesses where too much still lives in
              the founder&apos;s head.
            </h2>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">
              My goal is not simply to add more software. It is to understand
              the operation first, then determine what should be simplified,
              documented, delegated or automated.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-purple-100 bg-purple-100 shadow-sm md:grid-cols-2">
            {principles.map((principle) => (
              <article key={principle.number} className="bg-white p-8 sm:p-10">
                <p className="text-sm font-bold text-purple-600">
                  {principle.number}
                </p>

                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950">
                  {principle.title}
                </h3>

                <p className="mt-4 max-w-xl leading-7 text-slate-600">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
              Problems I like solving
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              What should the system do?
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
              Before choosing software, automation or AI, I like to understand
              the questions the business actually needs answered.
            </p>
          </div>

          <div>
            {questions.map((question, index) => (
              <div
                key={question}
                className="group grid grid-cols-[40px_1fr] gap-4 border-b border-slate-200 py-6"
              >
                <span className="pt-1 text-xs font-bold text-purple-600">
                  0{index + 1}
                </span>

                <p className="text-xl font-medium leading-8 text-slate-800 transition group-hover:text-purple-700">
                  {question}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINANCIAL EDUCATION */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
              Financial education
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              I also write and teach about money.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              My background in finance continues to shape how I think about
              ownership, productive assets, investing and wealth creation. I
              use Fountain Prep&apos;s Financial Education Academy to make
              those ideas easier to understand.
            </p>

            <Link
              href="/financial-education"
              className="mt-8 inline-flex font-bold text-purple-700 underline decoration-purple-300 decoration-2 underline-offset-8 transition hover:text-purple-900"
            >
              Explore Financial Education →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="scroll-mt-24 bg-white py-24 lg:py-32"
      >
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
            Let&apos;s talk
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-6xl">
            Building something that needs a better system?
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            If your organisation is growing but still depends too heavily on
            you, I&apos;d be interested in hearing what you&apos;re building.
          </p>

          <a
            href="mailto:ayotunde.fasanmi@fountainprep.com"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-purple-700 px-8 py-4 text-sm font-bold !text-white shadow-sm transition hover:bg-purple-800"
          >
            Start a conversation →
          </a>

          <a
            href="mailto:ayotunde.fasanmi@fountainprep.com"
            className="mx-auto mt-5 block w-fit text-sm font-medium text-slate-500 transition hover:text-purple-700"
          >
            ayotunde.fasanmi@fountainprep.com
          </a>

          <div className="mt-16 border-t border-slate-200 pt-9">
            <p className="font-semibold text-slate-950">
              Ayotunde Samuel Fasanmi
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Business · Finance · Technology · Systemization
            </p>

            <Link
              href="/"
              className="mt-6 inline-block text-sm font-semibold text-purple-700"
            >
              Fountain Prep →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}