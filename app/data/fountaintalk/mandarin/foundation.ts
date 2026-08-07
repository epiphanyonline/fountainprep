import { createFoundationCourse } from "../shared/createFoundationCourse";

export const mandarinFoundationCourse = createFoundationCourse({
  language: "mandarin",
  languageName: "Mandarin",
  description: "Build essential Mandarin listening and speaking skills through pinyin, tones, greetings and short everyday exchanges.",
  phrases: [
  {
    "id": "mandarin-hello",
    "title": "Hello",
    "objective": "Say hello in Mandarin.",
    "source": "Hello",
    "target": "你好",
    "pronunciation": "nǐ hǎo",
    "pronunciationTip": "Use a dipping third tone on both syllables.",
    "acceptedAnswers": [
      "你好",
      "nǐ hǎo",
      "ni hao"
    ],
    "scenarioPrompt": "You meet a new classmate. Greet them."
  },
  {
    "id": "mandarin-good-morning",
    "title": "Good Morning",
    "objective": "Say good morning in Mandarin.",
    "source": "Good morning",
    "target": "早上好",
    "pronunciation": "zǎoshang hǎo",
    "pronunciationTip": "Say zǎo with a third tone and keep shang light.",
    "acceptedAnswers": [
      "早上好",
      "zǎoshang hǎo",
      "zao shang hao"
    ],
    "scenarioPrompt": "You see your teacher in the morning. What do you say?"
  },
  {
    "id": "mandarin-how-are-you",
    "title": "How Are You?",
    "objective": "Ask how someone is in Mandarin.",
    "source": "How are you?",
    "target": "你好吗？",
    "pronunciation": "nǐ hǎo ma",
    "pronunciationTip": "Keep ma light because it is a question particle.",
    "acceptedAnswers": [
      "你好吗",
      "你好吗？",
      "nǐ hǎo ma",
      "ni hao ma"
    ],
    "scenarioPrompt": "You meet a friend. Ask how they are."
  },
  {
    "id": "mandarin-my-name-is",
    "title": "My Name Is",
    "objective": "Introduce yourself in Mandarin.",
    "source": "My name is...",
    "target": "我叫...",
    "pronunciation": "wǒ jiào",
    "pronunciationTip": "Use a third tone on wǒ and a falling fourth tone on jiào.",
    "acceptedAnswers": [
      "我叫",
      "wǒ jiào",
      "wo jiao"
    ],
    "scenarioPrompt": "You have just met Ayo. Introduce yourself."
  },
  {
    "id": "mandarin-thank-you",
    "title": "Thank You",
    "objective": "Say thank you in Mandarin.",
    "source": "Thank you",
    "target": "谢谢",
    "pronunciation": "xièxie",
    "pronunciationTip": "The first syllable has a falling tone; the second is lighter.",
    "acceptedAnswers": [
      "谢谢",
      "xièxie",
      "xie xie"
    ],
    "scenarioPrompt": "Someone gives you a gift. What do you say?"
  }
],
});
