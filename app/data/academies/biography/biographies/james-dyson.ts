import {
  createActivity,
  createLesson,
} from "@/features/academy-content";

const deliveryModes = [
  "ai-classroom",
  "self-study",
  "revision",
  "assessment",
] as const;

export const jamesDysonLesson =
  createLesson({
    id:
      "greatness-foundation-dyson",

    academy:
      "biography",

    programmeId:
      "greatness-foundation",

    courseId:
      "greatness-foundation-course",

    unitId:
      "greatness-foundation-unit-2",

    stage:
      "foundation",

    lessonNumber:
      11,

    title:
      "James Dyson: Invention, Intellectual Property and Private Ownership",

    description:
      "Explore James Dyson's journey through engineering, thousands of prototypes, product innovation, intellectual property, manufacturing and private business ownership.",

    objective:
      "The learner will understand how intellectual property, experimentation, product development and retained private ownership can create financial value.",

    learningOutcomes: [
      "Trace major stages in Dyson's product-development journey.",
      "Explain intellectual property as an economic asset.",
      "Understand experimentation as a capital-allocation process.",
      "Recognise the financial difference between licensing and owning a business.",
      "Understand the risk of repeated product development.",
      "Explain the advantages and limitations of private-company ownership.",
    ],

    estimatedMinutes:
      34,

    completionPoints:
      55,

    deliveryModes: [
      ...deliveryModes,
    ],

    suitableAgeGroups: [
      "10-13",
      "14-17",
      "adult",
    ],

    activities: [
      createActivity({
        id:
          "bio-dyson-a1",

        type:
          "introduction",

        title:
          "Before the Famous Vacuum",

        teacherPrompt:
          "James Dyson became known for bagless vacuum cleaners and engineering-led products, but the more useful story is what happened before the successful product existed.",

        narrationText:
          "This biography introduces intellectual capital. The valuable asset begins as knowledge, engineering and an idea rather than a mine, retail chain or listed shareholding.",

        visualTitle:
          "James Dyson",

        visualDescription:
          "United Kingdom • engineering • prototypes • patents • manufacturing • private ownership",

        story:
          "AYO opens with a workshop table covered in failed prototypes. The successful product is hidden from view.",
      }),

      createActivity({
        id:
          "bio-dyson-a2",

        type:
          "teach",

        title:
          "Seeing a Problem Differently",

        teacherPrompt:
          "Dyson became interested in cyclone technology as a way of separating dust without relying on conventional vacuum bags.",

        narrationText:
          "Innovation often begins by questioning an accepted constraint. But noticing a problem is not enough. The idea has to become a product that actually works.",

        visualTitle:
          "Problem → Hypothesis",

        visualDescription:
          "Observed weakness • engineering idea • test",

        story:
          "A conventional vacuum loses suction. AYO pauses the machine and asks what assumption could be redesigned.",
      }),

      createActivity({
        id:
          "bio-dyson-a3",

        type:
          "teach",

        title:
          "Thousands of Prototypes",

        teacherPrompt:
          "Dyson has repeatedly described building more than 5,000 prototypes while developing his early bagless vacuum technology.",

        narrationText:
          "That number sounds inspirational, but financially it represents something more concrete: time, materials, labour and repeated capital commitment without certainty of success.",

        visualTitle:
          "Experimentation Has a Cost",

        visualDescription:
          "Prototype → test → fail → learn → redesign",

        story:
          "Prototype numbers rise rapidly while a cumulative cost meter rises beside them.",
      }),

      createActivity({
        id:
          "bio-dyson-a4",

        type:
          "multiple-choice",

        title:
          "Is Failure Automatically Valuable?",

        teacherPrompt:
          "Does repeated failure automatically create value?",

        options: [
          {
            id: "a",
            label:
              "Yes. Every failure guarantees eventual success.",
            value:
              "guaranteed-success",
          },
          {
            id: "b",
            label:
              "No. Failure becomes useful only if it produces information that improves future decisions.",
            value:
              "learning",
          },
          {
            id: "c",
            label:
              "Yes. The more money lost, the better the invention.",
            value:
              "loss-is-good",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. Failure can generate learning, but repeated failure without useful information can simply destroy capital.",

        retryReply:
          "Think about whether each failed prototype changes the next design.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-dyson-a5",

        type:
          "teach",

        title:
          "Persistence or Sunk Cost?",

        teacherPrompt:
          "One of the hardest decisions in innovation is knowing whether to continue developing a difficult idea or stop funding it.",

        narrationText:
          "Persistence is valuable when new evidence improves the probability of success. It becomes dangerous when someone continues only because they have already spent money.",

        visualTitle:
          "Sunk Cost",

        visualDescription:
          "Money already spent should not decide the next investment by itself.",

        story:
          "AYO places past spending behind a wall labelled SUNK COST while future evidence remains on the decision table.",
      }),

      createActivity({
        id:
          "bio-dyson-a6",

        type:
          "case-study",

        title:
          "Prototype 5,001?",

        teacherPrompt:
          "Imagine a product has failed after thousands of prototypes, but each recent version has shown measurable technical improvement.",

        learnerInstruction:
          "What evidence would justify continuing, and what evidence would suggest stopping?",

        story:
          "Continue if technical progress, market need and economics remain credible. Stop if key assumptions are repeatedly disproved, costs become unsustainable or the product cannot create enough customer value.",

        visualTitle:
          "Continue, Pivot or Stop",

        visualDescription:
          "Evidence • technical progress • market demand • cost",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-dyson-a7",

        type:
          "teach",

        title:
          "Intellectual Property",

        teacherPrompt:
          "Patents and other intellectual-property rights can protect particular inventions or designs for defined periods and under specific legal conditions.",

        narrationText:
          "Intellectual property is an intangible asset. You cannot touch a patent like a building, but legal rights around an invention can have substantial economic value.",

        visualTitle:
          "Intangible Capital",

        visualDescription:
          "Knowledge • design • patent • legal rights • commercial use",

        story:
          "An engineering drawing becomes a patent document and then a commercial product.",
      }),

      createActivity({
        id:
          "bio-dyson-a8",

        type:
          "teach",

        title:
          "License the Idea or Own the Business?",

        teacherPrompt:
          "An inventor can license technology to another company or build a business that manufactures and sells the product directly.",

        narrationText:
          "Licensing may require less operating infrastructure and can generate royalty income. Building the business can capture more of the value chain but requires more capital and execution.",

        visualTitle:
          "Two Commercialisation Paths",

        visualDescription:
          "License → royalty OR manufacture → distribute → sell",

        story:
          "The invention reaches a fork. One path becomes a licence agreement. The other grows factories, distribution and a brand.",
      }),

      createActivity({
        id:
          "bio-dyson-a9",

        type:
          "multiple-choice",

        title:
          "Which Route Requires More Operating Capital?",

        teacherPrompt:
          "Which route generally requires more direct operating infrastructure?",

        options: [
          {
            id: "a",
            label:
              "Building and operating the manufacturing and distribution business yourself.",
            value:
              "own-business",
          },
          {
            id: "b",
            label:
              "Licensing intellectual property to another operator.",
            value:
              "license",
          },
          {
            id: "c",
            label:
              "Neither route ever requires capital.",
            value:
              "no-capital",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Owning the operating business usually requires more capital, but it can also capture more of the economic value.",

        retryReply:
          "Think about factories, employees, inventory, marketing and distribution.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-dyson-a10",

        type:
          "teach",

        title:
          "Private Ownership",

        teacherPrompt:
          "Dyson developed as a privately held company rather than becoming a widely traded public corporation.",

        narrationText:
          "Private ownership can allow founders to make long-duration decisions without a constantly quoted public share price. But it can also make external valuation and liquidity less transparent.",

        visualTitle:
          "Private Company Equity",

        visualDescription:
          "Control • long-term decisions • limited liquidity • less public pricing",

        story:
          "A public stock ticker disappears while the private company remains behind closed ownership doors.",
      }),

      createActivity({
        id:
          "bio-dyson-a11",

        type:
          "teach",

        title:
          "The Product Portfolio Expands",

        teacherPrompt:
          "Dyson expanded beyond vacuum cleaners into products including air treatment, hair care and other engineering categories.",

        narrationText:
          "A successful technology can become the foundation for broader capabilities, but expansion introduces the risk of moving beyond the company's strongest expertise.",

        visualTitle:
          "Capability Expansion",

        visualDescription:
          "Engineering platform → new categories → new customers",

        story:
          "One product becomes several categories connected by a common engineering core.",
      }),

      createActivity({
        id:
          "bio-dyson-a12",

        type:
          "case-study",

        title:
          "How Far Should a Brand Expand?",

        teacherPrompt:
          "A company famous for one category identifies opportunities in several new markets.",

        learnerInstruction:
          "What evidence should management consider before committing capital to a new category?",

        story:
          "Relevant questions include technical advantage, customer need, brand credibility, competition, manufacturing capability, expected margins and whether the expansion distracts from the core business.",

        visualTitle:
          "Adjacency or Distraction?",

        visualDescription:
          "Capability fit • customer need • economics • brand stretch",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-dyson-a13",

        type:
          "teach",

        title:
          "The Electric-Car Project",

        teacherPrompt:
          "Dyson invested heavily in developing an electric vehicle but later cancelled the project after concluding it was not commercially viable.",

        narrationText:
          "This is one of the most valuable financial lessons in the biography. Large amounts of money can be spent rationally on a project and the correct decision can still be to stop.",

        visualTitle:
          "Capital Discipline Can Mean Stopping",

        visualDescription:
          "Investment • learning • revised economics • cancellation",

        story:
          "A car prototype approaches production, but the financial model turns red. AYO closes the project rather than allowing sunk cost to dictate the future.",
      }),

      createActivity({
        id:
          "bio-dyson-a14",

        type:
          "teach",

        title:
          "Private Company Value Is Still an Estimate",

        teacherPrompt:
          "Because Dyson is privately held, external estimates of James Dyson's wealth depend partly on assumptions about the value of private business interests and other assets.",

        narrationText:
          "There is no continuously quoted public market price for the whole private company. That means personal net-worth estimates should remain labelled as estimates.",

        visualTitle:
          "Private Value ≠ Exact Cash",

        visualDescription:
          "Private-company estimate • other assets • liquidity • undisclosed holdings",

        story:
          "AYO stamps ESTIMATE over a private-company valuation and keeps personal cash undisclosed.",
      }),

      createActivity({
        id:
          "bio-dyson-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which idea from Dyson's journey changed your understanding most: experimentation, sunk cost, intellectual property, private ownership, commercialisation or capital discipline?",

        narrationText:
          "Dyson's story shows that intellectual capital can become financial capital when ideas are protected, commercialised and owned. But innovation also requires the discipline to stop when the economics no longer justify further investment.",

        visualTitle:
          "Ideas Become Capital Through Execution",

        visualDescription:
          "Problem → invention → IP → product → ownership → value",

        points:
          10,
      }),
    ],
  });