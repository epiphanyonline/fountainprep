import type { CurriculumUnit } from "@/app/types/fountaintalk";

const audio = {
  goodMorning: {
    normal: "/audio/yoruba/unit-1/e-kaaaro.mp3",
    slow: "/audio/yoruba/unit-1/e-kaaaro-slow.mp3",
  },

  goodAfternoon: {
    normal: "/audio/yoruba/unit-1/e-kaasan.mp3",
    slow: "/audio/yoruba/unit-1/e-kaasan-slow.mp3",
  },

  goodEvening: {
    normal: "/audio/yoruba/unit-1/e-kaale.mp3",
    slow: "/audio/yoruba/unit-1/e-kaale-slow.mp3",
  },

  howAreYou: {
  normal: "/audio/yoruba/unit-1/bawo-ni.mp3",
  slow: "/audio/yoruba/unit-1/bawo-ni-slow.mp3",
},

  askName: {
    normal: "/audio/yoruba/unit-1/ki-ni-oruko-re.mp3",
    slow: "/audio/yoruba/unit-1/ki-ni-oruko-re-slow.mp3",
  },

  introduceName: {
    normal: "/audio/yoruba/unit-1/oruko-mi-ni-tobi.mp3",
    slow: "/audio/yoruba/unit-1/oruko-mi-ni-tobi-slow.mp3",
  },
} as const;

export const yorubaBeginnerUnitOne: CurriculumUnit = {
  id: "yoruba-beginner-unit-1",
  language: "yoruba",
  level: "foundation",
  unitNumber: 1,
  title: "Greetings and Introductions",
  description:
    "Learn how to greet people politely and introduce yourself in Yoruba.",

  lessons: [
    {
      id: "yoruba-beginner-unit-1-lesson-1",
      language: "yoruba",
      level: "foundation",
      unitNumber: 1,
      lessonNumber: 1,
      title: "Good Morning",
      objective:
        "The learner will be able to say good morning politely in Yoruba.",
      completionPoints: 20,

      vocabulary: [
        {
          source: "Good morning",
          target: "Ẹ káàárọ̀",
          pronunciation: "Ẹ kaa-rọ̀",
          nativeAudioUrl: audio.goodMorning.normal,
          slowAudioUrl: audio.goodMorning.slow,
          syllableBreakdown: ["Ẹ", "káà", "rọ̀"],
          pronunciationTip:
            "Begin with an open Ẹ sound, gently lengthen káà, and finish softly with rọ̀.",
        },
      ],

      steps: [
        {
          id: "lesson-1-step-1",
          type: "introduction",
          title: "Welcome",
          teacherPrompt:
            "Hello! Today we are going to learn how to say good morning in Yoruba. Are you ready?",
          expectedAnswers: [
            "Yes",
            "I am ready",
            "Ready",
          ],
          hints: [
            "You can say yes when you are ready.",
          ],
          successReply:
            "Wonderful! Let’s begin.",
          retryReply:
            "That’s okay. Tell me when you are ready to begin.",
        },

        {
          id: "lesson-1-step-2",
          type: "teach",
          title: "Learn the phrase",
          teacherPrompt:
            "Good morning in Yoruba is Ẹ káàárọ̀. Listen carefully.",

          nativeAudioUrl:
            audio.goodMorning.normal,
          slowAudioUrl:
            audio.goodMorning.slow,

          pronunciationTip:
            "Begin with an open Ẹ sound, gently lengthen káà, and finish softly with rọ̀.",

          expectedPhrase: "Ẹ káàárọ̀",

          acceptedAnswers: [
            "Ẹ káàárọ̀",
            "E kaaro",
            "Ekaro",
          ],

          hints: [
            "Begin with Ẹ.",
            "Listen for the long káà sound.",
          ],

          successReply:
            "Excellent listening!",

          retryReply:
            "Good try. Listen once more, then repeat it.",

          vocabulary: [
            {
              source: "Good morning",
              target: "Ẹ káàárọ̀",
              pronunciation: "Ẹ kaa-rọ̀",
              nativeAudioUrl:
                audio.goodMorning.normal,
              slowAudioUrl:
                audio.goodMorning.slow,
              syllableBreakdown: [
                "Ẹ",
                "káà",
                "rọ̀",
              ],
              pronunciationTip:
                "Begin with an open Ẹ sound and gently lengthen káà.",
            },
          ],
        },

        {
          id: "lesson-1-step-3",
          type: "repeat",
          title: "Repeat after Ayo",
          teacherPrompt:
            "Now say it with me: Ẹ káàárọ̀.",

          nativeAudioUrl:
            audio.goodMorning.normal,
          slowAudioUrl:
            audio.goodMorning.slow,

          pronunciationTip:
            "Begin with Ẹ, stretch káà gently, then finish with rọ̀.",

          expectedPhrase: "Ẹ káàárọ̀",

          acceptedAnswers: [
            "Ẹ káàárọ̀",
            "E kaaro",
            "Ekaro",
          ],

          hints: [
            "Start with Ẹ.",
            "Stretch the káà sound gently.",
          ],

          successReply:
            "Brilliant! You said Ẹ káàárọ̀.",

          retryReply:
            "Good try. Listen carefully and say Ẹ káàárọ̀ again.",
        },

        {
          id: "lesson-1-step-4",
          type: "question",
          title: "Quick check",
          teacherPrompt:
            "What would you say to Mummy or Daddy in the morning?",

          expectedPhrase: "Ẹ káàárọ̀",

          acceptedAnswers: [
            "Ẹ káàárọ̀",
            "E kaaro",
            "Ekaro",
            "Good morning",
          ],

          hints: [
            "It begins with Ẹ.",
            "Remember the greeting we just practised.",
          ],

          successReply:
            "Exactly right! You would say Ẹ káàárọ̀.",

          retryReply:
            "Almost. Listen to the greeting again, then have another try.",
        },

        {
          id: "lesson-1-step-5",
          type: "review",
          title: "Lesson review",
          teacherPrompt:
            "Before we finish, how do you say good morning in Yoruba?",

          expectedPhrase: "Ẹ káàárọ̀",

          acceptedAnswers: [
            "Ẹ káàárọ̀",
            "E kaaro",
            "Ekaro",
          ],

          hints: [
            "Think about how you greet Mummy or Daddy in the morning.",
          ],

          successReply:
            "Fantastic work! You have completed your good morning lesson.",

          retryReply:
            "Let’s practise it one more time.",
        },
      ],
    },

    {
      id: "yoruba-beginner-unit-1-lesson-2",
      language: "yoruba",
      level: "foundation",
      unitNumber: 1,
      lessonNumber: 2,
      title: "Good Afternoon",
      objective:
        "The learner will be able to say good afternoon politely in Yoruba.",
      completionPoints: 20,

      vocabulary: [
        {
          source: "Good afternoon",
          target: "Ẹ káàsán",
          pronunciation: "Ẹ kaa-sán",
          nativeAudioUrl:
            audio.goodAfternoon.normal,
          slowAudioUrl:
            audio.goodAfternoon.slow,
          syllableBreakdown: [
            "Ẹ",
            "káà",
            "sán",
          ],
          pronunciationTip:
            "Begin with Ẹ, gently lengthen káà, and finish clearly with sán.",
        },
      ],

      steps: [
        {
          id: "lesson-2-step-1",
          type: "introduction",
          title: "Welcome back",
          teacherPrompt:
            "Welcome back! Today we are learning how to greet someone in the afternoon.",
          successReply:
            "Great! Let’s learn the new greeting.",
          retryReply:
            "That’s okay. We will take it one small step at a time.",
        },

        {
          id: "lesson-2-step-2",
          type: "teach",
          title: "Learn the phrase",
          teacherPrompt:
            "Good afternoon in Yoruba is Ẹ káàsán. Listen carefully.",

          nativeAudioUrl:
            audio.goodAfternoon.normal,
          slowAudioUrl:
            audio.goodAfternoon.slow,

          pronunciationTip:
            "Begin with Ẹ, lengthen káà, and finish with sán.",

          expectedPhrase: "Ẹ káàsán",

          acceptedAnswers: [
            "Ẹ káàsán",
            "E kaasan",
            "E kasan",
          ],

          hints: [
            "Listen for the long káà sound.",
            "The last part is sán.",
          ],

          successReply:
            "Well done!",

          retryReply:
            "Good try. Listen once more, then repeat it.",
        },

        {
          id: "lesson-2-step-3",
          type: "repeat",
          title: "Repeat after Ayo",
          teacherPrompt:
            "Now it is your turn. Say Ẹ káàsán.",

          nativeAudioUrl:
            audio.goodAfternoon.normal,
          slowAudioUrl:
            audio.goodAfternoon.slow,

          pronunciationTip:
            "Say Ẹ, then káà, then sán.",

          expectedPhrase: "Ẹ káàsán",

          acceptedAnswers: [
            "Ẹ káàsán",
            "E kaasan",
            "E kasan",
          ],

          hints: [
            "Start with Ẹ.",
            "Say káà, then sán.",
          ],

          successReply:
            "Excellent! That sounded very good.",

          retryReply:
            "Nice try. Listen again and say Ẹ káàsán.",
        },

        {
          id: "lesson-2-step-4",
          type: "roleplay",
          title: "Afternoon greeting",
          teacherPrompt:
            "Imagine you meet your teacher in the afternoon. What would you say?",

          expectedPhrase: "Ẹ káàsán",

          acceptedAnswers: [
            "Ẹ káàsán",
            "E kaasan",
            "E kasan",
          ],

          hints: [
            "Use the afternoon greeting.",
          ],

          successReply:
            "Perfect! You would say Ẹ káàsán.",

          retryReply:
            "Good attempt. Think about the afternoon greeting and try again.",
        },

        {
          id: "lesson-2-step-5",
          type: "review",
          title: "Lesson review",
          teacherPrompt:
            "One final question: how do you say good afternoon in Yoruba?",

          expectedPhrase: "Ẹ káàsán",

          acceptedAnswers: [
            "Ẹ káàsán",
            "E kaasan",
            "E kasan",
          ],

          hints: [
            "Remember: Ẹ káà...",
          ],

          successReply:
            "Wonderful! You have completed the good afternoon lesson.",

          retryReply:
            "Let’s practise the greeting once more.",
        },
      ],
    },

    {
      id: "yoruba-beginner-unit-1-lesson-3",
      language: "yoruba",
      level: "foundation",
      unitNumber: 1,
      lessonNumber: 3,
      title: "Good Evening",
      objective:
        "The learner will be able to say good evening politely in Yoruba.",
      completionPoints: 20,

      vocabulary: [
        {
          source: "Good evening",
          target: "Ẹ káalẹ́",
          pronunciation: "Ẹ kaa-lẹ́",
          nativeAudioUrl:
            audio.goodEvening.normal,
          slowAudioUrl:
            audio.goodEvening.slow,
          syllableBreakdown: [
            "Ẹ",
            "ká",
            "alẹ́",
          ],
          pronunciationTip:
            "Begin with Ẹ, then say káalẹ́ smoothly without using an English I sound.",
        },
      ],

      steps: [
        {
          id: "lesson-3-step-1",
          type: "introduction",
          title: "Evening greeting",
          teacherPrompt:
            "Today we are learning how to greet someone in the evening.",
          successReply:
            "Lovely. Let’s begin.",
          retryReply:
            "That is okay. We will learn it together.",
        },

        {
          id: "lesson-3-step-2",
          type: "teach",
          title: "Learn the phrase",
          teacherPrompt:
            "Good evening in Yoruba is Ẹ káalẹ́. Listen carefully.",

          nativeAudioUrl:
            audio.goodEvening.normal,
          slowAudioUrl:
            audio.goodEvening.slow,

          pronunciationTip:
            "Begin with Ẹ and say káalẹ́ smoothly.",

          expectedPhrase: "Ẹ káalẹ́",

          acceptedAnswers: [
            "Ẹ káalẹ́",
            "E kaale",
            "Ekaale",
          ],

          hints: [
            "Begin with Ẹ.",
            "The final part is alẹ́.",
          ],

          successReply:
            "Great listening!",

          retryReply:
            "Good try. Listen once more before repeating it.",
        },

        {
          id: "lesson-3-step-3",
          type: "repeat",
          title: "Repeat after Ayo",
          teacherPrompt:
            "Now say it with me: Ẹ káalẹ́.",

          nativeAudioUrl:
            audio.goodEvening.normal,
          slowAudioUrl:
            audio.goodEvening.slow,

          pronunciationTip:
            "Say each section clearly: Ẹ, ká, alẹ́.",

          expectedPhrase: "Ẹ káalẹ́",

          acceptedAnswers: [
            "Ẹ káalẹ́",
            "E kaale",
            "Ekaale",
          ],

          hints: [
            "Begin with Ẹ.",
            "Finish gently with lẹ́.",
          ],

          successReply:
            "Fantastic! You said it very well.",

          retryReply:
            "Good try. Listen again and repeat Ẹ káalẹ́.",
        },

        {
          id: "lesson-3-step-4",
          type: "question",
          title: "When do we use it?",
          teacherPrompt:
            "When would you say Ẹ káalẹ́?",

          acceptedAnswers: [
            "Evening",
            "At night",
            "In the evening",
          ],

          hints: [
            "Think about the time after the afternoon.",
          ],

          successReply:
            "Correct! We say it in the evening.",

          retryReply:
            "We use this greeting in the evening. Try again.",
        },

        {
          id: "lesson-3-step-5",
          type: "review",
          title: "Lesson review",
          teacherPrompt:
            "How do you say good evening in Yoruba?",

          expectedPhrase: "Ẹ káalẹ́",

          acceptedAnswers: [
            "Ẹ káalẹ́",
            "E kaale",
            "Ekaale",
          ],

          hints: [
            "It begins with Ẹ ká.",
          ],

          successReply:
            "Excellent! You have completed the good evening lesson.",

          retryReply:
            "Let’s practise the evening greeting once more.",
        },
      ],
    },

    {
      id: "yoruba-beginner-unit-1-lesson-4",
      language: "yoruba",
      level: "foundation",
      unitNumber: 1,
      lessonNumber: 4,
      title: "What Is Your Name?",
      objective:
        "The learner will be able to ask someone their name in Yoruba.",
      completionPoints: 25,

      vocabulary: [
        {
          source: "What is your name?",
          target: "Kí ni orúkọ rẹ?",
          pronunciation:
            "Kí-ni o-rú-kọ rẹ",
          nativeAudioUrl:
            audio.askName.normal,
          slowAudioUrl:
            audio.askName.slow,
          syllableBreakdown: [
            "Kí",
            "ni",
            "o-rú-kọ",
            "rẹ",
          ],
          pronunciationTip:
            "Say Kí ni first, then orúkọ rẹ as one smooth question.",
        },
      ],

      steps: [
        {
          id: "lesson-4-step-1",
          type: "introduction",
          title: "Meeting someone",
          teacherPrompt:
            "Today you are going to learn how to ask someone their name in Yoruba.",
          successReply:
            "Wonderful. Let’s learn the question.",
          retryReply:
            "That is okay. We will practise it together.",
        },

        {
          id: "lesson-4-step-2",
          type: "teach",
          title: "Learn the question",
          teacherPrompt:
            "To ask someone their name in Yoruba, say Kí ni orúkọ rẹ? Listen carefully.",

          nativeAudioUrl:
            audio.askName.normal,
          slowAudioUrl:
            audio.askName.slow,

          pronunciationTip:
            "Say Kí ni, then orúkọ rẹ smoothly.",

          expectedPhrase:
            "Kí ni orúkọ rẹ?",

          acceptedAnswers: [
            "Kí ni orúkọ rẹ?",
            "Ki ni oruko re",
          ],

          hints: [
            "The question starts with Kí ni.",
          ],

          successReply:
            "Well done!",

          retryReply:
            "Good try. Listen once more and repeat the question.",
        },

        {
          id: "lesson-4-step-3",
          type: "repeat",
          title: "Repeat the question",
          teacherPrompt:
            "Now ask me: Kí ni orúkọ rẹ?",

          nativeAudioUrl:
            audio.askName.normal,
          slowAudioUrl:
            audio.askName.slow,

          pronunciationTip:
            "Keep the sentence smooth and finish with a questioning tone.",

          expectedPhrase:
            "Kí ni orúkọ rẹ?",

          acceptedAnswers: [
            "Kí ni orúkọ rẹ?",
            "Ki ni oruko re",
          ],

          hints: [
            "Start with Kí ni.",
            "Then say orúkọ rẹ.",
          ],

          successReply:
            "Excellent question!",

          retryReply:
            "Good try. Listen again, then ask the question.",
        },

        {
          id: "lesson-4-step-4",
          type: "roleplay",
          title: "Ask Ayo",
          teacherPrompt:
            "Imagine we have just met. Ask me my name in Yoruba.",

          expectedPhrase:
            "Kí ni orúkọ rẹ?",

          acceptedAnswers: [
            "Kí ni orúkọ rẹ?",
            "Ki ni oruko re",
          ],

          hints: [
            "Use the question we just practised.",
          ],

          successReply:
            "Perfect! My name is Ayo.",

          retryReply:
            "Think about the question you just learnt and try again.",
        },

        {
          id: "lesson-4-step-5",
          type: "review",
          title: "Lesson review",
          teacherPrompt:
            "One more time: how would you ask someone their name in Yoruba?",

          expectedPhrase:
            "Kí ni orúkọ rẹ?",

          acceptedAnswers: [
            "Kí ni orúkọ rẹ?",
            "Ki ni oruko re",
          ],

          hints: [
            "Remember that the question begins with Kí ni.",
          ],

          successReply:
            "Brilliant! You can now ask someone their name.",

          retryReply:
            "Let’s practise the question once more.",
        },
      ],
    },

    {
      id: "yoruba-beginner-unit-1-lesson-5",
      language: "yoruba",
      level: "foundation",
      unitNumber: 1,
      lessonNumber: 5,
      title: "My Name Is",
      objective:
        "The learner will be able to introduce themselves in Yoruba.",
      completionPoints: 25,

      vocabulary: [
        {
          source: "My name is Tobi",
          target: "Orúkọ mi ni Tobi",
          pronunciation:
            "O-rú-kọ mi ni Tobi",
          nativeAudioUrl:
            audio.introduceName.normal,
          slowAudioUrl:
            audio.introduceName.slow,
          syllableBreakdown: [
            "O-rú-kọ",
            "mi",
            "ni",
            "Tobi",
          ],
          pronunciationTip:
            "Say Orúkọ mi ni smoothly, then add your name.",
        },
      ],

      steps: [
        {
          id: "lesson-5-step-1",
          type: "introduction",
          title: "Introduce yourself",
          teacherPrompt:
            "Today you will learn how to tell someone your name in Yoruba.",
          successReply:
            "Excellent. Let’s begin.",
          retryReply:
            "That is okay. We will learn it step by step.",
        },

        {
          id: "lesson-5-step-2",
          type: "teach",
          title: "Learn the sentence",
          teacherPrompt:
            "To say my name is Tobi in Yoruba, say Orúkọ mi ni Tobi. Listen carefully.",

          nativeAudioUrl:
            audio.introduceName.normal,
          slowAudioUrl:
            audio.introduceName.slow,

          pronunciationTip:
            "Say Orúkọ mi ni smoothly, then add the name Tobi.",

          expectedPhrase:
            "Orúkọ mi ni Tobi",

          acceptedAnswers: [
            "Orúkọ mi ni Tobi",
            "Oruko mi ni Tobi",
          ],

          hints: [
            "Start with Orúkọ mi ni.",
          ],

          successReply:
            "Very good!",

          retryReply:
            "Good try. Listen once more and repeat the sentence.",
        },

        {
          id: "lesson-5-step-3",
          type: "repeat",
          title: "Say your name",
          teacherPrompt:
            "Now introduce yourself. Say Orúkọ mi ni Tobi.",

          nativeAudioUrl:
            audio.introduceName.normal,
          slowAudioUrl:
            audio.introduceName.slow,

          pronunciationTip:
            "Say Orúkọ mi ni, then finish with your name.",

          expectedPhrase:
            "Orúkọ mi ni Tobi",

          acceptedAnswers: [
            "Orúkọ mi ni Tobi",
            "Oruko mi ni Tobi",
          ],

          hints: [
            "Say Orúkọ mi ni, then your name.",
          ],

          successReply:
            "Fantastic introduction!",

          retryReply:
            "Good try. Listen again and introduce yourself once more.",
        },

        {
          id: "lesson-5-step-4",
          type: "roleplay",
          title: "Meet a new friend",
          teacherPrompt:
            "Imagine you have just met a new friend. Introduce yourself in Yoruba.",

          expectedPhrase:
            "Orúkọ mi ni Tobi",

          acceptedAnswers: [
            "Orúkọ mi ni Tobi",
            "Oruko mi ni Tobi",
          ],

          hints: [
            "Begin with Orúkọ mi ni.",
          ],

          successReply:
            "Wonderful! Your new friend now knows your name.",

          retryReply:
            "Think about how to say my name is, then try again.",
        },

        {
          id: "lesson-5-step-5",
          type: "review",
          title: "Unit review",
          teacherPrompt:
            "To finish this unit, introduce yourself in Yoruba one more time.",

          expectedPhrase:
            "Orúkọ mi ni Tobi",

          acceptedAnswers: [
            "Orúkọ mi ni Tobi",
            "Oruko mi ni Tobi",
          ],

          hints: [
            "Say Orúkọ mi ni, followed by your name.",
          ],

          successReply:
            "Amazing work! You have completed the Greetings and Introductions unit.",

          retryReply:
            "Let’s practise your introduction once more.",
        },
      ],
    },
  ],
};