import { createFoundationCourse } from "../shared/createFoundationCourse";
export const spanishFoundationCourse = createFoundationCourse({ language: "spanish", languageName: "Spanish", description: "Learn essential Spanish greetings, introductions and daily conversation.", phrases: [
  {
    "id": "spanish-foundation-extra-1-1",
    "title": "Hello",
    "source": "Hello",
    "target": "Hola",
    "objective": "Use the hello expression in Spanish.",
    "acceptedAnswers": [
      "Hola"
    ],
    "scenarioPrompt": "You meet a friend. Greet them.",
    "pronunciationTip": "H is silent."
  },
  {
    "id": "spanish-foundation-extra-1-2",
    "title": "Good morning",
    "source": "Good morning",
    "target": "Buenos días",
    "objective": "Use the good morning expression in Spanish.",
    "acceptedAnswers": [
      "Buenos días"
    ],
    "scenarioPrompt": "Greet your teacher in the morning.",
    "pronunciationTip": "Stress the first syllable of días."
  },
  {
    "id": "spanish-foundation-extra-1-3",
    "title": "How are you?",
    "source": "How are you?",
    "target": "¿Cómo estás?",
    "objective": "Use the how are you? expression in Spanish.",
    "acceptedAnswers": [
      "¿Cómo estás?"
    ],
    "scenarioPrompt": "Ask a friend how they are.",
    "pronunciationTip": "Stress có and the final syllable of estás. Informal singular."
  },
  {
    "id": "spanish-foundation-extra-1-4",
    "title": "My name is",
    "source": "My name is",
    "target": "Me llamo",
    "objective": "Use the my name is expression in Spanish.",
    "acceptedAnswers": [
      "Me llamo"
    ],
    "scenarioPrompt": "Introduce yourself to a new classmate.",
    "pronunciationTip": "In many accents ll sounds like y."
  },
  {
    "id": "spanish-foundation-extra-1-5",
    "title": "Thank you",
    "source": "Thank you",
    "target": "Gracias",
    "objective": "Use the thank you expression in Spanish.",
    "acceptedAnswers": [
      "Gracias"
    ],
    "scenarioPrompt": "Someone helps you. Thank them.",
    "pronunciationTip": "In much of Spain ci sounds like th; in Latin America it sounds like s."
  }
] });
