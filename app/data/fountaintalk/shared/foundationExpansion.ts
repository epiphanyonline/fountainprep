import type { CurriculumCourse } from "@/app/types/fountaintalk";
import { appendFoundationUnits, type FoundationPhrase } from "./createFoundationCourse";

const additions: Record<CurriculumCourse["language"], [FoundationPhrase[], FoundationPhrase[]]> = {
  "yoruba": [
    [
      {
        "id": "yoruba-foundation-extra-2-1",
        "title": "Mother",
        "source": "My mother",
        "target": "Ìyá mi",
        "objective": "Use the mother expression in Yoruba.",
        "acceptedAnswers": [
          "Ìyá mi"
        ],
        "scenarioPrompt": "You show a family picture. Say 'my mother'.",
        "pronunciationTip": "Keep the low tone on Ì and high tone on yá."
      },
      {
        "id": "yoruba-foundation-extra-2-2",
        "title": "Father",
        "source": "My father",
        "target": "Bàbá mi",
        "objective": "Use the father expression in Yoruba.",
        "acceptedAnswers": [
          "Bàbá mi"
        ],
        "scenarioPrompt": "You show a picture of your father. Say 'my father'.",
        "pronunciationTip": "Keep the first syllable low and the second high."
      },
      {
        "id": "yoruba-foundation-extra-2-3",
        "title": "Child",
        "source": "Child",
        "target": "Ọmọ",
        "objective": "Use the child expression in Yoruba.",
        "acceptedAnswers": [
          "Ọmọ"
        ],
        "scenarioPrompt": "You see a young child. Say 'child'.",
        "pronunciationTip": "Both ọ vowels are open vowels."
      },
      {
        "id": "yoruba-foundation-extra-2-4",
        "title": "My family",
        "source": "My family",
        "target": "Ẹbí mi",
        "objective": "Use the my family expression in Yoruba.",
        "acceptedAnswers": [
          "Ẹbí mi"
        ],
        "scenarioPrompt": "You introduce your family in a photo. Say 'my family'.",
        "pronunciationTip": "Ẹ is an open vowel; keep bí high."
      },
      {
        "id": "yoruba-foundation-extra-2-5",
        "title": "Love",
        "source": "I love you",
        "target": "Mo nífẹ̀ẹ́ rẹ",
        "objective": "Use the love expression in Yoruba.",
        "acceptedAnswers": [
          "Mo nífẹ̀ẹ́ rẹ"
        ],
        "scenarioPrompt": "You want to express affection to someone close. Say 'I love you'.",
        "pronunciationTip": "Listen to the contrasting low and high tones in fẹ̀ẹ́."
      }
    ],
    [
      {
        "id": "yoruba-foundation-extra-3-1",
        "title": "Water",
        "source": "I want water",
        "target": "Mo fẹ́ omi",
        "objective": "Use the water expression in Yoruba.",
        "acceptedAnswers": [
          "Mo fẹ́ omi"
        ],
        "scenarioPrompt": "You are thirsty. Say 'I want water'.",
        "pronunciationTip": "Keep fẹ́ high; distinguish ẹ from e."
      },
      {
        "id": "yoruba-foundation-extra-3-2",
        "title": "Food",
        "source": "I want food",
        "target": "Mo fẹ́ oúnjẹ",
        "objective": "Use the food expression in Yoruba.",
        "acceptedAnswers": [
          "Mo fẹ́ oúnjẹ"
        ],
        "scenarioPrompt": "You are hungry. Say 'I want food'.",
        "pronunciationTip": "Listen to the tones in oúnjẹ."
      },
      {
        "id": "yoruba-foundation-extra-3-3",
        "title": "Home",
        "source": "I am going home",
        "target": "Mo ń lọ sílé",
        "objective": "Use the home expression in Yoruba.",
        "acceptedAnswers": [
          "Mo ń lọ sílé"
        ],
        "scenarioPrompt": "You are leaving for home. Say 'I am going home'.",
        "pronunciationTip": "Keep ń nasal and listen to the tones in sílé."
      },
      {
        "id": "yoruba-foundation-extra-3-4",
        "title": "Come here",
        "source": "Come here",
        "target": "Wá síbí",
        "objective": "Use the come here expression in Yoruba.",
        "acceptedAnswers": [
          "Wá síbí"
        ],
        "scenarioPrompt": "You ask a friend to come closer.",
        "pronunciationTip": "Keep the high tones clear."
      },
      {
        "id": "yoruba-foundation-extra-3-5",
        "title": "Good night",
        "source": "Good night",
        "target": "Ó dàárọ̀",
        "objective": "Use the good night expression in Yoruba.",
        "acceptedAnswers": [
          "Ó dàárọ̀"
        ],
        "scenarioPrompt": "You say goodbye to someone at bedtime.",
        "pronunciationTip": "This is a customary farewell until morning."
      }
    ]
  ],
  "igbo": [
    [
      {
        "id": "igbo-foundation-extra-2-1",
        "title": "Mother",
        "source": "My mother",
        "target": "Nne m",
        "objective": "Use the mother expression in Igbo.",
        "acceptedAnswers": [
          "Nne m"
        ],
        "scenarioPrompt": "Point to your mother in a family photo.",
        "pronunciationTip": "Listen to the initial nasal sound."
      },
      {
        "id": "igbo-foundation-extra-2-2",
        "title": "Father",
        "source": "My father",
        "target": "Nna m",
        "objective": "Use the father expression in Igbo.",
        "acceptedAnswers": [
          "Nna m"
        ],
        "scenarioPrompt": "Point to your father in a family photo.",
        "pronunciationTip": "Listen to the initial nasal sound."
      },
      {
        "id": "igbo-foundation-extra-2-3",
        "title": "Child",
        "source": "Child",
        "target": "Nwa",
        "objective": "Use the child expression in Igbo.",
        "acceptedAnswers": [
          "Nwa"
        ],
        "scenarioPrompt": "You see a child. Say 'child'.",
        "pronunciationTip": "Say nw together, without inserting a vowel."
      },
      {
        "id": "igbo-foundation-extra-2-4",
        "title": "Family",
        "source": "My family",
        "target": "Ezinụlọ m",
        "objective": "Use the family expression in Igbo.",
        "acceptedAnswers": [
          "Ezinụlọ m"
        ],
        "scenarioPrompt": "You show a photo of your family.",
        "pronunciationTip": "Keep the underdotted ụ distinct."
      },
      {
        "id": "igbo-foundation-extra-2-5",
        "title": "Love",
        "source": "I love you",
        "target": "A hụrụ m gị n'anya",
        "objective": "Use the love expression in Igbo.",
        "acceptedAnswers": [
          "A hụrụ m gị n'anya"
        ],
        "scenarioPrompt": "Say 'I love you' to a loved one.",
        "pronunciationTip": "Listen to each word and its natural rhythm."
      }
    ],
    [
      {
        "id": "igbo-foundation-extra-3-1",
        "title": "Water",
        "source": "I want water",
        "target": "Achọrọ m mmiri",
        "objective": "Use the water expression in Igbo.",
        "acceptedAnswers": [
          "Achọrọ m mmiri"
        ],
        "scenarioPrompt": "You are thirsty. Ask for water.",
        "pronunciationTip": "Keep ọ distinct from o."
      },
      {
        "id": "igbo-foundation-extra-3-2",
        "title": "Food",
        "source": "I want food",
        "target": "Achọrọ m nri",
        "objective": "Use the food expression in Igbo.",
        "acceptedAnswers": [
          "Achọrọ m nri"
        ],
        "scenarioPrompt": "You are hungry. Say 'I want food'.",
        "pronunciationTip": "Listen to the initial n in nri."
      },
      {
        "id": "igbo-foundation-extra-3-3",
        "title": "Home",
        "source": "House",
        "target": "Ụlọ",
        "objective": "Use the home expression in Igbo.",
        "acceptedAnswers": [
          "Ụlọ"
        ],
        "scenarioPrompt": "You point to a house.",
        "pronunciationTip": "Keep the underdotted vowels distinct."
      },
      {
        "id": "igbo-foundation-extra-3-4",
        "title": "Come here",
        "source": "Come here",
        "target": "Bịa ebe a",
        "objective": "Use the come here expression in Igbo.",
        "acceptedAnswers": [
          "Bịa ebe a"
        ],
        "scenarioPrompt": "Call a friend over.",
        "pronunciationTip": "Listen to ị in Bịa."
      },
      {
        "id": "igbo-foundation-extra-3-5",
        "title": "Goodbye",
        "source": "See you later",
        "target": "Ka ọ dị",
        "objective": "Use the goodbye expression in Igbo.",
        "acceptedAnswers": [
          "Ka ọ dị"
        ],
        "scenarioPrompt": "You are leaving a friend.",
        "pronunciationTip": "Listen to the natural farewell intonation."
      }
    ]
  ],
  "hausa": [
    [
      {
        "id": "hausa-foundation-extra-2-1",
        "title": "Mother",
        "source": "My mother",
        "target": "Mahaifiyata",
        "objective": "Use the mother expression in Hausa.",
        "acceptedAnswers": [
          "Mahaifiyata"
        ],
        "scenarioPrompt": "Introduce your mother in a photo.",
        "pronunciationTip": "Listen to the vowel lengths in the model."
      },
      {
        "id": "hausa-foundation-extra-2-2",
        "title": "Father",
        "source": "My father",
        "target": "Mahaifina",
        "objective": "Use the father expression in Hausa.",
        "acceptedAnswers": [
          "Mahaifina"
        ],
        "scenarioPrompt": "Introduce your father in a photo.",
        "pronunciationTip": "Listen to the natural syllable rhythm."
      },
      {
        "id": "hausa-foundation-extra-2-3",
        "title": "Child",
        "source": "Child",
        "target": "Yaro",
        "objective": "Use the child expression in Hausa.",
        "acceptedAnswers": [
          "Yaro"
        ],
        "scenarioPrompt": "Point to a boy. Say 'boy/child'.",
        "pronunciationTip": "Yaro refers to a boy; yarinya refers to a girl."
      },
      {
        "id": "hausa-foundation-extra-2-4",
        "title": "Family",
        "source": "My family",
        "target": "Iyalina",
        "objective": "Use the family expression in Hausa.",
        "acceptedAnswers": [
          "Iyalina"
        ],
        "scenarioPrompt": "Introduce your family.",
        "pronunciationTip": "Listen to the vowel sequence."
      },
      {
        "id": "hausa-foundation-extra-2-5",
        "title": "Love",
        "source": "I love you (to a male)",
        "target": "Ina son ka",
        "objective": "Use the love expression in Hausa.",
        "acceptedAnswers": [
          "Ina son ka"
        ],
        "scenarioPrompt": "Say 'I love you' to a male family member.",
        "pronunciationTip": "Use ki instead of ka when addressing a female."
      }
    ],
    [
      {
        "id": "hausa-foundation-extra-3-1",
        "title": "Water",
        "source": "I want water",
        "target": "Ina son ruwa",
        "objective": "Use the water expression in Hausa.",
        "acceptedAnswers": [
          "Ina son ruwa"
        ],
        "scenarioPrompt": "You are thirsty. Ask for water.",
        "pronunciationTip": "Listen to the vowel lengths."
      },
      {
        "id": "hausa-foundation-extra-3-2",
        "title": "Food",
        "source": "I want food",
        "target": "Ina son abinci",
        "objective": "Use the food expression in Hausa.",
        "acceptedAnswers": [
          "Ina son abinci"
        ],
        "scenarioPrompt": "You are hungry. Say 'I want food'.",
        "pronunciationTip": "Listen to the rhythm of abinci."
      },
      {
        "id": "hausa-foundation-extra-3-3",
        "title": "Home",
        "source": "I am going home",
        "target": "Zan je gida",
        "objective": "Use the home expression in Hausa.",
        "acceptedAnswers": [
          "Zan je gida"
        ],
        "scenarioPrompt": "You are about to go home.",
        "pronunciationTip": "Listen to the rhythm of zan je."
      },
      {
        "id": "hausa-foundation-extra-3-4",
        "title": "Come here",
        "source": "Come here",
        "target": "Zo nan",
        "objective": "Use the come here expression in Hausa.",
        "acceptedAnswers": [
          "Zo nan"
        ],
        "scenarioPrompt": "Call a friend over.",
        "pronunciationTip": "Say both short words clearly."
      },
      {
        "id": "hausa-foundation-extra-3-5",
        "title": "See you tomorrow",
        "source": "See you tomorrow",
        "target": "Sai gobe",
        "objective": "Use the see you tomorrow expression in Hausa.",
        "acceptedAnswers": [
          "Sai gobe"
        ],
        "scenarioPrompt": "You will see your friend tomorrow.",
        "pronunciationTip": "Listen to the natural pronunciation of sai."
      }
    ]
  ],
  "french": [
    [
      {
        "id": "french-foundation-extra-2-1",
        "title": "Mother",
        "source": "My mother",
        "target": "Ma mère",
        "objective": "Use the mother expression in French.",
        "acceptedAnswers": [
          "Ma mère"
        ],
        "scenarioPrompt": "Introduce your mother in a photograph.",
        "pronunciationTip": "Use the French r and the open è vowel."
      },
      {
        "id": "french-foundation-extra-2-2",
        "title": "Father",
        "source": "My father",
        "target": "Mon père",
        "objective": "Use the father expression in French.",
        "acceptedAnswers": [
          "Mon père"
        ],
        "scenarioPrompt": "Introduce your father in a photograph.",
        "pronunciationTip": "The vowel in mon is nasal."
      },
      {
        "id": "french-foundation-extra-2-3",
        "title": "Child",
        "source": "A child",
        "target": "Un enfant",
        "objective": "Use the child expression in French.",
        "acceptedAnswers": [
          "Un enfant"
        ],
        "scenarioPrompt": "Point to a child.",
        "pronunciationTip": "Listen to the nasal vowels."
      },
      {
        "id": "french-foundation-extra-2-4",
        "title": "Family",
        "source": "My family",
        "target": "Ma famille",
        "objective": "Use the family expression in French.",
        "acceptedAnswers": [
          "Ma famille"
        ],
        "scenarioPrompt": "Show your family photograph.",
        "pronunciationTip": "The ending of famille sounds like a y glide."
      },
      {
        "id": "french-foundation-extra-2-5",
        "title": "Love",
        "source": "I love you",
        "target": "Je t’aime",
        "objective": "Use the love expression in French.",
        "acceptedAnswers": [
          "Je t’aime"
        ],
        "scenarioPrompt": "Say 'I love you' to a loved one.",
        "pronunciationTip": "Join t’aime smoothly."
      }
    ],
    [
      {
        "id": "french-foundation-extra-3-1",
        "title": "Water",
        "source": "I would like some water",
        "target": "Je voudrais de l’eau",
        "objective": "Use the water expression in French.",
        "acceptedAnswers": [
          "Je voudrais de l’eau"
        ],
        "scenarioPrompt": "Ask politely for water.",
        "pronunciationTip": "L’eau sounds like one syllable."
      },
      {
        "id": "french-foundation-extra-3-2",
        "title": "Food",
        "source": "I am hungry",
        "target": "J’ai faim",
        "objective": "Use the food expression in French.",
        "acceptedAnswers": [
          "J’ai faim"
        ],
        "scenarioPrompt": "Tell someone you are hungry.",
        "pronunciationTip": "Faim has a nasal vowel."
      },
      {
        "id": "french-foundation-extra-3-3",
        "title": "Home",
        "source": "I am going home",
        "target": "Je rentre à la maison",
        "objective": "Use the home expression in French.",
        "acceptedAnswers": [
          "Je rentre à la maison"
        ],
        "scenarioPrompt": "You are going home.",
        "pronunciationTip": "Listen to the natural linking and rhythm."
      },
      {
        "id": "french-foundation-extra-3-4",
        "title": "Come here",
        "source": "Come here",
        "target": "Viens ici",
        "objective": "Use the come here expression in French.",
        "acceptedAnswers": [
          "Viens ici"
        ],
        "scenarioPrompt": "Call a friend over.",
        "pronunciationTip": "Viens uses a nasal vowel; this is informal singular."
      },
      {
        "id": "french-foundation-extra-3-5",
        "title": "See you tomorrow",
        "source": "See you tomorrow",
        "target": "À demain",
        "objective": "Use the see you tomorrow expression in French.",
        "acceptedAnswers": [
          "À demain"
        ],
        "scenarioPrompt": "You will see a friend tomorrow.",
        "pronunciationTip": "Demain ends in a nasal vowel."
      }
    ]
  ],
  "mandarin": [
    [
      {
        "id": "mandarin-foundation-extra-2-1",
        "title": "Mother",
        "source": "My mother",
        "target": "我妈妈",
        "objective": "Use the mother expression in Mandarin.",
        "acceptedAnswers": [
          "我妈妈"
        ],
        "scenarioPrompt": "Show a photograph of your mother.",
        "pronunciationTip": "Wǒ māma; the second ma is usually neutral."
      },
      {
        "id": "mandarin-foundation-extra-2-2",
        "title": "Father",
        "source": "My father",
        "target": "我爸爸",
        "objective": "Use the father expression in Mandarin.",
        "acceptedAnswers": [
          "我爸爸"
        ],
        "scenarioPrompt": "Show a photograph of your father.",
        "pronunciationTip": "Wǒ bàba; the second ba is usually neutral."
      },
      {
        "id": "mandarin-foundation-extra-2-3",
        "title": "Child",
        "source": "Child",
        "target": "孩子",
        "objective": "Use the child expression in Mandarin.",
        "acceptedAnswers": [
          "孩子"
        ],
        "scenarioPrompt": "Point to a child.",
        "pronunciationTip": "Háizi; zi is normally neutral."
      },
      {
        "id": "mandarin-foundation-extra-2-4",
        "title": "Family",
        "source": "My family",
        "target": "我的家人",
        "objective": "Use the family expression in Mandarin.",
        "acceptedAnswers": [
          "我的家人"
        ],
        "scenarioPrompt": "Introduce your family members.",
        "pronunciationTip": "Wǒ de jiārén; de is neutral."
      },
      {
        "id": "mandarin-foundation-extra-2-5",
        "title": "Love",
        "source": "I love you",
        "target": "我爱你",
        "objective": "Use the love expression in Mandarin.",
        "acceptedAnswers": [
          "我爱你"
        ],
        "scenarioPrompt": "Say 'I love you' to a loved one.",
        "pronunciationTip": "Wǒ ài nǐ; listen to the falling tone on ài."
      }
    ],
    [
      {
        "id": "mandarin-foundation-extra-3-1",
        "title": "Water",
        "source": "I want to drink water",
        "target": "我想喝水",
        "objective": "Use the water expression in Mandarin.",
        "acceptedAnswers": [
          "我想喝水"
        ],
        "scenarioPrompt": "You are thirsty. Say you want to drink water.",
        "pronunciationTip": "Wǒ xiǎng hē shuǐ; the first third tone changes before xiǎng."
      },
      {
        "id": "mandarin-foundation-extra-3-2",
        "title": "Food",
        "source": "I want to eat",
        "target": "我想吃饭",
        "objective": "Use the food expression in Mandarin.",
        "acceptedAnswers": [
          "我想吃饭"
        ],
        "scenarioPrompt": "You are hungry. Say you want to eat.",
        "pronunciationTip": "Wǒ xiǎng chī fàn; listen to the tone changes."
      },
      {
        "id": "mandarin-foundation-extra-3-3",
        "title": "Home",
        "source": "I am going home",
        "target": "我回家",
        "objective": "Use the home expression in Mandarin.",
        "acceptedAnswers": [
          "我回家"
        ],
        "scenarioPrompt": "You are going home.",
        "pronunciationTip": "Wǒ huí jiā; huí rises, jiā stays high."
      },
      {
        "id": "mandarin-foundation-extra-3-4",
        "title": "Come here",
        "source": "Come here",
        "target": "过来",
        "objective": "Use the come here expression in Mandarin.",
        "acceptedAnswers": [
          "过来"
        ],
        "scenarioPrompt": "Call a friend over.",
        "pronunciationTip": "Guòlái; falling then rising."
      },
      {
        "id": "mandarin-foundation-extra-3-5",
        "title": "See you tomorrow",
        "source": "See you tomorrow",
        "target": "明天见",
        "objective": "Use the see you tomorrow expression in Mandarin.",
        "acceptedAnswers": [
          "明天见"
        ],
        "scenarioPrompt": "You will see your friend tomorrow.",
        "pronunciationTip": "Míngtiān jiàn; rising, high, falling."
      }
    ]
  ],
  "spanish": [
    [
      {
        "id": "spanish-foundation-extra-2-1",
        "title": "Mother",
        "source": "My mother",
        "target": "Mi madre",
        "objective": "Use the mother expression in Spanish.",
        "acceptedAnswers": [
          "Mi madre"
        ],
        "scenarioPrompt": "Introduce your mother in a photograph.",
        "pronunciationTip": "Stress MA in madre."
      },
      {
        "id": "spanish-foundation-extra-2-2",
        "title": "Father",
        "source": "My father",
        "target": "Mi padre",
        "objective": "Use the father expression in Spanish.",
        "acceptedAnswers": [
          "Mi padre"
        ],
        "scenarioPrompt": "Introduce your father in a photograph.",
        "pronunciationTip": "Stress PA in padre."
      },
      {
        "id": "spanish-foundation-extra-2-3",
        "title": "Child",
        "source": "A child (boy)",
        "target": "Un niño",
        "objective": "Use the child expression in Spanish.",
        "acceptedAnswers": [
          "Un niño"
        ],
        "scenarioPrompt": "Point to a boy.",
        "pronunciationTip": "Ñ is like the ny sound in canyon."
      },
      {
        "id": "spanish-foundation-extra-2-4",
        "title": "Family",
        "source": "My family",
        "target": "Mi familia",
        "objective": "Use the family expression in Spanish.",
        "acceptedAnswers": [
          "Mi familia"
        ],
        "scenarioPrompt": "Show a photograph of your family.",
        "pronunciationTip": "Stress MI in familia."
      },
      {
        "id": "spanish-foundation-extra-2-5",
        "title": "Love",
        "source": "I love you",
        "target": "Te quiero",
        "objective": "Use the love expression in Spanish.",
        "acceptedAnswers": [
          "Te quiero"
        ],
        "scenarioPrompt": "Say 'I love you' to a loved one.",
        "pronunciationTip": "Qu in quiero has a k sound."
      }
    ],
    [
      {
        "id": "spanish-foundation-extra-3-1",
        "title": "Water",
        "source": "I want water",
        "target": "Quiero agua",
        "objective": "Use the water expression in Spanish.",
        "acceptedAnswers": [
          "Quiero agua"
        ],
        "scenarioPrompt": "You are thirsty. Ask for water.",
        "pronunciationTip": "Listen to the natural linking between the words."
      },
      {
        "id": "spanish-foundation-extra-3-2",
        "title": "Food",
        "source": "I am hungry",
        "target": "Tengo hambre",
        "objective": "Use the food expression in Spanish.",
        "acceptedAnswers": [
          "Tengo hambre"
        ],
        "scenarioPrompt": "You are hungry. Tell someone.",
        "pronunciationTip": "The h in hambre is silent."
      },
      {
        "id": "spanish-foundation-extra-3-3",
        "title": "Home",
        "source": "I am going home",
        "target": "Me voy a casa",
        "objective": "Use the home expression in Spanish.",
        "acceptedAnswers": [
          "Me voy a casa"
        ],
        "scenarioPrompt": "You are leaving for home.",
        "pronunciationTip": "Listen to the natural linking of voy a."
      },
      {
        "id": "spanish-foundation-extra-3-4",
        "title": "Come here",
        "source": "Come here",
        "target": "Ven aquí",
        "objective": "Use the come here expression in Spanish.",
        "acceptedAnswers": [
          "Ven aquí"
        ],
        "scenarioPrompt": "Call a friend over.",
        "pronunciationTip": "Stress the final syllable of aquí."
      },
      {
        "id": "spanish-foundation-extra-3-5",
        "title": "See you tomorrow",
        "source": "See you tomorrow",
        "target": "Hasta mañana",
        "objective": "Use the see you tomorrow expression in Spanish.",
        "acceptedAnswers": [
          "Hasta mañana"
        ],
        "scenarioPrompt": "You will see your friend tomorrow.",
        "pronunciationTip": "H is silent; ñ is a palatal nasal."
      }
    ]
  ]
};

export function expandFoundation(course: CurriculumCourse): CurriculumCourse {
  const [family, everyday] = additions[course.language];
  return appendFoundationUnits(course, [
    { title: "Family and relationships", description: "Speak about family and express affection.", phrases: family },
    { title: "Everyday expressions", description: "Practise useful phrases for daily life.", phrases: everyday },
  ]);
}
