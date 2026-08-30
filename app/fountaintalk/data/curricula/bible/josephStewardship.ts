import type { AcademyLesson } from "../../../types/academy";

export const josephStewardshipLesson: AcademyLesson = {
  id: "bible-joseph-stewardship",

  title: "Joseph: From Prison to National Stewardship",

  objective:
    "Understand Joseph's journey from family conflict and slavery to national leadership, and explore how integrity, competence, preparation and stewardship shaped his response to Egypt's coming crisis.",

  completionPoints: 60,

  estimatedMinutes: 30,

  classPromise:
    "By the end of this class, you will understand how Joseph moved from his father's household to slavery, prison and eventually national leadership; why Pharaoh trusted him with enormous responsibility; and how preparation during years of abundance helped Egypt face years of severe famine.",

  learningOutcomes: [
    "Describe the major stages of Joseph's journey from Canaan to leadership in Egypt",
    "Explain how responsibility and integrity appeared before Joseph received public authority",
    "Explain Pharaoh's dreams and Joseph's interpretation",
    "Describe Joseph's plan for preparing Egypt for famine",
    "Distinguish biblical stewardship from simplistic promises of wealth",
    "Apply principles of preparation, responsibility and wise stewardship",
  ],

  steps: [
    {
      id: "joseph-01-opening",
      title: "Before the palace",
      kind: "welcome",
      responseType: "none",
      teacherPrompt:
        "Welcome, {learnerName}. Joseph eventually became one of the most powerful administrators in Egypt. But his story did not begin in a palace. It began inside a complicated family, moved through betrayal and slavery, continued through responsibility and prison, and eventually placed him before Pharaoh.",
      displayText:
        "Public responsibility came after years of private testing.",
      visual: {
        type: "timeline",
        emoji: "📖",
        title: "Joseph's journey",
        items: [
          "Family",
          "Betrayal",
          "Slavery",
          "Responsibility",
          "Prison",
          "Preparation",
          "Leadership",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 70,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-02-family",
      title: "Joseph belonged to a complicated family",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Joseph was one of Jacob's sons. Genesis presents a family with deep history, strong personalities and serious tensions. Joseph was especially loved by his father, and that favour became one source of resentment among his brothers.",
      displayText:
        "Joseph's story begins with relationships, not economics.",
      visual: {
        type: "cards",
        emoji: "🏠",
        title: "The family setting",
        items: [
          "Jacob",
          "Joseph",
          "Brothers",
          "Favour",
          "Jealousy",
          "Conflict",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-03-favour",
      title: "Favour created tension",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Jacob's special affection for Joseph was visible. The distinctive garment he gave Joseph became a symbol of that favour. His brothers saw the unequal treatment, and their resentment intensified.",
      displayText:
        "Privilege without healthy relationships can deepen conflict.",
      visual: {
        type: "comparison",
        emoji: "📖",
        title: "A divided household",
        items: [
          "Jacob's special affection",
          "Joseph receives distinction",
          "Brothers become resentful",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 55,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-04-dreams",
      title: "Joseph had remarkable dreams",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Joseph described dreams in which others appeared to bow before him. His family understood the implication: the younger brother appeared to be describing future authority. The dreams became another source of tension.",
      displayText:
        "A glimpse of the future did not reveal the difficult road toward it.",
      visual: {
        type: "timeline",
        emoji: "🌙",
        title: "Dream and reality",
        items: [
          "Dream",
          "Expectation",
          "Conflict",
          "Long journey",
          "Fulfilment much later",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-05-betrayal",
      title: "His brothers turned against him",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "When Joseph later went to check on his brothers, their resentment became action. They seized him. Although some wanted him killed, Joseph was ultimately sold and taken away from his family.",
      displayText:
        "Joseph lost his home, status and security.",
      visual: {
        type: "timeline",
        emoji: "📖",
        title: "A sudden reversal",
        items: [
          "Son at home",
          "Sent to brothers",
          "Seized",
          "Sold",
          "Taken toward Egypt",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-06-egypt",
      title: "Joseph arrived in Egypt",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Joseph was sold in Egypt to Potiphar, an officer of Pharaoh. The young man who had once received special treatment in his father's household now lived as an enslaved person in a foreign country.",
      displayText:
        "His circumstances changed dramatically. His responsibilities did not disappear.",
      visual: {
        type: "comparison",
        emoji: "🏛️",
        title: "Canaan to Egypt",
        items: [
          "Home → foreign country",
          "Favoured son → enslaved servant",
          "Family security → uncertainty",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-07-potiphar",
      title: "Responsibility came before authority",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Genesis describes Joseph becoming trusted within Potiphar's household. Potiphar eventually placed significant responsibility under Joseph's management. Joseph was learning stewardship long before he administered the resources of a nation.",
      displayText:
        "Large responsibility was preceded by smaller responsibility.",
      visual: {
        type: "timeline",
        emoji: "🔑",
        title: "Responsibility grows",
        items: [
          "Serve",
          "Become trusted",
          "Manage",
          "Take responsibility",
          "Develop competence",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-08-stewardship",
      title: "A steward manages what is entrusted",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Stewardship means responsibly managing something entrusted to your care. Joseph did not own Potiphar's household, but he became responsible for managing what had been placed under him.",
      displayText:
        "Stewardship is responsibility before ownership.",
      visual: {
        type: "cards",
        emoji: "🧭",
        title: "Responsible stewardship",
        items: [
          "Trust",
          "Care",
          "Responsibility",
          "Accountability",
          "Wise management",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-09-integrity",
      title: "Integrity was tested",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Joseph's position in Potiphar's household brought another test. When Potiphar's wife tried to draw him into wrongdoing, Joseph refused. His decision carried a severe personal cost when he was falsely accused.",
      displayText:
        "Integrity can be costly even when the decision is right.",
      visual: {
        type: "cards",
        emoji: "⚖️",
        title: "Integrity under pressure",
        items: [
          "Opportunity",
          "Temptation",
          "Refusal",
          "False accusation",
          "Consequences",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-10-prison",
      title: "Joseph went to prison",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Joseph was imprisoned despite his refusal to betray the trust placed in him. His story therefore does not teach that doing the right thing always produces immediate reward.",
      displayText:
        "Faithfulness did not prevent hardship.",
      visual: {
        type: "timeline",
        emoji: "📖",
        title: "Another reversal",
        items: [
          "Trusted servant",
          "False accusation",
          "Prison",
          "Uncertain future",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-11-prison-responsibility",
      title: "Responsibility followed him into prison",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Even in prison, Joseph was given responsibility. The setting had changed again, but the pattern remained: he became someone others could entrust with work.",
      displayText:
        "Position changed. Character and responsibility continued.",
      visual: {
        type: "comparison",
        emoji: "🔑",
        title: "Same pattern, different place",
        items: [
          "Potiphar's house → responsibility",
          "Prison → responsibility",
          "Later Egypt → responsibility",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-12-prisoners",
      title: "Two prisoners had dreams",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Pharaoh's cupbearer and baker were imprisoned and each had a troubling dream. Joseph listened to them and interpreted the dreams, while recognising that interpretation belonged to God.",
      displayText:
        "Joseph used his ability even when his own circumstances remained difficult.",
      visual: {
        type: "cards",
        emoji: "🌙",
        title: "The prison encounter",
        items: [
          "Cupbearer",
          "Baker",
          "Two dreams",
          "Interpretation",
          "Different outcomes",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
  id: "joseph-13-forgotten",
  title: "Joseph was remembered late",
  kind: "story",
  responseType: "none",
  teacherPrompt:
    "Joseph asked the cupbearer to remember him when restored to his position. But the cupbearer forgot Joseph for a time. Joseph remained in prison.",
  displayText:
    "Competence does not always produce immediate recognition.",
  visual: {
    type: "timeline",
    emoji: "⏳",
    title: "Waiting",
    items: [
      "Joseph helps",
      "Cupbearer restored",
      "Joseph forgotten",
      "Time passes",
    ],
  },
  ayoPose: "explain",
  durationSeconds: 55,
  autoAdvance: true,
  microphoneEnabled: false,
  allowRaiseHand: true,
},

    {
      id: "joseph-14-pharaoh-dreams",
      title: "Then Pharaoh had dreams",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Pharaoh dreamed about seven healthy cows followed by seven thin cows, and seven healthy heads of grain followed by seven thin heads. The dreams disturbed him, but his advisers could not provide the answer he needed.",
      displayText:
        "Egypt's ruler faced a problem he could not solve alone.",
      visual: {
        type: "comparison",
        emoji: "🌾",
        title: "Pharaoh's dreams",
        items: [
          "7 healthy cows → 7 thin cows",
          "7 healthy heads → 7 thin heads",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 70,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-15-remembered",
      title: "The cupbearer remembered Joseph",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Pharaoh's crisis caused the cupbearer to remember the young Hebrew who had interpreted dreams in prison. Joseph was brought before Pharaoh.",
      displayText:
        "An ability developed and exercised earlier became relevant later.",
      visual: {
        type: "timeline",
        emoji: "🚪",
        title: "The door opens",
        items: [
          "Pharaoh dreams",
          "Advisers cannot resolve it",
          "Cupbearer remembers",
          "Joseph is summoned",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 55,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-16-humility",
      title: "Joseph did not claim the power for himself",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "When Pharaoh spoke about Joseph's ability to interpret dreams, Joseph did not present himself as the ultimate source of the answer. He directed attention to God.",
      displayText:
        "Competence and humility appeared together.",
      visual: {
        type: "cards",
        emoji: "🧭",
        title: "Joseph before Pharaoh",
        items: [
          "Competence",
          "Humility",
          "Faith",
          "Clarity",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 55,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-17-interpretation",
      title: "Seven years of abundance",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Joseph explained that Egypt would experience seven years of exceptional abundance. Production would be strong and resources plentiful.",
      displayText:
        "Abundance was real, but it would not last forever.",
      visual: {
        type: "timeline",
        emoji: "🌾",
        title: "The first seven years",
        items: [
          "Strong harvests",
          "Abundance",
          "Opportunity to prepare",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 55,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-18-famine",
      title: "Seven years of famine would follow",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "The years of abundance would be followed by seven years of severe famine. The coming scarcity would be so serious that the earlier abundance could easily be forgotten.",
      displayText:
        "The central challenge was converting today's abundance into tomorrow's resilience.",
      visual: {
        type: "comparison",
        emoji: "🌾",
        title: "Two economic seasons",
        items: [
          "7 years → abundance",
          "7 years → famine",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-19-diagnosis-plan",
      title: "Joseph did more than diagnose the problem",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Joseph did not stop after explaining Pharaoh's dreams. He proposed a response: appoint capable leadership, organise collection during the productive years, store grain and prepare before the famine arrived.",
      displayText:
        "Insight became useful when it was converted into a plan.",
      visual: {
        type: "timeline",
        emoji: "🧠",
        title: "From insight to action",
        items: [
          "Understand",
          "Plan",
          "Organise",
          "Store",
          "Prepare",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 70,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-20-fifth",
      title: "A specific national reserve was proposed",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Genesis records Joseph proposing that one-fifth of the produce during the seven abundant years be collected under Pharaoh's authority. This was a specific national strategy for the crisis Joseph had interpreted.",
      displayText:
        "Joseph proposed collecting one-fifth during the years of abundance.",
      visual: {
        type: "cards",
        emoji: "🌾",
        title: "Joseph's proposal",
        items: [
          "Abundant production",
          "Collect one-fifth",
          "Store food",
          "Prepare for famine",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-21-not-personal-rule",
      title: "This was not a universal 20% savings rule",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "We should read the passage carefully. Joseph's one-fifth proposal was a national response to a specific coming famine. The text does not say every person in every circumstance must save exactly twenty percent. The broader principle we can examine is preparation during abundance.",
      displayText:
        "Biblical description should not be turned carelessly into a universal financial formula.",
      visual: {
        type: "comparison",
        emoji: "📖",
        title: "Text and principle",
        items: [
          "Text: one-fifth for Egypt's crisis",
          "Principle: prepare responsibly for future needs",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 75,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-22-storage",
      title: "Preparation required infrastructure",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Collecting grain was only part of the solution. Resources had to be organised and stored where they could later be used. Planning required systems, administration and execution.",
      displayText:
        "A good intention becomes resilience through systems.",
      visual: {
        type: "timeline",
        emoji: "🏛️",
        title: "Building resilience",
        items: [
          "Produce",
          "Collect",
          "Organise",
          "Store",
          "Preserve",
          "Distribute later",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-23-pharaoh",
      title: "Pharaoh recognised more than interpretation",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Pharaoh recognised wisdom in Joseph's explanation and proposed response. Joseph had not merely identified what would happen; he demonstrated the ability to think about what should be done.",
      displayText:
        "Joseph brought interpretation and execution together.",
      visual: {
        type: "cards",
        emoji: "👑",
        title: "What Pharaoh saw",
        items: [
          "Understanding",
          "Wisdom",
          "Planning",
          "Leadership",
          "Execution",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-24-authority",
      title: "Joseph received enormous responsibility",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "Pharaoh placed Joseph over the administration of Egypt under his authority. The prisoner became a national leader. Yet the new position also carried enormous responsibility: the plan now had to work.",
      displayText:
        "Promotion increased Joseph's responsibility rather than removing it.",
      visual: {
        type: "timeline",
        emoji: "🏛️",
        title: "Responsibility expands",
        items: [
          "Household",
          "Prison",
          "Pharaoh's court",
          "National administration",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-25-abundance",
      title: "The abundant years were used to prepare",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "During the years of abundance, Joseph organised the collection and storage of food. The productive years were not treated as permission to ignore the future.",
      displayText:
        "Abundance created an opportunity for preparation.",
      visual: {
        type: "timeline",
        emoji: "🌾",
        title: "During abundance",
        items: [
          "Harvest",
          "Collect",
          "Store",
          "Repeat",
          "Build reserves",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-26-famine-arrives",
      title: "Then the famine arrived",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "When the seven years of abundance ended, the famine began as Joseph had said. Scarcity affected Egypt and surrounding regions.",
      displayText:
        "Preparation became valuable when circumstances changed.",
      visual: {
        type: "comparison",
        emoji: "🌾",
        title: "The cycle turns",
        items: [
          "Abundance → preparation",
          "Famine → reserves become essential",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 60,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-27-reserves",
      title: "Stored resources created resilience",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Egypt could draw upon resources accumulated during the earlier productive period. The story illustrates an important stewardship principle: resources available today may carry responsibilities connected to tomorrow.",
      displayText:
        "Not everything available today must be consumed today.",
      visual: {
        type: "timeline",
        emoji: "🏺",
        title: "Resources across time",
        items: [
          "Receive",
          "Preserve",
          "Prepare",
          "Need arrives",
          "Resources become useful",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-28-family-return",
      title: "The famine brought Joseph's family to Egypt",
      kind: "story",
      responseType: "none",
      teacherPrompt:
        "The famine eventually affected Joseph's family in Canaan. His brothers travelled to Egypt seeking food, not realising initially that the powerful official before them was the brother they had sold years earlier.",
      displayText:
        "The family story and the national story came together again.",
      visual: {
        type: "timeline",
        emoji: "📖",
        title: "The story reconnects",
        items: [
          "Famine in Canaan",
          "Brothers travel",
          "Food needed",
          "Joseph encountered",
        ],
      },
      ayoPose: "point-slide",
      durationSeconds: 65,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-29-reconciliation",
      title: "Power created a new moral test",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Joseph now possessed power over people who had once harmed him. The later chapters of Genesis explore recognition, testing, emotion, reconciliation and provision for his family. Leadership was therefore not only about managing grain. It also involved how Joseph used power.",
      displayText:
        "Stewardship includes how we handle authority over people.",
      visual: {
        type: "cards",
        emoji: "🤝",
        title: "Power and responsibility",
        items: [
          "Authority",
          "Memory",
          "Emotion",
          "Family",
          "Reconciliation",
          "Provision",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 70,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-30-principles",
      title: "What can we responsibly learn?",
      kind: "concept",
      responseType: "none",
      teacherPrompt:
        "Joseph's story is not a promise that faithful people will always become wealthy or powerful. It does show repeated patterns worth studying: integrity before promotion, competence in difficult circumstances, preparation during abundance, responsible management, long-term thinking and accountability when authority grows.",
      displayText:
        "Stewardship is bigger than money.",
      visual: {
        type: "cards",
        emoji: "🧭",
        title: "Stewardship principles",
        items: [
          "Integrity",
          "Competence",
          "Preparation",
          "Responsibility",
          "Long-term thinking",
          "Wise use of authority",
        ],
      },
      ayoPose: "explain",
      durationSeconds: 75,
      autoAdvance: true,
      microphoneEnabled: false,
      allowRaiseHand: true,
    },

    {
      id: "joseph-31-quiz",
      title: "Why did Egypt store grain?",
      kind: "quiz",
      responseType: "choice",
      teacherPrompt:
        "Which answer best explains why Joseph proposed collecting and storing food during the years of abundance?",
      question:
        "Why was food stored during the abundant years?",
      choices: [
        {
          id: "a",
          label:
            "To prepare for the seven years of famine that Joseph said would follow",
        },
        {
          id: "b",
          label:
            "Because Egypt had permanently stopped consuming food",
        },
        {
          id: "c",
          label:
            "Because Joseph wanted all resources kept unused forever",
        },
      ],
      acceptedAnswers: [
        "To prepare for the seven years of famine that Joseph said would follow",
        "a",
      ],
      hint:
        "Think about the relationship between the seven abundant years and the seven difficult years.",
      explanation:
        "Joseph's plan used the years of abundance to prepare resources for the severe famine that would follow.",
      ayoPose: "listen",
      autoAdvance: false,
      microphoneEnabled: true,
      allowRaiseHand: true,
      points: 10,
    },

    {
      id: "joseph-32-quiz",
      title: "What is the deeper stewardship lesson?",
      kind: "quiz",
      responseType: "choice",
      teacherPrompt:
        "Which statement best represents the lesson without claiming more than the biblical account teaches?",
      question:
        "Which conclusion is most responsible?",
      choices: [
        {
          id: "a",
          label:
            "Wise stewardship can include preparing during abundance for future responsibilities and uncertainty",
        },
        {
          id: "b",
          label:
            "The Bible requires every person to save exactly twenty percent of every income",
        },
        {
          id: "c",
          label:
            "Faith means there is no need to plan for future difficulty",
        },
      ],
      acceptedAnswers: [
        "Wise stewardship can include preparing during abundance for future responsibilities and uncertainty",
        "a",
      ],
      hint:
        "Separate Joseph's specific national strategy from the broader principle.",
      explanation:
        "The one-fifth collection belonged to Joseph's specific plan for Egypt. A broader principle is responsible preparation and stewardship.",
      ayoPose: "listen",
      autoAdvance: false,
      microphoneEnabled: true,
      allowRaiseHand: true,
      points: 10,
    },

    {
      id: "joseph-33-reflection",
      title: "Your season of preparation",
      kind: "reflection",
      responseType: "text",
      teacherPrompt:
        "Think about something currently entrusted to you: money, time, education, a skill, a job, a relationship or another responsibility. What could responsible stewardship of it look like?",
      question:
        "What is one thing entrusted to you that you could manage more intentionally?",
      acceptedAnswers: [
        "money",
        "time",
        "save",
        "saving",
        "study",
        "education",
        "skill",
        "work",
        "job",
        "family",
        "plan",
        "prepare",
        "responsibility",
      ],
      hint:
        "Name what has been entrusted to you and one practical action you could take.",
      explanation:
        "Stewardship begins by recognising responsibility and making thoughtful choices with what is already in your care.",
      ayoPose: "listen",
      autoAdvance: false,
      microphoneEnabled: true,
      allowRaiseHand: true,
      points: 20,
    },

    {
      id: "joseph-34-summary",
      title: "The prisoner who prepared a nation",
      kind: "summary",
      responseType: "none",
      teacherPrompt:
        "Joseph's journey moved through extraordinary changes: favoured son, betrayed brother, enslaved servant, trusted household manager, falsely accused prisoner, prison administrator, interpreter and national leader. When Pharaoh faced a future crisis, Joseph combined faith, interpretation, competence and planning. During abundance, Egypt prepared. When famine arrived, those preparations mattered. Joseph's story reminds us that stewardship is not merely about possessing resources. It is about faithfully managing responsibility, opportunity, ability and authority.",
      displayText:
        "The palace revealed Joseph's authority. The years before it had been forming his stewardship.",
      visual: {
        type: "timeline",
        emoji: "🎓",
        title: "Joseph's journey",
        items: [
          "Son",
          "Slave",
          "Steward",
          "Prisoner",
          "Interpreter",
          "Planner",
          "National leader",
        ],
      },
      ayoPose: "celebrate",
      durationSeconds: 80,
      autoAdvance: false,
      microphoneEnabled: false,
      allowRaiseHand: true,
      points: 20,
    },
  ],
};