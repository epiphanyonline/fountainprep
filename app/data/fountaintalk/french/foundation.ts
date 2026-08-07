import { createFoundationCourse } from "../shared/createFoundationCourse";

export const frenchFoundationCourse = createFoundationCourse({
  language: "french",
  languageName: "French",
  description: "Build essential French speaking and listening skills through greetings, introductions and useful everyday exchanges.",
  phrases: [
  {
    "id": "french-hello",
    "title": "Hello",
    "objective": "Greet someone politely in French.",
    "source": "Hello",
    "target": "Bonjour",
    "pronunciation": "bohn-zhoor",
    "pronunciationTip": "Keep the final r soft and do not pronounce the n strongly.",
    "acceptedAnswers": [
      "Bonjour"
    ],
    "scenarioPrompt": "You arrive at school in the morning. Greet your teacher."
  },
  {
    "id": "french-good-evening",
    "title": "Good Evening",
    "objective": "Say good evening in French.",
    "source": "Good evening",
    "target": "Bonsoir",
    "pronunciation": "bohn-swahr",
    "pronunciationTip": "Join bon and soir smoothly.",
    "acceptedAnswers": [
      "Bonsoir"
    ],
    "scenarioPrompt": "You enter a restaurant in the evening. Greet the staff."
  },
  {
    "id": "french-how-are-you",
    "title": "How Are You?",
    "objective": "Ask how someone is politely in French.",
    "source": "How are you?",
    "target": "Comment allez-vous ?",
    "pronunciation": "koh-mahn tah-lay voo",
    "pronunciationTip": "Link comment and allez smoothly.",
    "acceptedAnswers": [
      "Comment allez-vous ?",
      "Comment allez-vous",
      "Comment allez vous"
    ],
    "scenarioPrompt": "You meet an adult. Ask how they are."
  },
  {
    "id": "french-my-name-is",
    "title": "My Name Is",
    "objective": "Introduce yourself in French.",
    "source": "My name is...",
    "target": "Je m’appelle...",
    "pronunciation": "zhuh mah-pell",
    "pronunciationTip": "Keep je short and say m’appelle as one phrase.",
    "acceptedAnswers": [
      "Je m’appelle",
      "Je m'appelle"
    ],
    "scenarioPrompt": "You meet a new classmate. Introduce yourself."
  },
  {
    "id": "french-thank-you",
    "title": "Thank You",
    "objective": "Thank someone in French.",
    "source": "Thank you",
    "target": "Merci",
    "pronunciation": "mehr-see",
    "pronunciationTip": "Keep both syllables light and clear.",
    "acceptedAnswers": [
      "Merci"
    ],
    "scenarioPrompt": "Someone helps you. What do you say?"
  }
],
});
