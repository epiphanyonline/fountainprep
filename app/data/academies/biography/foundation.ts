import {
  createActivity,
  createCourse,
  createLesson,
  createUnit,
} from "@/features/academy-content";

import {
  warrenBuffettLesson,
} from "./biographies/warren-buffett";

import {
  jeffBezosLesson,
} from "./biographies/jeff-bezos";

import {
  bernardArnaultLesson,
} from "./biographies/bernard-arnault";

import {
  mukeshAmbaniLesson,
} from "./biographies/mukesh-ambani";

import {
  amancioOrtegaLesson,
} from "./biographies/amancio-ortega";

import {
  jensenHuangLesson,
} from "./biographies/jensen-huang";

import {
  carlosSlimLesson,
} from "./biographies/carlos-slim";

import {
  zhangYimingLesson,
} from "./biographies/zhang-yiming";

import {
  patriceMotsepeLesson,
} from "./biographies/patrice-motsepe";

import {
  jamesDysonLesson,
} from "./biographies/james-dyson";

const deliveryModes = [
  "ai-classroom",
  "self-study",
  "revision",
  "assessment",
] as const;

export const dangoteLesson = createLesson({
  id: "greatness-foundation-dangote",

  academy: "biography",

  programmeId:
    "greatness-foundation",

  courseId:
    "greatness-foundation-course",

  unitId:
    "greatness-foundation-unit-1",

  stage: "foundation",

  lessonNumber: 1,

  title:
    "Aliko Dangote: From Trading to Industrial Ownership",

  description:
    "Explore the documented journey from commodity trading to large-scale industrial ownership, and examine the role of ownership, reinvestment, scale and capital allocation.",

  objective:
    "The learner will identify major stages in Aliko Dangote's business journey and distinguish trading income from long-term ownership of productive businesses and assets.",

  learningOutcomes: [
    "Place major stages of Dangote's business journey in sequence.",

    "Explain the difference between trading goods and owning productive capacity.",

    "Recognise why ownership can matter differently from income alone.",

    "Identify examples of concentration, scale and reinvestment in a business journey.",

    "Distinguish publicly documented ownership information from estimates of personal wealth.",

    "Reflect on the risks involved in committing capital to very large industrial projects.",
  ],

  estimatedMinutes: 28,

  completionPoints: 50,

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
      id: "bio-dangote-a1",

      type: "introduction",

      title:
        "Before the Headlines",

      teacherPrompt:
        "Today we are studying Aliko Dangote, not to copy his life or promise a particular financial outcome, but to understand how a documented business journey moved from trading into ownership and industrial scale.",

      narrationText:
        "Before the cement plants, fertilizer operations and refinery, there was trading. The important question for us is not simply how much wealth was eventually created. It is how the economic engine changed over time.",

      visualTitle:
        "Aliko Dangote",

      visualDescription:
        "Nigeria. Trading. Manufacturing. Ownership. Scale.",

      story:
        "AYO opens on a map of Africa. Nigeria comes into focus. A timeline appears: 1978 → trading → manufacturing → cement → fertilizer → refinery.",
    }),

    createActivity({
      id: "bio-dangote-a2",

      type: "teach",

      title:
        "The Starting Environment",

      teacherPrompt:
        "Public biographies describe Dangote as coming from a prominent commercial family in Kano. Forbes also notes that his grandfather was a successful trader. This gave him exposure to commerce, but family background alone does not explain the later scale of the businesses he built.",

      narrationText:
        "A useful financial lesson begins here. People do not all start from the same position. Access to relationships, knowledge, capital and commercial experience can influence opportunity. Financial education should recognise the starting environment instead of pretending every journey begins equally.",

      visualTitle:
        "Starting Point",

      visualDescription:
        "Commercial family background • Kano • early exposure to trade",

      story:
        "A two-column scene appears: 'Starting advantages' on one side and 'Decisions that followed' on the other. AYO explains that biography should separate inherited context from later business execution.",
    }),

    createActivity({
      id: "bio-dangote-a3",

      type: "teach",

      title:
        "The First Business Engine: Trading",

      teacherPrompt:
        "Dangote Group states that Aliko Dangote began his business career in 1978 trading rice, sugar and cement before moving into full-scale manufacturing.",

      narrationText:
        "Trading creates value by moving goods from where they are available to where buyers want them. The trader earns from the difference between acquisition cost, operating cost and selling price.",

      visualTitle:
        "Business Engine 01 — Trading",

      visualDescription:
        "Buy → transport → distribute → sell → retain margin",

      story:
        "Animated sacks of rice, sugar and cement move through a simple supply chain. Revenue enters on one side, costs leave on the other, and the remaining margin is highlighted.",
    }),

    createActivity({
      id: "bio-dangote-a4",

      type: "multiple-choice",

      title:
        "Trading or Ownership?",

      teacherPrompt:
        "Which statement best describes a commodity trading business?",

      options: [
        {
          id: "a",
          label:
            "The trader necessarily owns the factory that manufactures the product.",
          value:
            "factory-owner",
        },
        {
          id: "b",
          label:
            "The trader buys and sells goods, earning from distribution and price differences.",
          value:
            "trading-margin",
        },
        {
          id: "c",
          label:
            "The trader receives guaranteed investment returns.",
          value:
            "guaranteed-return",
        },
      ],

      correctOptionId: "b",

      successReply:
        "Correct. Trading and manufacturing can both produce income, but they are different economic activities.",

      retryReply:
        "Think about whether the business is making the product or buying and reselling it.",

      points: 6,
    }),

    createActivity({
      id: "bio-dangote-a5",

      type: "teach",

      title:
        "The Strategic Shift",

      teacherPrompt:
        "The major change in the story was the move from trading imported goods toward domestic manufacturing and industrial ownership.",

      narrationText:
        "This changes the economic engine. Instead of earning mainly from moving somebody else's product, a manufacturer can own the productive capacity that creates the product.",

      visualTitle:
        "Trading → Manufacturing",

      visualDescription:
        "Margin from distribution becomes ownership of productive capacity.",

      story:
        "The trading supply-chain graphic folds away. A factory rises into view. AYO places two labels on screen: 'Income from transactions' and 'Ownership of production'.",
    }),

    createActivity({
      id: "bio-dangote-a6",

      type: "case-study",

      title:
        "Why Move Into Manufacturing?",

      teacherPrompt:
        "Imagine that a country imports large quantities of a product every year, while local demand continues to grow. A businessperson can keep importing the product, or attempt to produce it locally.",

      learnerInstruction:
        "What might be one potential advantage and one major risk of moving from importing to manufacturing?",

      story:
        "Manufacturing can create greater control over production and potentially capture more of the value chain. But it can also require factories, machinery, infrastructure, skilled workers, financing and years of capital commitment.",

      visualTitle:
        "A Capital Decision",

      visualDescription:
        "Lower commitment: trading. Higher commitment: industrial production.",

      points: 8,
    }),

    createActivity({
      id: "bio-dangote-a7",

      type: "teach",

      title:
        "Cement and Concentrated Ownership",

      teacherPrompt:
        "Dangote Cement became one of the central listed businesses associated with his fortune. Its 2025 financial statements report Dangote Industries Limited owning 86.65% of Dangote Cement, with Aliko Dangote identified as the ultimate owner of Dangote Industries Limited.",

      narrationText:
        "This gives us an important financial-literacy distinction. A very large fortune can be concentrated in ownership of a business rather than sitting in a bank account.",

      visualTitle:
        "Ownership Map",

      visualDescription:
        "Aliko Dangote → Dangote Industries Limited → major ownership interest in Dangote Cement",

      story:
        "A clean ownership tree animates downward. AYO highlights the difference between 'company value', 'share ownership' and 'cash personally available'.",
    }),

    createActivity({
      id: "bio-dangote-a8",

      type: "multiple-choice",

      title:
        "What Does a Large Net Worth Mean?",

      teacherPrompt:
        "If much of someone's estimated net worth comes from ownership of a company, what does that usually mean?",

      options: [
        {
          id: "a",
          label:
            "The full estimated net worth is sitting as cash in a bank account.",
          value:
            "all-cash",
        },
        {
          id: "b",
          label:
            "A substantial part of the estimated wealth may reflect the value of owned business interests.",
          value:
            "business-equity",
        },
        {
          id: "c",
          label:
            "The value can never change.",
          value:
            "fixed-value",
        },
      ],

      correctOptionId: "b",

      successReply:
        "Exactly. Net worth and cash are not the same thing. Business equity can represent enormous value without being immediately spendable cash.",

      retryReply:
        "Think about the difference between owning a valuable company and holding the same amount in cash.",

      points: 7,
    }),

    createActivity({
      id: "bio-dangote-a9",

      type: "teach",

      title:
        "From Cement to a Wider Industrial System",

      teacherPrompt:
        "Dangote Group today operates across industries including cement, fertilizer, sugar, salt and petroleum refining. The group describes a long-term shift toward local production and large industrial operations.",

      narrationText:
        "This is where biography becomes capital-allocation education. Capital generated or raised in one part of a business system can be directed toward expanding existing businesses or entering new industries.",

      visualTitle:
        "Industrial Portfolio",

      visualDescription:
        "Cement • Fertilizer • Sugar • Salt • Refining",

      story:
        "Five large industry tiles appear one after another around a central Dangote Industries node. Connecting lines show a group structure rather than a pile of cash.",
    }),

    createActivity({
      id: "bio-dangote-a10",

      type: "teach",

      title:
        "The Refinery: Scale and Risk",

      teacherPrompt:
        "The Dangote Refinery became one of the largest and most complex projects associated with the group. Forbes reported that the project required roughly $23 billion of investment and began refining operations in early 2024.",

      narrationText:
        "Large-scale investment changes the size of both potential reward and potential loss. Capital tied up in a refinery cannot simply be moved around like cash in a savings account.",

      visualTitle:
        "Capital at Scale",

      visualDescription:
        "Large project • long time horizon • financing • construction risk • operating risk",

      story:
        "A timeline stretches across the screen from project commitment to construction to operations. A risk dial increases as capital commitment grows.",
    }),

    createActivity({
      id: "bio-dangote-a11",

      type: "case-study",

      title:
        "Concentration Can Create Both Power and Risk",

      teacherPrompt:
        "A person whose wealth is heavily connected to businesses they control may benefit substantially when those businesses grow. The same concentration can also expose them to industry, regulatory, financing and execution risk.",

      learnerInstruction:
        "Why might concentrated ownership create both an advantage and a vulnerability?",

      story:
        "Ownership can provide control, long-term upside and strategic influence. But if a large portion of wealth depends on a small number of businesses or sectors, poor performance can affect a large part of the owner's net worth.",

      visualTitle:
        "Concentration",

      visualDescription:
        "Control and upside on one side. Exposure and risk on the other.",

      points: 8,
    }),

    createActivity({
      id: "bio-dangote-a12",

      type: "teach",

      title:
        "Public Fact, Estimate or Private?",

      teacherPrompt:
        "Not every detail of a wealthy person's finances is publicly available. Good financial education must separate documented company ownership from external net-worth estimates and from information that remains private.",

      narrationText:
        "For example, audited company accounts can document share ownership. A publication such as Forbes can estimate net worth. But the person's complete private portfolio, cash holdings or estate arrangements may not be publicly disclosed.",

      visualTitle:
        "Evidence Matters",

      visualDescription:
        "PUBLIC FACT • EXTERNAL ESTIMATE • PRIVATE / NOT DISCLOSED",

      story:
        "Three cards appear. AYO sorts examples into each category: audited shareholding, estimated net worth, private bank balance.",
    }),

    createActivity({
      id: "bio-dangote-a13",

      type: "multiple-choice",

      title:
        "Which Is Most Directly Documented?",

      teacherPrompt:
        "Which of these is strongest as a directly documented public fact?",

      options: [
        {
          id: "a",
          label:
            "An audited annual report showing a company's shareholding structure.",
          value:
            "annual-report",
        },
        {
          id: "b",
          label:
            "A guess about how much cash a billionaire keeps at home.",
          value:
            "cash-guess",
        },
        {
          id: "c",
          label:
            "A social-media comment about someone's private investments.",
          value:
            "social-comment",
        },
      ],

      correctOptionId: "a",

      successReply:
        "Correct. Audited company disclosures are stronger evidence for documented ownership than speculation about private finances.",

      retryReply:
        "Choose the source that formally reports actual company ownership.",

      points: 6,
    }),

    createActivity({
      id: "bio-dangote-a14",

      type: "reflection",

      title:
        "The AYO Lesson",

      teacherPrompt:
        "Looking at the journey from trading to manufacturing and large-scale ownership, which idea stands out most to you: trading, ownership, reinvestment, scale, concentration or risk? Explain why.",

      narrationText:
        "The purpose of this biography is not to tell you to copy Aliko Dangote. It is to help you recognise the financial ideas inside a real business story.",

      visualTitle:
        "What Did You Notice?",

      visualDescription:
        "Trading → Ownership → Scale → Capital Allocation → Risk",

      points: 10,
    }),
  ],
});

const greatnessUnit =
  createUnit({
    id:
      "greatness-foundation-unit-1",

    courseId:
      "greatness-foundation-course",

    unitNumber: 1,

    title:
      "Nigeria — The Lives Behind the Capital",

    description:
      "Study notable Nigerian wealth creators through the financial ideas behind their businesses, ownership and capital decisions.",

    learningOutcomes: [
      "Understand wealth creation in human and business context.",

      "Recognise the difference between income, ownership and estimated net worth.",

      "Examine capital allocation, concentration and risk through documented cases.",

      "Separate public evidence from external estimates and private information.",
    ],

    lessons: [
      dangoteLesson,
    ],
  });

  const globalCapitalJourneysUnit =
  createUnit({
    id:
      "greatness-foundation-unit-2",

    courseId:
      "greatness-foundation-course",

    unitNumber:
      2,

    title:
      "Global Capital Journeys",

    description:
      "Compare documented wealth and ownership journeys across countries, industries and economic systems. Explore how different people built, controlled, reinvested and allocated capital over time.",

    learningOutcomes: [
      "Compare different routes to business ownership and investment wealth.",

      "Recognise how industry and economic context can influence a wealth journey.",

      "Understand founder equity, investment ownership, reinvestment and capital allocation.",

      "Examine mistakes, concentration and uncertainty alongside successful outcomes.",

      "Separate company assets, personal ownership and estimated net worth.",

      "Compare financial principles across different biographies without assuming one formula creates wealth.",
    ],

    lessons: [
  warrenBuffettLesson,
  jeffBezosLesson,
  bernardArnaultLesson,
  mukeshAmbaniLesson,
  amancioOrtegaLesson,
  jensenHuangLesson,
  carlosSlimLesson,
  zhangYimingLesson,
  patriceMotsepeLesson,
  jamesDysonLesson,
],
  });

export const biographyFoundationCourse =
  createCourse({
    id:
      "greatness-foundation-course",

    programmeId:
      "greatness-foundation",

    stage: "foundation",

    title:
      "Biography of Greatness — Wealth Creators",

    description:
      "Cinematic, evidence-led biographies exploring the lives, businesses, ownership decisions and publicly documented capital journeys behind notable wealth creators around the world.",

    learningOutcomes: [
      "Trace important stages in a wealth creator's business journey.",

      "Understand the role of ownership, enterprise, reinvestment and scale.",

      "Interpret business interests and asset concentration more intelligently.",

      "Recognise risk, setbacks and uncertainty alongside success.",

      "Separate documented information from estimates and undisclosed private wealth.",
    ],

    estimatedHours: 1,

    units: [
  greatnessUnit,
  globalCapitalJourneysUnit,
],
  });