import { createFoundationCourse } from "../shared/createFoundationCourse";

export const hausaFoundationCourse = createFoundationCourse({
  language: "hausa",
  languageName: "Hausa",
  description: "Build essential Hausa speaking and listening skills through greetings, introductions and practical everyday conversation.",
  phrases: [
  {
    "id": "hausa-good-morning",
    "title": "Good Morning",
    "objective": "Say good morning in Hausa.",
    "source": "Good morning",
    "target": "Ina kwana",
    "pronunciation": "ee-nah kwa-nah",
    "pronunciationTip": "Keep both words short and clear.",
    "acceptedAnswers": [
      "Ina kwana"
    ],
    "scenarioPrompt": "You meet an adult in the morning. What do you say?"
  },
  {
    "id": "hausa-good-afternoon",
    "title": "Good Afternoon",
    "objective": "Greet someone in the afternoon in Hausa.",
    "source": "Good afternoon",
    "target": "Ina wuni",
    "pronunciation": "ee-nah woo-nee",
    "pronunciationTip": "Say wuni with a clear final ee sound.",
    "acceptedAnswers": [
      "Ina wuni"
    ],
    "scenarioPrompt": "You meet your teacher in the afternoon. What do you say?"
  },
  {
    "id": "hausa-good-evening",
    "title": "Good Evening",
    "objective": "Greet someone in the evening in Hausa.",
    "source": "Good evening",
    "target": "Ina yamma",
    "pronunciation": "ee-nah yam-mah",
    "pronunciationTip": "Say yamma with a gentle double m sound.",
    "acceptedAnswers": [
      "Ina yamma"
    ],
    "scenarioPrompt": "You visit a neighbour in the evening. What do you say?"
  },
  {
    "id": "hausa-how-are-you",
    "title": "How Are You?",
    "objective": "Ask how someone is in Hausa.",
    "source": "How are you?",
    "target": "Yaya kake?",
    "pronunciation": "yah-yah kah-keh",
    "pronunciationTip": "Use kake when speaking to a male learner.",
    "acceptedAnswers": [
      "Yaya kake?",
      "Yaya kake"
    ],
    "scenarioPrompt": "You meet a friend. Ask how he is."
  },
  {
    "id": "hausa-my-name-is",
    "title": "My Name Is",
    "objective": "Introduce yourself in Hausa.",
    "source": "My name is...",
    "target": "Sunana...",
    "pronunciation": "soo-nah-nah",
    "pronunciationTip": "Say Sunana, then add your name.",
    "acceptedAnswers": [
      "Sunana"
    ],
    "scenarioPrompt": "You have just met Ayo. Introduce yourself."
  }
],
});
