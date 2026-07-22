import type {
  AcademyCourse,
} from "../../../types/academy";

export const musicFoundationCourse: AcademyCourse = {
    id: "music-foundation",
    academyId: "music",
    title: "Rhythm and Sound",
    subtitle: "Train your ears and build the foundations of music.",
    level: "foundation",
    ageGroups: ["6-9", "10-13", "14-17", "adult"],
    units: [
      {
        id: "music-unit-1",
        unitNumber: 1,
        title: "Feel and organise sound",
        description: "Beat, rhythm, pitch and attentive listening.",
        lessons: [
          {
            id: "music-beat-rhythm",
            title: "Beat and rhythm",
            objective: "Tell the steady beat apart from a changing rhythm.",
            completionPoints: 20,
            estimatedMinutes: 8,
            steps: [
              {
                id: "music-beat-welcome",
                title: "Find the pulse",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Welcome, {learnerName}! Music has a pulse called the beat. Tap your hand steadily on your knee: one, two, three, four.",
                visual: { emoji: "👏", title: "Steady beat", items: ["1", "2", "3", "4"] },
              },
              {
                id: "music-beat-teach",
                title: "Beat versus rhythm",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "The beat stays steady like a clock. Rhythm is the pattern of long and short sounds that moves over the beat.",
                visual: { emoji: "⏱️", title: "Listen for", items: ["Beat: steady", "Rhythm: changing pattern"] },
              },
              {
                id: "music-beat-example",
                title: "Speak a rhythm",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "Say 'Learn with Ayo' while tapping four steady beats. The words create a rhythm while your hand keeps the beat.",
                code: "BEAT:    1    2    3    4\nRHYTHM: Learn | with A- | yo | —",
              },
              {
                id: "music-beat-question",
                title: "Check your ear",
                kind: "question",
                responseType: "choice",
                teacherPrompt: "Which description is correct?",
                question: "What is the beat?",
                choices: [
                  { id: "a", label: "The steady pulse of the music" },
                  { id: "b", label: "Only the words of a song" },
                  { id: "c", label: "The loudest instrument" },
                ],
                acceptedAnswers: ["The steady pulse of the music", "steady pulse"],
                hint: "Think of a clock that keeps going steadily.",
                explanation: "The beat is the steady pulse that helps organise the music.",
              },
              {
                id: "music-beat-challenge",
                title: "Create a rhythm",
                kind: "challenge",
                responseType: "text",
                teacherPrompt:
                  "Create a four-beat body-percussion pattern using clap, tap or stamp. Write the four actions in order.",
                question: "What is your four-beat pattern?",
                acceptedAnswers: ["clap", "tap", "stamp", "snap", "1", "2", "3", "4"],
                hint: "Example: clap, clap, tap, stamp.",
                explanation: "A repeating four-action pattern can become a rhythm over a steady beat.",
              },
            ],
          },
          {
            id: "music-pitch",
            title: "High and low pitch",
            objective: "Recognise pitch as how high or low a sound feels.",
            completionPoints: 25,
            estimatedMinutes: 8,
            steps: [
              {
                id: "music-pitch-welcome",
                title: "Sound can climb",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Pitch tells us whether a sound is high or low. Imagine your voice climbing a staircase and then walking back down.",
                visual: { emoji: "🎼", title: "Pitch direction", items: ["High ↑", "Low ↓"] },
              },
              {
                id: "music-pitch-teach",
                title: "Pitch is not volume",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "A high sound can be quiet, and a low sound can be loud. Pitch means high or low; volume means loud or soft.",
              },
              {
                id: "music-pitch-example",
                title: "Compare instruments",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "A small bird often makes a higher-pitched sound than a large drum. The drum may be louder, but its pitch is usually lower.",
                visual: { emoji: "🐦", title: "Compare", items: ["Bird: often higher", "Large drum: often lower"] },
              },
              {
                id: "music-pitch-question",
                title: "Choose the meaning",
                kind: "question",
                responseType: "choice",
                teacherPrompt: "What does pitch describe?",
                question: "Pitch tells us...",
                choices: [
                  { id: "a", label: "How high or low a sound is" },
                  { id: "b", label: "How long a song lasts" },
                  { id: "c", label: "Who wrote the music" },
                ],
                acceptedAnswers: ["How high or low a sound is", "high or low"],
                hint: "Picture a sound staircase.",
                explanation: "Pitch is our perception of how high or low a sound is.",
              },
              {
                id: "music-pitch-reflect",
                title: "Find pitch around you",
                kind: "reflection",
                responseType: "text",
                teacherPrompt:
                  "Name one sound that is usually high-pitched and one that is usually low-pitched.",
                question: "Give one high sound and one low sound.",
                acceptedAnswers: ["high", "low", "bird", "whistle", "drum", "thunder", "bass"],
                hint: "Think of a whistle and a large drum.",
                explanation: "Comparing familiar sounds helps train your ear to recognise pitch.",
              },
            ],
          },
        ],
      },
    ],
  };
