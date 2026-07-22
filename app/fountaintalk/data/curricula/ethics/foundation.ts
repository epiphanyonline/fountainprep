import type {
  AcademyCourse,
} from "../../../types/academy";

export const ethicsFoundationCourse: AcademyCourse = {
    id: "ethics-foundation",
    academyId: "ethics",
    title: "Everyday Character",
    subtitle: "Practise making thoughtful choices when life is not simple.",
    level: "foundation",
    ageGroups: ["6-9", "10-13", "14-17", "adult"],
    units: [
      {
        id: "ethics-unit-1",
        unitNumber: 1,
        title: "Choices that build trust",
        description: "Honesty, empathy, responsibility and repair.",
        lessons: [
          {
            id: "ethics-honesty",
            title: "Honesty when it is difficult",
            objective: "Choose an honest and responsible response to a mistake.",
            completionPoints: 20,
            estimatedMinutes: 8,
            steps: [
              {
                id: "ethics-honesty-welcome",
                title: "Character appears in choices",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Welcome, {learnerName}! Ethics helps us think about what is right, fair and responsible, especially when a choice is difficult.",
                visual: { emoji: "🧭", title: "Your character compass", items: ["Truth", "Fairness", "Responsibility", "Kindness"] },
              },
              {
                id: "ethics-honesty-teach",
                title: "Truth plus responsibility",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "Honesty is more than avoiding a lie. It includes admitting what happened, accepting your part and helping to repair any harm.",
              },
              {
                id: "ethics-honesty-scenario",
                title: "The broken model",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "Imagine you accidentally break a classmate's model while nobody is watching. You may feel afraid, but hiding it removes their chance to understand what happened.",
                visual: { emoji: "🏗️", title: "Pause before acting", items: ["What happened?", "Who is affected?", "How can I repair it?"] },
              },
              {
                id: "ethics-honesty-question",
                title: "Choose the responsible action",
                kind: "question",
                responseType: "choice",
                teacherPrompt: "What is the most responsible response?",
                question: "What should you do after accidentally breaking the model?",
                choices: [
                  { id: "a", label: "Hide it and leave" },
                  { id: "b", label: "Blame someone else" },
                  { id: "c", label: "Tell the truth, apologise and offer to help repair it" },
                ],
                acceptedAnswers: ["Tell the truth, apologise and offer to help repair it"],
                hint: "Look for truth, ownership and repair.",
                explanation: "An honest apology plus an offer to repair the harm rebuilds trust.",
              },
              {
                id: "ethics-honesty-reflect",
                title: "Use your own words",
                kind: "reflection",
                responseType: "text",
                teacherPrompt: "What could you say to the classmate? Write one honest and caring sentence.",
                question: "Write what you would say.",
                acceptedAnswers: ["sorry", "apolog", "I broke", "help", "repair", "fix"],
                hint: "Say what happened, apologise and offer a helpful next step.",
                explanation: "A sincere response names the mistake without excuses and offers repair.",
              },
            ],
          },
          {
            id: "ethics-empathy",
            title: "See through another person's eyes",
            objective: "Use empathy to respond to exclusion with kindness and action.",
            completionPoints: 25,
            estimatedMinutes: 9,
            steps: [
              {
                id: "ethics-empathy-welcome",
                title: "Notice how others may feel",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Empathy means trying to understand another person's feelings and point of view. It helps kindness become a useful action.",
                visual: { emoji: "👀", title: "Empathy", items: ["Notice", "Imagine", "Ask", "Act kindly"] },
              },
              {
                id: "ethics-empathy-teach",
                title: "Do not assume",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "We cannot always know how someone feels. We can notice clues, ask respectfully and listen rather than assuming.",
              },
              {
                id: "ethics-empathy-scenario",
                title: "The new learner",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "A new learner is standing alone while groups choose partners. They look down and hold their bag closely. Consider what they might need.",
              },
              {
                id: "ethics-empathy-question",
                title: "Choose an empathetic action",
                kind: "question",
                responseType: "choice",
                teacherPrompt: "Which response shows empathy and respect?",
                question: "What could you do?",
                choices: [
                  { id: "a", label: "Ignore them because they may want to be alone" },
                  { id: "b", label: "Invite them to join and accept their answer" },
                  { id: "c", label: "Laugh with your friends" },
                ],
                acceptedAnswers: ["Invite them to join and accept their answer"],
                hint: "Offer connection without taking away their choice.",
                explanation: "A respectful invitation shows care while allowing the learner to decide.",
              },
              {
                id: "ethics-empathy-challenge",
                title: "Turn empathy into action",
                kind: "challenge",
                responseType: "text",
                teacherPrompt:
                  "Write a friendly sentence you could use to invite the new learner without making them feel pressured.",
                question: "What would you say?",
                acceptedAnswers: ["join", "would you like", "welcome", "with us", "if you want"],
                hint: "Make it warm and leave room for them to choose.",
                explanation: "A simple, low-pressure invitation can help someone feel seen and included.",
              },
            ],
          },
        ],
      },
    ],
  };
