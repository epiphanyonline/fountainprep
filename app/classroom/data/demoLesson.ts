import type {
  LearnerProfile,
  Lesson,
} from "../types/classroom";

export const demoLearner: LearnerProfile = {
  id: "learner-demo-1",
  firstName: "Tobi",
  age: 7,
  academy: "language",
  programme: "Yoruba",
  stage: "Foundation",
  confidence: 58,
  preferredSpeed: "normal",
  personality: "explorer",
  strengths: ["Listening", "Willingness to participate"],
  weaknesses: ["Pronunciation", "Speaking with confidence"],
};

export const demoLesson: Lesson = {
  id: "yoruba-foundation-lesson-1",
  academy: "language",
  programme: "Yoruba",
  stage: "Foundation",
  lessonNumber: 1,
  title: "Saying Good Morning",
  description:
    "Learn how to greet someone politely in the morning and practise saying Ẹ káàárọ̀ with confidence.",
  estimatedMinutes: 10,
  reward: {
    xp: 50,
    badge: "Morning Greeter",
    streak: 1,
  },
  slides: [
    {
      id: "welcome",
      title: "Welcome back, Tobi",
      subtitle: "Yoruba Foundation",
      explanation:
        "Today we are going to learn how to greet someone politely in the morning.",
      englishText: "Good morning",
      illustration: "🌅",
      action: "continue",
    },
    {
      id: "lesson-goal",
      title: "Today’s goal",
      subtitle: "By the end of this lesson",
      explanation:
        "You will be able to hear, recognise and say the Yoruba greeting for good morning.",
      englishText: "Say good morning confidently",
      illustration: "🎯",
      action: "continue",
    },
    {
      id: "introduce-phrase",
      title: "Good morning",
      subtitle: "Listen carefully",
      explanation:
        "In Yoruba, we say Ẹ káàárọ̀ when greeting someone politely in the morning.",
      nativeText: "Ẹ káàárọ̀",
      englishText: "Good morning",
      audio: "/audio/yoruba/unit-1/e-kaaaro.mp3",
      illustration: "☀️",
      action: "listen",
    },
    {
      id: "slow-pronunciation",
      title: "Let’s say it slowly",
      subtitle: "Break the phrase into parts",
      explanation:
        "Listen to each part carefully, then put the whole greeting together.",
      nativeText: "Ẹ  ká-àárọ̀",
      englishText: "Good morning",
      audio: "/audio/yoruba/unit-1/e-kaaaro-slow.mp3",
      hint: "Start gently with Ẹ, then say káàárọ̀ smoothly.",
      illustration: "👂",
      action: "repeat",
    },
    {
      id: "guided-practice",
      title: "Your turn",
      subtitle: "Say the greeting aloud",
      explanation:
        "Press the microphone and say Ẹ káàárọ̀. Take your time and speak clearly.",
      nativeText: "Ẹ káàárọ̀",
      englishText: "Good morning",
      expectedAnswer: "Ẹ káàárọ̀",
      hint: "Listen again before speaking if you need to.",
      illustration: "🎤",
      action: "speak",
    },
    {
      id: "correction-practice",
      title: "One small improvement",
      subtitle: "Focus on the opening sound",
      explanation:
        "Begin with a soft Ẹ sound. Do not start with the English letter E sound.",
      nativeText: "Ẹ",
      englishText: "Opening sound",
      expectedAnswer: "Ẹ káàárọ̀",
      hint: "Keep the first sound short and gentle.",
      illustration: "🗣️",
      action: "speak",
    },
    {
      id: "context-practice",
      title: "Imagine this situation",
      subtitle: "You see your grandparent in the morning",
      explanation:
        "How would you greet them politely in Yoruba?",
      nativeText: "Ẹ káàárọ̀",
      englishText: "Good morning",
      expectedAnswer: "Ẹ káàárọ̀",
      hint: "Use the greeting you have just practised.",
      illustration: "🏡",
      action: "speak",
    },
    {
      id: "quick-check",
      title: "Quick check",
      subtitle: "Choose the correct greeting",
      explanation:
        "Which phrase means good morning in Yoruba?",
      nativeText: "Ẹ káàárọ̀",
      englishText: "Good morning",
      illustration: "✅",
      action: "continue",
    },
    {
      id: "independent-practice",
      title: "Say it with confidence",
      subtitle: "No help this time",
      explanation:
        "Say good morning in Yoruba without looking at the answer first.",
      expectedAnswer: "Ẹ káàárọ̀",
      hint: "Think about the first sound, then say the whole phrase.",
      illustration: "⭐",
      action: "speak",
    },
    {
      id: "celebration",
      title: "Excellent work",
      subtitle: "You completed the lesson",
      explanation:
        "You can now greet someone politely in Yoruba in the morning.",
      nativeText: "Ẹ káàárọ̀",
      englishText: "Good morning",
      illustration: "🏆",
      action: "complete",
    },
  ],
};