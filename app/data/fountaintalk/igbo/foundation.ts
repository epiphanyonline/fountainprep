import { createFoundationCourse } from "../shared/createFoundationCourse";

export const igboFoundationCourse = createFoundationCourse({
  language: "igbo",
  languageName: "Igbo",
  description: "Build essential Igbo speaking and listening skills through greetings, introductions and simple everyday conversations.",
  phrases: [
  {
    "id": "igbo-good-morning",
    "title": "Good Morning",
    "objective": "Say good morning politely in Igbo.",
    "source": "Good morning",
    "target": "Ụtụtụ ọma",
    "pronunciation": "oo-too-too aw-mah",
    "pronunciationTip": "Keep the vowels clear and say each word smoothly.",
    "acceptedAnswers": [
      "Ụtụtụ ọma",
      "Ututu oma"
    ],
    "scenarioPrompt": "You meet an older family member in the morning. What do you say?"
  },
  {
    "id": "igbo-good-afternoon",
    "title": "Good Afternoon",
    "objective": "Say good afternoon politely in Igbo.",
    "source": "Good afternoon",
    "target": "Ehihie ọma",
    "pronunciation": "eh-hee-hee aw-mah",
    "pronunciationTip": "Say ehihie smoothly, then finish with ọma.",
    "acceptedAnswers": [
      "Ehihie ọma",
      "Ehihie oma"
    ],
    "scenarioPrompt": "You meet your teacher in the afternoon. What do you say?"
  },
  {
    "id": "igbo-good-evening",
    "title": "Good Evening",
    "objective": "Say good evening politely in Igbo.",
    "source": "Good evening",
    "target": "Mgbede ọma",
    "pronunciation": "m-gbeh-deh aw-mah",
    "pronunciationTip": "Keep mgbede together and finish clearly with ọma.",
    "acceptedAnswers": [
      "Mgbede ọma",
      "Mgbede oma"
    ],
    "scenarioPrompt": "You arrive home in the evening. How do you greet your family?"
  },
  {
    "id": "igbo-how-are-you",
    "title": "How Are You?",
    "objective": "Ask how someone is in Igbo.",
    "source": "How are you?",
    "target": "Kedu ka ị mere?",
    "pronunciation": "keh-doo kah ee meh-reh",
    "pronunciationTip": "Keep the question flowing naturally.",
    "acceptedAnswers": [
      "Kedu ka ị mere?",
      "Kedu ka i mere"
    ],
    "scenarioPrompt": "You meet a friend. Ask how they are."
  },
  {
    "id": "igbo-my-name-is",
    "title": "My Name Is",
    "objective": "Introduce yourself in Igbo.",
    "source": "My name is...",
    "target": "Aha m bụ...",
    "pronunciation": "ah-hah m boo",
    "pronunciationTip": "Say Aha m together, then add your name.",
    "acceptedAnswers": [
      "Aha m bụ",
      "Aha m bu"
    ],
    "scenarioPrompt": "You have just met Ayo. Introduce yourself."
  }
],
});
