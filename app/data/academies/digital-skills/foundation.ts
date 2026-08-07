import {
  createActivity,
  createCourse,
  createLesson,
  createUnit,
} from "@/features/academy-content";

const deliveryModes = [
  "ai-classroom",
  "live-tutor",
  "self-study",
  "revision",
  "assessment",
] as const;

const lesson1 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-1",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "Using a Computer with Confidence",
  description:
    "Understand the keyboard, mouse, windows, apps and basic device navigation.",
  objective:
    "The learner will navigate a computer and use common controls confidently.",
  learningOutcomes: [
    "Identify basic hardware and interface elements.",
    "Open, switch and close applications.",
    "Use keyboard shortcuts for common actions.",
  ],
  estimatedMinutes: 18,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "digital-l1-a1",
      type: "introduction",
      title: "Meet the Computer",
      teacherPrompt:
        "A computer includes hardware such as the screen, keyboard and mouse, and software such as apps and operating systems.",
    }),
    createActivity({
      id: "digital-l1-a2",
      type: "teach",
      title: "Open, Switch and Close",
      teacherPrompt:
        "You can open an app, switch between apps and close a window. On Windows, Alt plus Tab switches between open apps.",
    }),
    createActivity({
      id: "digital-l1-a3",
      type: "multiple-choice",
      title: "Choose the Shortcut",
      teacherPrompt:
        "Which shortcut usually copies selected text?",
      options: [
        {
          id: "a",
          label: "Ctrl + C",
          value: "copy",
        },
        {
          id: "b",
          label: "Ctrl + P",
          value: "print",
        },
        {
          id: "c",
          label: "Ctrl + Z",
          value: "undo",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Ctrl plus C copies the selected item.",
      retryReply:
        "Choose the shortcut associated with copying.",
      points: 5,
    }),
    createActivity({
      id: "digital-l1-a4",
      type: "guided-practice",
      title: "Practise the Basics",
      teacherPrompt:
        "Describe how you would open an app, switch to another app and return to the first one.",
      hints: [
        "Mention the taskbar, app icon or Alt plus Tab.",
      ],
      points: 10,
    }),
    createActivity({
      id: "digital-l1-a5",
      type: "review",
      title: "Lesson Review",
      teacherPrompt:
        "Name two pieces of hardware and two examples of software.",
      successReply:
        "Excellent. You can now describe and navigate the basic computer environment.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-2",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Files, Folders and Cloud Storage",
  description:
    "Learn how to organise, rename, move and find digital files.",
  objective:
    "The learner will create a logical folder structure and manage files safely.",
  learningOutcomes: [
    "Distinguish files from folders.",
    "Use clear file names.",
    "Organise files locally and in cloud storage.",
  ],
  estimatedMinutes: 20,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "digital-l2-a1",
      type: "teach",
      title: "Files and Folders",
      teacherPrompt:
        "A file contains information. A folder organises files and may contain more folders.",
    }),
    createActivity({
      id: "digital-l2-a2",
      type: "example",
      title: "Use Clear Names",
      teacherPrompt:
        "A file called Science_Project_Final.docx is easier to recognise than document1.docx.",
    }),
    createActivity({
      id: "digital-l2-a3",
      type: "multiple-choice",
      title: "Choose the Better Structure",
      teacherPrompt:
        "Which folder structure is easier to manage?",
      options: [
        {
          id: "a",
          label: "All files saved together on the desktop",
          value: "unorganised",
        },
        {
          id: "b",
          label: "School > Science > Projects > 2026",
          value: "organised",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. A logical folder structure makes files easier to find.",
      retryReply:
        "Choose the option that groups related files clearly.",
      points: 5,
    }),
    createActivity({
      id: "digital-l2-a4",
      type: "project",
      title: "Design Your Folder System",
      teacherPrompt:
        "Create a folder structure for school, work or business documents.",
      hints: [
        "Start with broad categories, then create smaller subfolders.",
      ],
      points: 10,
    }),
    createActivity({
      id: "digital-l2-a5",
      type: "review",
      title: "Cloud Storage",
      teacherPrompt:
        "What is one benefit of storing a file in a cloud service?",
      acceptedAnswers: [
        "access from different devices",
        "backup",
        "sharing",
        "collaboration",
      ],
      successReply:
        "Well done. You understand how to organise and protect files.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-3",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "Creating Professional Documents",
  description:
    "Use headings, paragraphs, lists and page layout to produce clear documents.",
  objective:
    "The learner will structure and format a professional document.",
  learningOutcomes: [
    "Use headings and paragraphs correctly.",
    "Apply readable formatting.",
    "Create a document with a clear purpose and audience.",
  ],
  estimatedMinutes: 25,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "digital-l3-a1",
      type: "teach",
      title: "Structure Before Decoration",
      teacherPrompt:
        "A strong document begins with clear structure: title, headings, paragraphs and supporting lists.",
    }),
    createActivity({
      id: "digital-l3-a2",
      type: "example",
      title: "Readable Formatting",
      teacherPrompt:
        "Use one or two fonts, consistent heading sizes, reasonable spacing and enough white space.",
    }),
    createActivity({
      id: "digital-l3-a3",
      type: "multiple-choice",
      title: "Choose the Better Document",
      teacherPrompt:
        "Which choice makes a report easier to read?",
      options: [
        {
          id: "a",
          label: "One long paragraph with no headings",
          value: "poor-structure",
        },
        {
          id: "b",
          label: "Clear headings, short paragraphs and consistent spacing",
          value: "good-structure",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Structure helps the reader find and understand information.",
      retryReply:
        "Choose the option that separates information clearly.",
      points: 5,
    }),
    createActivity({
      id: "digital-l3-a4",
      type: "project",
      title: "Create a One-Page Report",
      teacherPrompt:
        "Create a one-page report with a title, introduction, two headings, one list and a short conclusion.",
      points: 15,
    }),
    createActivity({
      id: "digital-l3-a5",
      type: "review",
      title: "Document Check",
      teacherPrompt:
        "State three things you should check before sharing a document.",
      acceptedAnswers: [
        "spelling",
        "grammar",
        "formatting",
        "file name",
        "audience",
        "links",
      ],
      successReply:
        "Excellent. You can now create and review a clear professional document.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-4",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Spreadsheets for Everyday Tasks",
  description:
    "Enter, organise and calculate simple information in a spreadsheet.",
  objective:
    "The learner will build a simple spreadsheet with labels, values and formulas.",
  learningOutcomes: [
    "Enter data into rows and columns.",
    "Use simple formulas.",
    "Format a table for readability.",
  ],
  estimatedMinutes: 25,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "digital-l4-a1",
      type: "teach",
      title: "Spreadsheet Basics",
      teacherPrompt:
        "A spreadsheet organises information into cells arranged in rows and columns.",
    }),
    createActivity({
      id: "digital-l4-a2",
      type: "example",
      title: "Use a Formula",
      teacherPrompt:
        "If values are in B2 to B6, the formula =SUM(B2:B6) adds them together.",
    }),
    createActivity({
      id: "digital-l4-a3",
      type: "multiple-choice",
      title: "Choose the Correct Formula",
      teacherPrompt:
        "Which formula adds cells C2 through C10?",
      options: [
        {
          id: "a",
          label: "=SUM(C2:C10)",
          value: "correct",
        },
        {
          id: "b",
          label: "=C2-C10",
          value: "subtract",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. SUM adds all values in the selected range.",
      retryReply:
        "Choose the formula that uses SUM and a cell range.",
      points: 5,
    }),
    createActivity({
      id: "digital-l4-a4",
      type: "project",
      title: "Build a Budget Table",
      teacherPrompt:
        "Create a spreadsheet showing income, expenses and money remaining.",
      hints: [
        "Use labels, values and a total formula.",
      ],
      points: 15,
    }),
    createActivity({
      id: "digital-l4-a5",
      type: "review",
      title: "Spreadsheet Review",
      teacherPrompt:
        "Why are clear column headings important?",
      acceptedAnswers: [
        "they explain the data",
        "they make the table easier to understand",
        "they identify each field",
      ],
      successReply:
        "Well done. You can now build a useful basic spreadsheet.",
      points: 5,
    }),
  ],
});

const lesson5 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-5",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "Creating Effective Presentations",
  description:
    "Design slides that are clear, visual and easy to present.",
  objective:
    "The learner will plan and create a short presentation with a clear message.",
  learningOutcomes: [
    "Use one main idea per slide.",
    "Choose readable text and relevant visuals.",
    "Deliver a short structured presentation.",
  ],
  estimatedMinutes: 25,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "digital-l5-a1",
      type: "teach",
      title: "Slides Support the Speaker",
      teacherPrompt:
        "A slide should support what you say. It should not contain every word of your speech.",
    }),
    createActivity({
      id: "digital-l5-a2",
      type: "example",
      title: "One Idea per Slide",
      teacherPrompt:
        "A strong five-slide presentation may include a title, problem, evidence, solution and conclusion.",
    }),
    createActivity({
      id: "digital-l5-a3",
      type: "multiple-choice",
      title: "Choose the Better Slide",
      teacherPrompt:
        "Which slide is easier for an audience to follow?",
      options: [
        {
          id: "a",
          label: "A full page of tiny text",
          value: "crowded",
        },
        {
          id: "b",
          label: "A short heading, three key points and one useful visual",
          value: "clear",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. A clear slide highlights the main message.",
      retryReply:
        "Choose the slide with less clutter and stronger focus.",
      points: 5,
    }),
    createActivity({
      id: "digital-l5-a4",
      type: "project",
      title: "Build a Five-Slide Presentation",
      teacherPrompt:
        "Create a five-slide presentation teaching someone a useful skill.",
      hints: [
        "Include a title, clear sequence, visuals and a conclusion.",
      ],
      points: 15,
    }),
    createActivity({
      id: "digital-l5-a5",
      type: "review",
      title: "Presentation Check",
      teacherPrompt:
        "Name three things that make a presentation effective.",
      acceptedAnswers: [
        "clear message",
        "readable text",
        "relevant visuals",
        "good structure",
        "confident delivery",
      ],
      successReply:
        "Excellent. You can now plan a clear and engaging presentation.",
      points: 5,
    }),
  ],
});

const lesson6 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-6",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 6,
  title: "Professional Email and Online Communication",
  description:
    "Write clear emails and communicate respectfully online.",
  objective:
    "The learner will write a professional email with an appropriate subject, greeting, message and closing.",
  learningOutcomes: [
    "Use a clear subject line.",
    "Write concise and respectful messages.",
    "Recognise when not to use Reply All.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson5.id],
  activities: [
    createActivity({
      id: "digital-l6-a1",
      type: "teach",
      title: "The Email Structure",
      teacherPrompt:
        "A professional email usually contains a clear subject, greeting, purpose, relevant details, action required and polite closing.",
    }),
    createActivity({
      id: "digital-l6-a2",
      type: "example",
      title: "Be Clear and Specific",
      teacherPrompt:
        "Subject: Request to Reschedule Friday's Lesson is clearer than Subject: Hello.",
    }),
    createActivity({
      id: "digital-l6-a3",
      type: "multiple-choice",
      title: "Use Reply All Carefully",
      teacherPrompt:
        "When should you usually avoid Reply All?",
      options: [
        {
          id: "a",
          label: "When only the sender needs your response",
          value: "sender-only",
        },
        {
          id: "b",
          label: "When every recipient genuinely needs the update",
          value: "all-need",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Avoid sending unnecessary messages to everyone.",
      retryReply:
        "Choose the situation where only one person needs your reply.",
      points: 5,
    }),
    createActivity({
      id: "digital-l6-a4",
      type: "typed-response",
      title: "Write an Email",
      teacherPrompt:
        "Write a short email asking a tutor to clarify an assignment deadline.",
      hints: [
        "Include a subject, greeting, clear question and closing.",
      ],
      points: 15,
    }),
    createActivity({
      id: "digital-l6-a5",
      type: "review",
      title: "Communication Review",
      teacherPrompt:
        "What makes an online message professional?",
      acceptedAnswers: [
        "clear",
        "polite",
        "concise",
        "appropriate tone",
        "correct subject",
      ],
      successReply:
        "Well done. You can now communicate more professionally online.",
      points: 5,
    }),
  ],
});

const lesson7 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-7",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 7,
  title: "Online Research and Source Checking",
  description:
    "Search efficiently and judge whether online information is trustworthy.",
  objective:
    "The learner will use focused searches and evaluate online sources.",
  learningOutcomes: [
    "Use specific search terms.",
    "Check author, date and evidence.",
    "Compare more than one source.",
  ],
  estimatedMinutes: 22,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson6.id],
  activities: [
    createActivity({
      id: "digital-l7-a1",
      type: "teach",
      title: "Search with Purpose",
      teacherPrompt:
        "Specific search terms usually produce better results than vague questions.",
    }),
    createActivity({
      id: "digital-l7-a2",
      type: "teach",
      title: "Check the Source",
      teacherPrompt:
        "Before trusting information, check who published it, when it was updated, what evidence it uses and whether other reliable sources agree.",
    }),
    createActivity({
      id: "digital-l7-a3",
      type: "multiple-choice",
      title: "Which Source Is Stronger?",
      teacherPrompt:
        "Which source is more suitable for a school science project?",
      options: [
        {
          id: "a",
          label: "An anonymous post with no date or references",
          value: "weak",
        },
        {
          id: "b",
          label: "A university page with named authors and references",
          value: "strong",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. The university source provides clearer authority and evidence.",
      retryReply:
        "Choose the source with identifiable authors and supporting evidence.",
      points: 5,
    }),
    createActivity({
      id: "digital-l7-a4",
      type: "case-study",
      title: "Conflicting Information",
      teacherPrompt:
        "Two websites give different statistics. What should you do next?",
      acceptedAnswers: [
        "check more reliable sources",
        "compare dates",
        "look for original data",
        "verify the claim",
      ],
      successReply:
        "Correct. Conflicting information should be checked rather than guessed.",
      points: 10,
    }),
    createActivity({
      id: "digital-l7-a5",
      type: "review",
      title: "Research Checklist",
      teacherPrompt:
        "Name four things you should check before using an online source.",
      hints: [
        "Think about author, date, evidence and agreement with other sources.",
      ],
      successReply:
        "Excellent. You can now research with greater confidence.",
      points: 10,
    }),
  ],
});

const lesson8 = createLesson({
  id: "digital-skills-foundation-unit-1-lesson-8",
  academy: "digital-skills",
  programmeId: "digital-skills-foundation",
  courseId: "digital-skills-foundation-course",
  unitId: "digital-skills-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 8,
  title: "Digital Safety and Responsible Use",
  description:
    "Protect accounts, recognise suspicious messages and behave responsibly online.",
  objective:
    "The learner will apply basic cyber-safety and digital citizenship principles.",
  learningOutcomes: [
    "Create stronger passwords.",
    "Recognise common phishing signs.",
    "Protect personal information.",
    "Use digital tools respectfully.",
  ],
  estimatedMinutes: 25,
  completionPoints: 50,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson7.id],
  activities: [
    createActivity({
      id: "digital-l8-a1",
      type: "teach",
      title: "Protect Your Accounts",
      teacherPrompt:
        "Use unique passwords, enable multi-factor authentication and never share login details.",
    }),
    createActivity({
      id: "digital-l8-a2",
      type: "case-study",
      title: "The Urgent Message",
      teacherPrompt:
        "A message says your account will close in ten minutes unless you click a link and enter your password. What should you do?",
      acceptedAnswers: [
        "do not click",
        "check through the official website",
        "report it",
        "delete it",
      ],
      successReply:
        "Correct. Urgency and requests for passwords are common phishing warning signs.",
      points: 10,
    }),
    createActivity({
      id: "digital-l8-a3",
      type: "multiple-choice",
      title: "Choose the Stronger Password Habit",
      teacherPrompt:
        "Which habit is safer?",
      options: [
        {
          id: "a",
          label: "Use the same short password everywhere",
          value: "weak",
        },
        {
          id: "b",
          label: "Use unique long passwords and multi-factor authentication",
          value: "strong",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Unique passwords and multi-factor authentication reduce risk.",
      retryReply:
        "Choose the option that limits damage if one account is compromised.",
      points: 5,
    }),
    createActivity({
      id: "digital-l8-a4",
      type: "project",
      title: "Create a Digital Safety Guide",
      teacherPrompt:
        "Create a short safety guide covering passwords, phishing, privacy, respectful behaviour and asking for help.",
      points: 15,
    }),
    createActivity({
      id: "digital-l8-a5",
      type: "assessment",
      title: "Foundation Assessment",
      teacherPrompt:
        "Explain how to organise files, create documents, use spreadsheets, build presentations, write emails, research sources and stay safe online.",
      successReply:
        "Fantastic. You have completed the Digital Skills Foundation course.",
      points: 10,
    }),
  ],
});

export const digitalSkillsFoundationCourse =
  createCourse({
    id: "digital-skills-foundation-course",
    programmeId: "digital-skills-foundation",
    stage: "foundation",
    title: "Digital Skills Foundation",
    description:
      "Build the practical digital skills needed for school, work, business and everyday life.",
    learningOutcomes: [
      "Navigate computers confidently.",
      "Organise files and cloud content.",
      "Create documents, spreadsheets and presentations.",
      "Communicate professionally online.",
      "Research and evaluate sources.",
      "Use digital tools safely.",
    ],
    estimatedHours: 5,
    units: [
      createUnit({
        id: "digital-skills-foundation-unit-1",
        courseId: "digital-skills-foundation-course",
        unitNumber: 1,
        title: "Digital Confidence",
        description:
          "Develop the essential skills needed to work, learn and communicate effectively online.",
        learningOutcomes: [
          "Use common productivity tools.",
          "Manage information effectively.",
          "Communicate clearly.",
          "Stay safe online.",
        ],
        lessons: [
          lesson1,
          lesson2,
          lesson3,
          lesson4,
          lesson5,
          lesson6,
          lesson7,
          lesson8,
        ],
      }),
    ],
  });
