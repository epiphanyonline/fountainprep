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
  id: "science-foundation-unit-1-lesson-1",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "Thinking Like a Scientist",
  description:
    "Learn how scientists ask questions, make predictions, observe and use evidence.",
  objective:
    "The learner will describe the basic stages of a scientific investigation.",
  learningOutcomes: [
    "Ask a testable question.",
    "Make a prediction.",
    "Identify observations and measurements.",
    "Use evidence to form a conclusion.",
  ],
  estimatedMinutes: 20,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "science-l1-a1",
      type: "introduction",
      title: "Science Begins with Questions",
      teacherPrompt:
        "Scientists observe the world, ask questions and collect evidence before reaching conclusions.",
    }),
    createActivity({
      id: "science-l1-a2",
      type: "teach",
      title: "The Investigation Cycle",
      teacherPrompt:
        "A simple investigation includes a question, prediction, method, observation, result and conclusion.",
    }),
    createActivity({
      id: "science-l1-a3",
      type: "multiple-choice",
      title: "Choose the Testable Question",
      teacherPrompt:
        "Which question can be tested scientifically?",
      options: [
        {
          id: "a",
          label: "Which flower is the most beautiful?",
          value: "opinion",
        },
        {
          id: "b",
          label: "Does a plant grow faster in sunlight or darkness?",
          value: "testable",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Growth can be measured under different conditions.",
      retryReply:
        "Choose the question that can be observed and measured.",
      points: 5,
    }),
    createActivity({
      id: "science-l1-a4",
      type: "guided-practice",
      title: "Plan a Fair Test",
      teacherPrompt:
        "Design a simple test to find out which type of paper absorbs the most water.",
      hints: [
        "Keep the paper size and amount of water the same.",
      ],
      points: 10,
    }),
    createActivity({
      id: "science-l1-a5",
      type: "review",
      title: "Evidence Matters",
      teacherPrompt:
        "Why should a scientific conclusion be based on evidence rather than guessing?",
      acceptedAnswers: [
        "because evidence supports the conclusion",
        "to make the result reliable",
        "because guesses may be wrong",
      ],
      successReply:
        "Excellent. You understand the foundation of scientific thinking.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "science-foundation-unit-1-lesson-2",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Living and Non-Living Things",
  description:
    "Explore the features shared by living organisms.",
  objective:
    "The learner will distinguish living, once-living and non-living things.",
  learningOutcomes: [
    "Identify basic life processes.",
    "Classify living and non-living examples.",
    "Explain why growth alone does not prove something is alive.",
  ],
  estimatedMinutes: 20,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "science-l2-a1",
      type: "teach",
      title: "What Makes Something Alive?",
      teacherPrompt:
        "Living things use energy, grow, respond to their environment, reproduce and carry out other life processes.",
    }),
    createActivity({
      id: "science-l2-a2",
      type: "multiple-choice",
      title: "Living or Non-Living?",
      teacherPrompt:
        "Which example is living?",
      options: [
        {
          id: "a",
          label: "A mushroom",
          value: "living",
        },
        {
          id: "b",
          label: "A plastic chair",
          value: "non-living",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. A mushroom is a living organism.",
      retryReply:
        "Choose the example that grows and carries out life processes.",
      points: 5,
    }),
    createActivity({
      id: "science-l2-a3",
      type: "case-study",
      title: "Is Fire Alive?",
      teacherPrompt:
        "Fire can grow and spread, but scientists do not classify it as living. Why?",
      acceptedAnswers: [
        "it has no cells",
        "it does not reproduce biologically",
        "it does not carry out all life processes",
      ],
      hints: [
        "One feature alone is not enough.",
      ],
      successReply:
        "Correct. Living things share a complete set of biological characteristics.",
      points: 10,
    }),
    createActivity({
      id: "science-l2-a4",
      type: "guided-practice",
      title: "Classify the Examples",
      teacherPrompt:
        "Classify a tree, wooden table, seed, cloud and dead leaf as living, once-living or non-living.",
      points: 10,
    }),
    createActivity({
      id: "science-l2-a5",
      type: "review",
      title: "Life Processes",
      teacherPrompt:
        "Name four characteristics of living things.",
      acceptedAnswers: [
        "growth",
        "reproduction",
        "respiration",
        "movement",
        "sensitivity",
        "nutrition",
        "excretion",
      ],
      successReply:
        "Well done. You can now classify living and non-living things.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "science-foundation-unit-1-lesson-3",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "The Human Body",
  description:
    "Understand how major organ systems work together.",
  objective:
    "The learner will identify major organs and explain how systems cooperate.",
  learningOutcomes: [
    "Identify key organs.",
    "Match organs to body systems.",
    "Explain how systems depend on one another.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "science-l3-a1",
      type: "teach",
      title: "Body Systems Work Together",
      teacherPrompt:
        "The circulatory, respiratory, digestive, nervous and other systems work together to keep the body functioning.",
    }),
    createActivity({
      id: "science-l3-a2",
      type: "example",
      title: "Oxygen Delivery",
      teacherPrompt:
        "The lungs bring oxygen into the body, and the heart and blood vessels carry it to cells.",
    }),
    createActivity({
      id: "science-l3-a3",
      type: "multiple-choice",
      title: "Match the Organ",
      teacherPrompt:
        "Which organ pumps blood around the body?",
      options: [
        {
          id: "a",
          label: "Heart",
          value: "heart",
        },
        {
          id: "b",
          label: "Stomach",
          value: "stomach",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. The heart pumps blood through the circulatory system.",
      retryReply:
        "Choose the organ at the centre of the circulatory system.",
      points: 5,
    }),
    createActivity({
      id: "science-l3-a4",
      type: "case-study",
      title: "Exercise and the Body",
      teacherPrompt:
        "Why do breathing rate and heart rate increase during exercise?",
      acceptedAnswers: [
        "muscles need more oxygen",
        "to remove more carbon dioxide",
        "to deliver more oxygen and nutrients",
      ],
      successReply:
        "Correct. The respiratory and circulatory systems work harder to support active muscles.",
      points: 10,
    }),
    createActivity({
      id: "science-l3-a5",
      type: "review",
      title: "System Connections",
      teacherPrompt:
        "Explain one way two body systems work together.",
      successReply:
        "Excellent. You understand that body systems are interconnected.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "science-foundation-unit-1-lesson-4",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Matter and Changes of State",
  description:
    "Explore solids, liquids, gases and physical changes.",
  objective:
    "The learner will describe states of matter and explain melting, freezing, evaporation and condensation.",
  learningOutcomes: [
    "Compare solids, liquids and gases.",
    "Describe changes of state.",
    "Distinguish reversible physical changes from chemical changes.",
  ],
  estimatedMinutes: 24,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "science-l4-a1",
      type: "teach",
      title: "Particles and States",
      teacherPrompt:
        "Solids keep their shape, liquids flow and take the shape of their container, and gases spread to fill available space.",
    }),
    createActivity({
      id: "science-l4-a2",
      type: "example",
      title: "Water Changes State",
      teacherPrompt:
        "Ice melts into liquid water, and water can evaporate into water vapour. Cooling can reverse these changes.",
    }),
    createActivity({
      id: "science-l4-a3",
      type: "multiple-choice",
      title: "Name the Change",
      teacherPrompt:
        "What is the change from gas to liquid called?",
      options: [
        {
          id: "a",
          label: "Condensation",
          value: "condensation",
        },
        {
          id: "b",
          label: "Freezing",
          value: "freezing",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Condensation changes a gas into a liquid.",
      retryReply:
        "Think about water vapour forming droplets.",
      points: 5,
    }),
    createActivity({
      id: "science-l4-a4",
      type: "case-study",
      title: "Puddle Disappearing",
      teacherPrompt:
        "A puddle becomes smaller on a warm day. What has happened to the water?",
      acceptedAnswers: [
        "it evaporated",
        "it changed into water vapour",
      ],
      successReply:
        "Correct. Heat increased evaporation.",
      points: 10,
    }),
    createActivity({
      id: "science-l4-a5",
      type: "review",
      title: "Reversible Change",
      teacherPrompt:
        "Why is melting ice considered a reversible physical change?",
      acceptedAnswers: [
        "it can freeze again",
        "no new substance is formed",
      ],
      successReply:
        "Well done. You understand common changes of state.",
      points: 5,
    }),
  ],
});

const lesson5 = createLesson({
  id: "science-foundation-unit-1-lesson-5",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "Forces and Motion",
  description:
    "Understand pushes, pulls, gravity, friction and balanced forces.",
  objective:
    "The learner will predict how forces affect the motion of an object.",
  learningOutcomes: [
    "Identify common forces.",
    "Explain friction and gravity.",
    "Recognise balanced and unbalanced forces.",
  ],
  estimatedMinutes: 24,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "science-l5-a1",
      type: "teach",
      title: "Forces Change Motion",
      teacherPrompt:
        "A force is a push or pull. Forces can start, stop, speed up, slow down or change the direction of an object.",
    }),
    createActivity({
      id: "science-l5-a2",
      type: "example",
      title: "Friction",
      teacherPrompt:
        "Friction acts between surfaces and usually opposes motion. Rougher surfaces often produce more friction.",
    }),
    createActivity({
      id: "science-l5-a3",
      type: "multiple-choice",
      title: "Why Does It Stop?",
      teacherPrompt:
        "Why does a rolling ball eventually slow down on the floor?",
      options: [
        {
          id: "a",
          label: "Friction and air resistance",
          value: "friction",
        },
        {
          id: "b",
          label: "It runs out of mass",
          value: "mass",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Friction and air resistance oppose the motion.",
      retryReply:
        "Choose the forces that resist movement.",
      points: 5,
    }),
    createActivity({
      id: "science-l5-a4",
      type: "case-study",
      title: "Balanced Forces",
      teacherPrompt:
        "A book rests on a table without moving. What does this tell us about the forces acting on it?",
      acceptedAnswers: [
        "the forces are balanced",
        "gravity and the support force are equal",
      ],
      successReply:
        "Correct. The forces are balanced, so the motion does not change.",
      points: 10,
    }),
    createActivity({
      id: "science-l5-a5",
      type: "review",
      title: "Force Review",
      teacherPrompt:
        "Give one example each of gravity, friction and a push or pull.",
      successReply:
        "Excellent. You can now explain how forces affect motion.",
      points: 5,
    }),
  ],
});

const lesson6 = createLesson({
  id: "science-foundation-unit-1-lesson-6",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 6,
  title: "Energy and Electricity",
  description:
    "Explore energy transfers, circuits and electrical safety.",
  objective:
    "The learner will identify energy forms and describe a simple electrical circuit.",
  learningOutcomes: [
    "Recognise common energy forms.",
    "Describe a complete circuit.",
    "Identify conductors and insulators.",
    "Apply basic electrical safety.",
  ],
  estimatedMinutes: 25,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson5.id],
  activities: [
    createActivity({
      id: "science-l6-a1",
      type: "teach",
      title: "Energy Changes Form",
      teacherPrompt:
        "Energy can be transferred and transformed. A battery stores chemical energy that may become electrical energy and then light or sound.",
    }),
    createActivity({
      id: "science-l6-a2",
      type: "teach",
      title: "A Complete Circuit",
      teacherPrompt:
        "A simple circuit needs a power source, conducting path and component arranged in a complete loop.",
    }),
    createActivity({
      id: "science-l6-a3",
      type: "multiple-choice",
      title: "Why Is the Bulb Off?",
      teacherPrompt:
        "A circuit has a gap in the wire. What happens?",
      options: [
        {
          id: "a",
          label: "The bulb remains off",
          value: "off",
        },
        {
          id: "b",
          label: "The bulb becomes brighter",
          value: "brighter",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Current cannot flow through an incomplete circuit.",
      retryReply:
        "Think about whether the electrical path is complete.",
      points: 5,
    }),
    createActivity({
      id: "science-l6-a4",
      type: "case-study",
      title: "Conductor or Insulator?",
      teacherPrompt:
        "Why are electrical wires commonly made with metal inside and plastic outside?",
      acceptedAnswers: [
        "metal conducts electricity",
        "plastic insulates",
        "plastic helps protect people from electric shock",
      ],
      successReply:
        "Correct. The metal carries current while the plastic provides insulation.",
      points: 10,
    }),
    createActivity({
      id: "science-l6-a5",
      type: "review",
      title: "Energy Review",
      teacherPrompt:
        "Describe one energy transformation in an everyday device.",
      successReply:
        "Well done. You understand energy transfer and simple circuits.",
      points: 5,
    }),
  ],
});

const lesson7 = createLesson({
  id: "science-foundation-unit-1-lesson-7",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 7,
  title: "Earth, Weather and Space",
  description:
    "Understand Earth's place in space and the causes of day, night and seasons.",
  objective:
    "The learner will explain basic Earth and space patterns.",
  learningOutcomes: [
    "Explain day and night.",
    "Describe Earth's orbit around the Sun.",
    "Distinguish weather from climate.",
    "Recognise major Solar System objects.",
  ],
  estimatedMinutes: 25,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson6.id],
  activities: [
    createActivity({
      id: "science-l7-a1",
      type: "teach",
      title: "Earth in Motion",
      teacherPrompt:
        "Earth rotates on its axis and orbits the Sun. Rotation causes day and night.",
    }),
    createActivity({
      id: "science-l7-a2",
      type: "example",
      title: "Weather and Climate",
      teacherPrompt:
        "Weather describes short-term conditions, while climate describes long-term patterns in a region.",
    }),
    createActivity({
      id: "science-l7-a3",
      type: "multiple-choice",
      title: "What Causes Day and Night?",
      teacherPrompt:
        "Which movement causes day and night?",
      options: [
        {
          id: "a",
          label: "Earth rotating on its axis",
          value: "rotation",
        },
        {
          id: "b",
          label: "The Moon orbiting Earth",
          value: "moon-orbit",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Earth's rotation creates the cycle of day and night.",
      retryReply:
        "Choose Earth's daily spinning movement.",
      points: 5,
    }),
    createActivity({
      id: "science-l7-a4",
      type: "case-study",
      title: "Weather or Climate?",
      teacherPrompt:
        "The statement 'It rained heavily yesterday' describes weather or climate?",
      acceptedAnswers: [
        "weather",
      ],
      successReply:
        "Correct. It describes a short-term condition.",
      points: 10,
    }),
    createActivity({
      id: "science-l7-a5",
      type: "review",
      title: "Space Review",
      teacherPrompt:
        "Explain the difference between rotation and orbit.",
      acceptedAnswers: [
        "rotation is spinning and orbit is moving around another object",
      ],
      successReply:
        "Excellent. You understand several important Earth and space patterns.",
      points: 5,
    }),
  ],
});

const lesson8 = createLesson({
  id: "science-foundation-unit-1-lesson-8",
  academy: "science",
  programmeId: "science-foundation",
  courseId: "science-foundation-course",
  unitId: "science-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 8,
  title: "Design a Scientific Investigation",
  description:
    "Apply scientific thinking to plan, conduct and evaluate an investigation.",
  objective:
    "The learner will design a fair test and explain how evidence would be collected.",
  learningOutcomes: [
    "Identify independent, dependent and controlled variables.",
    "Plan a repeatable method.",
    "Choose suitable measurements.",
    "Evaluate reliability and limitations.",
  ],
  estimatedMinutes: 30,
  completionPoints: 50,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson7.id],
  activities: [
    createActivity({
      id: "science-l8-a1",
      type: "teach",
      title: "Variables in a Fair Test",
      teacherPrompt:
        "The independent variable is what you change, the dependent variable is what you measure, and controlled variables are kept the same.",
    }),
    createActivity({
      id: "science-l8-a2",
      type: "multiple-choice",
      title: "Identify the Variable",
      teacherPrompt:
        "In an investigation of how light affects plant growth, what is the independent variable?",
      options: [
        {
          id: "a",
          label: "Amount of light",
          value: "light",
        },
        {
          id: "b",
          label: "Plant height",
          value: "height",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. The amount of light is deliberately changed.",
      retryReply:
        "Choose the factor the investigator changes.",
      points: 5,
    }),
    createActivity({
      id: "science-l8-a3",
      type: "case-study",
      title: "Improve Reliability",
      teacherPrompt:
        "Why should an investigation be repeated several times?",
      acceptedAnswers: [
        "to improve reliability",
        "to identify unusual results",
        "to calculate an average",
      ],
      successReply:
        "Correct. Repeating measurements helps make conclusions more reliable.",
      points: 10,
    }),
    createActivity({
      id: "science-l8-a4",
      type: "project",
      title: "Plan Your Investigation",
      teacherPrompt:
        "Design a fair test to investigate how water temperature affects the time taken for sugar to dissolve.",
      learnerInstruction:
        "Include a question, prediction, variables, equipment, method, measurements, safety and conclusion plan.",
      hints: [
        "Keep the amount of water and sugar the same.",
      ],
      points: 20,
    }),
    createActivity({
      id: "science-l8-a5",
      type: "assessment",
      title: "Foundation Assessment",
      teacherPrompt:
        "Explain scientific investigation, life processes, body systems, matter, forces, energy, Earth and space using one example for each.",
      successReply:
        "Fantastic. You have completed the Science Foundation course.",
      points: 10,
    }),
  ],
});

export const scienceFoundationCourse =
  createCourse({
    id: "science-foundation-course",
    programmeId: "science-foundation",
    stage: "foundation",
    title: "Science Foundation",
    description:
      "Build a broad foundation in biology, chemistry, physics, Earth science and scientific investigation.",
    learningOutcomes: [
      "Think and investigate scientifically.",
      "Understand living systems.",
      "Describe matter and physical change.",
      "Explain forces and energy.",
      "Recognise Earth and space patterns.",
      "Design a fair test.",
    ],
    estimatedHours: 5,
    units: [
      createUnit({
        id: "science-foundation-unit-1",
        courseId: "science-foundation-course",
        unitNumber: 1,
        title: "Explore the Natural World",
        description:
          "Develop scientific knowledge through questions, evidence and practical reasoning.",
        learningOutcomes: [
          "Use evidence.",
          "Explain natural processes.",
          "Apply scientific concepts.",
          "Plan investigations.",
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
