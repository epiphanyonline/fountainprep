import type {
  AcademyLesson,
} from "../../../types/academy";

/**
 * Story sources used in the cold open:
 * - Reuters/Vermont reporting on Ronald Read's $8m+ estate and bequests.
 * - Public bankruptcy reporting concerning former Merrill Lynch executive Richard Fuscone.
 *
 * The contrast illustrates a principle; it is not presented as a controlled
 * comparison of identical income, opportunity or circumstances.
 */
export const whatMoneyReallyIsLesson: AcademyLesson = {
  "id": "wealth-what-money-really-is",
  "title": "What money really is",
  "objective": "Understand money as a tool for exchange, measurement, storing value, future payments and deliberate wealth-building.",
  "completionPoints": 55,
  "estimatedMinutes": 24,
  "classPromise": "By the end of this class, you will understand what money does, why income alone does not guarantee wealth and how repeated decisions can transform money into assets, security and legacy.",
  "learningOutcomes": [
    "Explain the four main jobs of money",
    "Distinguish income, money and wealth",
    "Describe how behaviour and time influence financial outcomes",
    "Recognise opportunity cost",
    "Use the PAUSE framework before spending"
  ],
  "steps": [
    {
      "id": "wealth-money-01-cold-open",
      "title": "Two men. Two very different endings.",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Before we define money, let me tell you about two real men. One spent most of his working life as a gas-station attendant and janitor. The other rose to the top of Wall Street. On paper, the second man looked far more likely to become wealthy. But their endings challenge almost everything people assume about money.",
      "displayText": "Income can open doors. Behaviour decides what happens after they open.",
      "visual": {
        "type": "comparison",
        "emoji": "⚖️",
        "title": "The surprising contrast",
        "items": [
          "Ronald Read: modest income",
          "Richard Fuscone: elite finance career"
        ]
      },
      "ayoPose": "welcome",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-02-ronald-profile",
      "title": "Ronald Read looked ordinary",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Ronald Read lived in Vermont. He worked at a gas station and later as a janitor. He dressed simply, drove an inexpensive used car and lived so quietly that most people around him had no idea he was building substantial wealth.",
      "displayText": "His lifestyle gave almost no clue about his balance sheet.",
      "visual": {
        "type": "cards",
        "emoji": "🧥",
        "title": "What people saw",
        "items": [
          "Gas-station work",
          "Janitorial work",
          "Simple clothing",
          "Used car",
          "Quiet routine"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-03-ronald-system",
      "title": "His money followed a system",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Read spent less than he earned, studied businesses and bought shares in companies he believed could remain useful for a long time. He held many investments for years. The process was not glamorous: earn, save, invest, wait and repeat.",
      "displayText": "Quiet repetition can become extraordinary over time.",
      "visual": {
        "type": "process",
        "emoji": "🔁",
        "title": "The long-term system",
        "items": [
          "Earn",
          "Spend carefully",
          "Invest",
          "Hold",
          "Repeat"
        ]
      },
      "ayoPose": "explain",
      "autoAdvance": true,
      "durationSeconds": 60,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-04-ronald-outcome",
      "title": "The town discovered his secret",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "When Ronald Read died at the age of ninety-two, his estate was worth more than eight million dollars. He left about 4.8 million dollars to his local hospital and 1.2 million dollars to the local library. His neighbours were stunned.",
      "displayText": "A modest worker left a multi-million-dollar legacy.",
      "visual": {
        "type": "timeline",
        "emoji": "🏥",
        "title": "The outcome",
        "items": [
          "Decades of investing",
          "$8m+ estate",
          "$4.8m hospital gift",
          "$1.2m library gift"
        ]
      },
      "ayoPose": "open-hands",
      "autoAdvance": true,
      "durationSeconds": 60,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-05-fuscone-profile",
      "title": "Richard Fuscone looked wealthy",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Richard Fuscone followed a very different path. He earned an MBA, became a senior Merrill Lynch executive and enjoyed the income and status associated with high finance. To an outside observer, he appeared far more financially secure than Ronald Read.",
      "displayText": "High status can look like wealth without guaranteeing resilience.",
      "visual": {
        "type": "cards",
        "emoji": "🏙️",
        "title": "What people saw",
        "items": [
          "Elite education",
          "Wall Street career",
          "Executive status",
          "High income",
          "Prestige"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-06-fuscone-outcome",
      "title": "Income did not guarantee security",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "In 2010, Fuscone declared personal bankruptcy. The contrast is not meant to mock him or to say every high earner behaves badly. It exposes a deeper truth: earning power and financial knowledge are valuable, but neither automatically creates durable wealth.",
      "displayText": "A large income is an advantage, not a complete wealth strategy.",
      "visual": {
        "type": "comparison",
        "emoji": "📉",
        "title": "Income versus outcome",
        "items": [
          "High career status",
          "Personal bankruptcy",
          "Income alone was insufficient",
          "Financial resilience matters"
        ]
      },
      "ayoPose": "think",
      "autoAdvance": true,
      "durationSeconds": 65,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-07-big-question",
      "title": "So what creates wealth?",
      "kind": "question",
      "responseType": "none",
      "teacherPrompt": "Here is the question that should stay with us throughout this course: why can someone with a modest income build lasting wealth while someone with a remarkable income can still become financially fragile?",
      "displayText": "Wealth depends on what you keep, build, own and protect—not only what you earn.",
      "visual": {
        "type": "diagram",
        "emoji": "🧭",
        "title": "The wealth question",
        "items": [
          "Earn",
          "Keep",
          "Build",
          "Own",
          "Protect",
          "Give"
        ]
      },
      "ayoPose": "open-hands",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-08-why-learn",
      "title": "Why this lesson matters",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "Families who build wealth deliberately teach children that money is not merely for buying things. It is a tool for creating choices, owning productive assets, surviving shocks, helping others and transferring opportunity to the next generation.",
      "displayText": "The goal is not to look rich. The goal is to become financially capable.",
      "visual": {
        "type": "cards",
        "emoji": "🌳",
        "title": "What financial capability creates",
        "items": [
          "Choices",
          "Security",
          "Ownership",
          "Opportunity",
          "Generosity",
          "Legacy"
        ]
      },
      "ayoPose": "explain",
      "autoAdvance": true,
      "durationSeconds": 60,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-09-transition",
      "title": "Now we can ask: what is money?",
      "kind": "transition",
      "responseType": "none",
      "teacherPrompt": "The stories of Read and Fuscone show why money education matters. Now we can begin at the foundation. What exactly is money, and what jobs does it perform?",
      "displayText": "To use money wisely, first understand what it does.",
      "visual": {
        "type": "process",
        "emoji": "➡️",
        "title": "From story to principle",
        "items": [
          "Real lives",
          "Different outcomes",
          "Big question",
          "Core lesson"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 45,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-10-barter",
      "title": "Imagine a world without money",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Imagine you grow tomatoes and want a pair of shoes. Without money, you must find a shoemaker who wants tomatoes at the same moment you want shoes. If the shoemaker wants rice instead, the trade becomes difficult.",
      "displayText": "Barter works only when both people want what the other offers.",
      "visual": {
        "type": "comparison",
        "emoji": "🍅",
        "title": "The barter problem",
        "items": [
          "You have tomatoes",
          "You want shoes",
          "Shoemaker wants rice",
          "No easy exchange"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-11-medium",
      "title": "Job one: a medium of exchange",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "Money solves the barter problem by standing between exchanges. You sell tomatoes for money, then use the money to buy shoes. The tomato buyer does not need to make shoes, and the shoemaker does not need to want tomatoes.",
      "displayText": "A medium of exchange allows value to move between people.",
      "visual": {
        "type": "process",
        "emoji": "🔄",
        "title": "Exchange becomes easier",
        "items": [
          "Tomatoes",
          "Money",
          "Shoes"
        ]
      },
      "ayoPose": "explain",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-12-account",
      "title": "Job two: a unit of account",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "Money gives us a common measuring language for value. A bicycle might cost two hundred pounds, a book fifteen pounds and lunch six pounds. Because they use the same unit, we can compare them and plan.",
      "displayText": "A unit of account makes different choices comparable.",
      "visual": {
        "type": "comparison",
        "emoji": "📏",
        "title": "One measuring language",
        "items": [
          "Bicycle: £200",
          "Book: £15",
          "Lunch: £6"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 50,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-13-store",
      "title": "Job three: a store of value",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "Money can move purchasing power from today into the future. It does not store value perfectly because inflation can reduce what it buys, but it is normally easier to preserve than goods that spoil.",
      "displayText": "Money lets you carry some purchasing power forward in time.",
      "visual": {
        "type": "timeline",
        "emoji": "🏦",
        "title": "Store value across time",
        "items": [
          "Earn today",
          "Save",
          "Use later",
          "Watch inflation"
        ]
      },
      "ayoPose": "explain",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-14-deferred",
      "title": "Job four: deferred payment",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "Money also lets people agree on payments that happen later. Loans, rent, subscriptions and salaries depend on a clear amount and a future date.",
      "displayText": "Money provides a standard for future obligations.",
      "visual": {
        "type": "timeline",
        "emoji": "📅",
        "title": "Payment across time",
        "items": [
          "Agreement today",
          "Clear amount",
          "Clear date",
          "Payment later"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 50,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-15-four-jobs",
      "title": "The four jobs together",
      "kind": "summary",
      "responseType": "none",
      "teacherPrompt": "Money is a medium of exchange, a unit of account, a store of value and a standard for deferred payment. A useful form of money does not need to be beautiful. It needs to perform these jobs reliably.",
      "displayText": "Exchange. Measure. Store. Pay later.",
      "visual": {
        "type": "cards",
        "emoji": "🧩",
        "title": "The four jobs of money",
        "items": [
          "Medium of exchange",
          "Unit of account",
          "Store of value",
          "Deferred payment"
        ]
      },
      "ayoPose": "open-hands",
      "autoAdvance": true,
      "durationSeconds": 50,
      "allowRaiseHand": true,
      "microphoneEnabled": false,
      "isCheckpoint": true
    },
    {
      "id": "wealth-money-16-trust",
      "title": "Why does money work?",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Money works because people expect other people to accept it. A banknote is inexpensive paper and a digital balance is a record, yet both can buy real goods because communities, businesses, banks and governments recognise the system.",
      "displayText": "Money is partly a technology of trust.",
      "visual": {
        "type": "diagram",
        "emoji": "🤝",
        "title": "A network of trust",
        "items": [
          "People",
          "Businesses",
          "Banks",
          "Government"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-17-money-wealth",
      "title": "Money is not the same as wealth",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "Money is one financial asset and a tool for transactions. Wealth is broader. It can include skills, businesses, investments, property, intellectual property, relationships and systems that keep producing value.",
      "displayText": "Money is a tool. Wealth is a wider collection of productive assets and capabilities.",
      "visual": {
        "type": "comparison",
        "emoji": "🌳",
        "title": "Money versus wealth",
        "items": [
          "Money: transaction tool",
          "Wealth: assets",
          "Wealth: skills",
          "Wealth: systems"
        ]
      },
      "ayoPose": "open-hands",
      "autoAdvance": true,
      "durationSeconds": 60,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-18-return-read",
      "title": "Return to Ronald Read",
      "kind": "case-study",
      "responseType": "none",
      "teacherPrompt": "Read did not merely collect cash. He converted part of his income into ownership of businesses through shares. That ownership could grow and produce dividends while he continued working. His behaviour turned money into assets.",
      "displayText": "He repeatedly converted income into ownership.",
      "visual": {
        "type": "process",
        "emoji": "📈",
        "title": "Turning money into wealth",
        "items": [
          "Income",
          "Saving",
          "Shares",
          "Ownership",
          "Long-term growth"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 60,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-19-return-fuscone",
      "title": "Return to the high earner",
      "kind": "case-study",
      "responseType": "none",
      "teacherPrompt": "The Fuscone story reminds us that income can be consumed, obligations can grow and impressive lifestyles can become fragile. Financial strength depends on the gap between what comes in and what goes out, the quality of assets owned and the risks carried.",
      "displayText": "Lifestyle can rise faster than resilience.",
      "visual": {
        "type": "diagram",
        "emoji": "⚠️",
        "title": "Financial fragility",
        "items": [
          "High income",
          "High commitments",
          "Debt",
          "Risk",
          "Low margin for error"
        ]
      },
      "ayoPose": "think",
      "autoAdvance": true,
      "durationSeconds": 60,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-20-opportunity-cost",
      "title": "Every use of money is a choice",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "Every spending decision has an opportunity cost: the value of the best alternative you give up. If you use twenty pounds one way, you cannot use that same twenty pounds to save, invest, give or repay debt.",
      "displayText": "The real cost of a choice includes the best alternative you give up.",
      "visual": {
        "type": "process",
        "emoji": "🛤️",
        "title": "One pound, several paths",
        "items": [
          "Spend",
          "Save",
          "Invest",
          "Give",
          "Repay debt"
        ]
      },
      "ayoPose": "explain",
      "autoAdvance": true,
      "durationSeconds": 55,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-21-pause",
      "title": "The PAUSE framework",
      "kind": "decision-framework",
      "responseType": "none",
      "teacherPrompt": "Before using money, PAUSE. Purpose: what should this money achieve? Alternatives: what else could I do? Urgency: must I act now? Sustainability: can I afford the repeated cost? Effect: how will this affect future me?",
      "displayText": "Purpose. Alternatives. Urgency. Sustainability. Effect.",
      "visual": {
        "type": "process",
        "emoji": "⏸️",
        "title": "PAUSE before deciding",
        "items": [
          "Purpose",
          "Alternatives",
          "Urgency",
          "Sustainability",
          "Effect"
        ]
      },
      "ayoPose": "point-slide",
      "autoAdvance": true,
      "durationSeconds": 65,
      "allowRaiseHand": true,
      "microphoneEnabled": false,
      "isCheckpoint": true
    },
    {
      "id": "wealth-money-22-phone",
      "title": "Case: the phone upgrade",
      "kind": "case-study",
      "responseType": "none",
      "teacherPrompt": "Suppose your current phone works, but a newer model costs eight hundred pounds. PAUSE asks what problem the upgrade solves, whether the decision is urgent, what alternative uses exist and which goal the purchase may delay.",
      "displayText": "A framework does not choose for you. It helps you choose deliberately.",
      "visual": {
        "type": "process",
        "emoji": "📱",
        "title": "Apply PAUSE",
        "items": [
          "Does it solve a real problem?",
          "Is it urgent?",
          "What goal would £800 delay?"
        ]
      },
      "ayoPose": "open-hands",
      "autoAdvance": true,
      "durationSeconds": 60,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-23-quiz-medium",
      "title": "Check your understanding",
      "kind": "quiz",
      "responseType": "choice",
      "teacherPrompt": "Which example shows money acting as a medium of exchange?",
      "question": "Which example shows money acting as a medium of exchange?",
      "choices": [
        {
          "id": "a",
          "label": "Using £12 to buy a book"
        },
        {
          "id": "b",
          "label": "Comparing a £12 book with a £30 bag"
        },
        {
          "id": "c",
          "label": "Saving £12 for next month"
        }
      ],
      "acceptedAnswers": [
        "Using £12 to buy a book",
        "a"
      ],
      "hint": "Look for money moving between a buyer and a seller.",
      "explanation": "Buying the book uses money to exchange value between buyer and seller.",
      "ayoPose": "listen",
      "autoAdvance": false,
      "allowRaiseHand": true,
      "microphoneEnabled": true,
      "points": 5
    },
    {
      "id": "wealth-money-24-quiz-wealth",
      "title": "Money or wealth?",
      "kind": "quiz",
      "responseType": "choice",
      "teacherPrompt": "Which option is most clearly a wealth-building asset?",
      "question": "Which option is most clearly a wealth-building asset?",
      "choices": [
        {
          "id": "a",
          "label": "Cash spent immediately on a short-lived want"
        },
        {
          "id": "b",
          "label": "A valuable skill that increases earning power"
        },
        {
          "id": "c",
          "label": "A shopping receipt"
        }
      ],
      "acceptedAnswers": [
        "A valuable skill that increases earning power",
        "b"
      ],
      "hint": "Think about something that can continue producing value.",
      "explanation": "A valuable skill can increase productive capacity and future income.",
      "ayoPose": "listen",
      "autoAdvance": false,
      "allowRaiseHand": true,
      "microphoneEnabled": true,
      "points": 5
    },
    {
      "id": "wealth-money-25-quiz-read",
      "title": "What made Read's outcome possible?",
      "kind": "quiz",
      "responseType": "choice",
      "teacherPrompt": "Which behaviour best explains Ronald Read's long-term outcome?",
      "question": "Which behaviour best explains Ronald Read's long-term outcome?",
      "choices": [
        {
          "id": "a",
          "label": "Trying to look wealthy immediately"
        },
        {
          "id": "b",
          "label": "Consistently investing part of his income for decades"
        },
        {
          "id": "c",
          "label": "Relying only on a high salary"
        }
      ],
      "acceptedAnswers": [
        "Consistently investing part of his income for decades",
        "b"
      ],
      "hint": "Return to the repeated system: earn, save, invest, hold.",
      "explanation": "His long-term behaviour converted modest income into productive ownership.",
      "ayoPose": "listen",
      "autoAdvance": false,
      "allowRaiseHand": true,
      "microphoneEnabled": true,
      "points": 5
    },
    {
      "id": "wealth-money-26-reflection",
      "title": "Your first wealth decision",
      "kind": "reflection",
      "responseType": "text",
      "teacherPrompt": "Think of one small amount of money you receive regularly. How could you divide it between present enjoyment, saving, investing, giving or another important goal?",
      "question": "How could you give one regular amount of money more than one purpose?",
      "acceptedAnswers": [
        "save",
        "saving",
        "invest",
        "investing",
        "give",
        "giving",
        "spend",
        "budget",
        "goal"
      ],
      "hint": "Name the amount or source, then assign portions to at least two purposes.",
      "explanation": "Wealth-building begins when money receives deliberate jobs instead of disappearing automatically.",
      "ayoPose": "listen",
      "autoAdvance": false,
      "allowRaiseHand": true,
      "microphoneEnabled": true,
      "points": 10
    },
    {
      "id": "wealth-money-27-closing-story",
      "title": "The lesson behind the two lives",
      "kind": "summary",
      "responseType": "none",
      "teacherPrompt": "Ronald Read and Richard Fuscone had very different careers and circumstances, so their lives are not a controlled experiment. But together they expose a powerful principle: income, education and status matter, yet behaviour, ownership, risk and time shape financial outcomes.",
      "displayText": "What you earn matters. What you repeatedly do with it matters more than most people realise.",
      "visual": {
        "type": "comparison",
        "emoji": "🧠",
        "title": "The deeper lesson",
        "items": [
          "Income creates capacity",
          "Behaviour directs capacity",
          "Ownership compounds",
          "Risk can undo progress"
        ]
      },
      "ayoPose": "open-hands",
      "autoAdvance": true,
      "durationSeconds": 65,
      "allowRaiseHand": true,
      "microphoneEnabled": false
    },
    {
      "id": "wealth-money-28-final-summary",
      "title": "Money is a tool, not the destination",
      "kind": "summary",
      "responseType": "none",
      "teacherPrompt": "Money helps people exchange, measure, store value and arrange future payments. Wealth is broader: it includes productive assets, useful skills, resilient systems and choices. The goal is not merely to possess money, but to use it wisely to build security, freedom, capability, generosity and legacy.",
      "displayText": "Use money to build security, freedom, capability and meaningful assets.",
      "visual": {
        "type": "cards",
        "emoji": "🎓",
        "title": "Remember",
        "items": [
          "Four jobs of money",
          "Money depends on trust",
          "Money is not all wealth",
          "Behaviour compounds",
          "PAUSE before deciding"
        ]
      },
      "ayoPose": "celebrate",
      "autoAdvance": false,
      "durationSeconds": 70,
      "allowRaiseHand": true,
      "microphoneEnabled": false,
      "isCheckpoint": true,
      "points": 10
    }
  ]
};
