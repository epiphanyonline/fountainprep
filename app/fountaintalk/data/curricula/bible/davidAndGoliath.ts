import type { AcademyLesson } from "../../../types/academy";

export const davidAndGoliathLesson: AcademyLesson = {
  "id": "bible-david-goliath",
  "title": "David and Goliath",
  "objective": "Understand David's background, relationships, preparation, faith and courageous action in 1 Samuel 16–17.",
  "completionPoints": 60,
  "estimatedMinutes": 28,
  "classPromise": "By the end of this class, you will know who David was before the battle, why he came to the camp, how he met King Saul, what prepared him for Goliath and why the story is about more than defeating a giant.",
  "learningOutcomes": [
    "Describe David's family background, work and social status",
    "Explain David's relationship with Samuel, Saul and his brothers",
    "Reconstruct the events leading to the battle",
    "Distinguish courageous faith from carelessness",
    "Apply the story's lessons responsibly"
  ],
  "steps": [
    {
      "id": "david-01-opening",
      "title": "Before the giant",
      "kind": "welcome",
      "responseType": "none",
      "teacherPrompt": "Welcome, {learnerName}. Many people remember David only as the boy who defeated Goliath. Today we will first understand his family, work, status, relationships, preparation and calling.",
      "displayText": "The public victory began with years of hidden preparation.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "Before the giant",
        "items": [
          "Family",
          "Work",
          "Character",
          "Preparation",
          "Faith",
          "Calling"
        ]
      },
      "ayoPose": "explain",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-02-setting",
      "title": "Israel needed leadership",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Israel was a young kingdom. Saul was still king, but repeated disobedience had damaged his relationship with God. Samuel was sent to identify the person God had chosen for the future.",
      "displayText": "Saul still wore the crown, but a future king had been chosen.",
      "visual": {
        "type": "comparison",
        "emoji": "📖",
        "title": "Israel needed leadership",
        "items": [
          "Saul: reigning king",
          "David: future king",
          "The nation did not yet know"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-03-bethlehem",
      "title": "David came from Bethlehem",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David lived in Bethlehem in Judah. His father was Jesse, and David was the youngest of eight sons. Older sons usually carried greater public importance, while the youngest often received ordinary duties.",
      "displayText": "David was the youngest son in a large family.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David came from Bethlehem",
        "items": [
          "Bethlehem",
          "Judah",
          "Jesse",
          "Eight sons",
          "David: youngest"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-04-shepherd",
      "title": "His status was ordinary",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "David was not introduced as a prince or soldier. He was a shepherd. Shepherding required long hours, responsibility, patience, protection and watchfulness when nobody was applauding.",
      "displayText": "His first leadership role was caring for sheep.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "His status was ordinary",
        "items": [
          "Guide",
          "Feed",
          "Protect",
          "Search",
          "Watch",
          "Stay responsible"
        ]
      },
      "ayoPose": "explain",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-05-overlooked",
      "title": "He was initially overlooked",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "When Samuel came to Jesse's house, the older sons were presented first. David was not even in the room; he was with the sheep. Samuel learned that God was looking at the heart, not merely appearance or height.",
      "displayText": "David was absent until Samuel asked whether another son remained.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "He was initially overlooked",
        "items": [
          "Older sons presented",
          "None chosen",
          "David called from the field"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-06-anointed",
      "title": "Samuel anointed David",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Samuel anointed David in front of his brothers. Yet David did not become king immediately. He returned to ordinary life. Calling came before position, and promise came before fulfilment.",
      "displayText": "Chosen did not mean instantly promoted.",
      "visual": {
        "type": "timeline",
        "emoji": "📖",
        "title": "Samuel anointed David",
        "items": [
          "Chosen",
          "Anointed",
          "Returns to work",
          "Learns",
          "Waits"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-07-musician",
      "title": "David was also a musician",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David became known as a skilful musician. When Saul was troubled, servants recommended David because he played the lyre well. His developed skill opened the door to the royal court.",
      "displayText": "A practised skill created an opportunity.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David was also a musician",
        "items": [
          "Practised music",
          "Built reputation",
          "Recommended to Saul",
          "Served in palace"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-08-saul",
      "title": "David and King Saul",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Saul appreciated David's service and made him an armour-bearer for a time. David already had contact with the king's household before Goliath, but he held no royal authority of his own.",
      "displayText": "David served the king before challenging the giant.",
      "visual": {
        "type": "comparison",
        "emoji": "📖",
        "title": "David and King Saul",
        "items": [
          "Saul: king",
          "David: servant",
          "Public authority",
          "Private calling"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-09-war",
      "title": "The Philistines gathered for war",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "The Philistines and Israelites faced each other across the Valley of Elah. Instead of beginning with a full battle, the Philistines sent out a champion named Goliath.",
      "displayText": "Two armies faced each other across a valley.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "The Philistines gathered for war",
        "items": [
          "Israelite hill",
          "Valley",
          "Philistine hill",
          "Goliath steps forward"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-10-goliath",
      "title": "Who was Goliath?",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Goliath was a Philistine warrior from Gath, presented as exceptionally large, experienced and heavily armed. His equipment and reputation were designed to intimidate before the fight began.",
      "displayText": "He was a trained champion with military and psychological advantage.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "Who was Goliath?",
        "items": [
          "Size",
          "Experience",
          "Armour",
          "Weapons",
          "Reputation"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-11-challenge",
      "title": "Forty days of fear",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Morning and evening, Goliath challenged Israel to send one man to fight him. His words mocked Israel and defied the living God. Fear deepened because the challenge was repeated and unanswered.",
      "displayText": "For forty days, nobody answered.",
      "visual": {
        "type": "timeline",
        "emoji": "📖",
        "title": "Forty days of fear",
        "items": [
          "Morning challenge",
          "Fear",
          "Evening challenge",
          "No response"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-12-brothers",
      "title": "David's brothers were soldiers",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David's three oldest brothers were with Saul's army. Jesse sent David to carry food, check on them and bring back news. David did not arrive seeking fame; he came on a family errand.",
      "displayText": "An ordinary errand brought David to the crisis.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David's brothers were soldiers",
        "items": [
          "Carry food",
          "Check brothers",
          "Bring news"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-13-arrival",
      "title": "David reached the camp",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David left the sheep with a keeper, delivered the supplies and found his brothers. He heard Goliath's challenge and saw the soldiers retreat in fear.",
      "displayText": "He completed his responsibilities before entering the conflict.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David reached the camp",
        "items": [
          "Sheep left safely",
          "Supplies delivered",
          "Challenge heard"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-14-perspective",
      "title": "David saw the problem differently",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "The soldiers saw Goliath's size, armour and experience. David saw those realities too, but interpreted them through faith. He asked why this man was being allowed to defy the armies of the living God.",
      "displayText": "Same giant. Different interpretation.",
      "visual": {
        "type": "comparison",
        "emoji": "📖",
        "title": "David saw the problem differently",
        "items": [
          "Army: focus on threat",
          "David: focus on God and calling"
        ]
      },
      "ayoPose": "explain",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-15-eliab",
      "title": "Eliab criticised David",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David's oldest brother Eliab accused him of pride and wrong motives. David was misunderstood by someone close to him, but he did not abandon the issue. He continued asking questions.",
      "displayText": "Courage sometimes begins while being misunderstood.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "Eliab criticised David",
        "items": [
          "Did not attack Eliab",
          "Stayed focused",
          "Continued seeking clarity"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-16-reported",
      "title": "David's words reached Saul",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "People heard David's questions and reported them to Saul. David was summoned before the king and offered to fight Goliath.",
      "displayText": "An ordinary messenger received an audience with the king.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David's words reached Saul",
        "items": [
          "Questions heard",
          "Words reported",
          "David summoned"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-17-doubt",
      "title": "Saul thought David was unqualified",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Saul pointed out that David was young while Goliath had been a warrior from his youth. From a conventional military perspective, the objection made sense.",
      "displayText": "The king measured visible credentials.",
      "visual": {
        "type": "comparison",
        "emoji": "📖",
        "title": "Saul thought David was unqualified",
        "items": [
          "Young shepherd",
          "Veteran warrior",
          "No armour",
          "Heavy equipment"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-18-hidden",
      "title": "David described hidden preparation",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David told Saul how he had protected sheep from lions and bears. These were not public performances. They were dangerous moments of responsibility that developed courage and skill.",
      "displayText": "Private responsibility had prepared him for public pressure.",
      "visual": {
        "type": "timeline",
        "emoji": "📖",
        "title": "David described hidden preparation",
        "items": [
          "Threat appears",
          "David pursues",
          "Sheep rescued",
          "Danger confronted"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-19-memory",
      "title": "David remembered God's help",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "David said the Lord who delivered him from the lion and bear would deliver him from the Philistine. Past faithfulness became evidence for present trust.",
      "displayText": "Memory strengthened faith.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David remembered God's help",
        "items": [
          "Recall past danger",
          "Recall God's help",
          "Interpret present challenge",
          "Act"
        ]
      },
      "ayoPose": "explain",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-20-permission",
      "title": "Saul gave permission",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "After hearing David's testimony, Saul gave him permission to fight. David did not seize authority; he explained his experience and accepted responsibility within the king's decision.",
      "displayText": "Courage operated with responsibility and permission.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "Saul gave permission",
        "items": [
          "Explained experience",
          "Stated faith",
          "Received permission"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-21-armour",
      "title": "David removed Saul's armour",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Saul offered David royal armour and a sword. David tried them but was not accustomed to them, so he removed them. Unfamiliar equipment could hinder his movement.",
      "displayText": "He refused to imitate another person's method.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David removed Saul's armour",
        "items": [
          "Armour: impressive",
          "David: untrained in it",
          "Sling: familiar"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-22-tools",
      "title": "David chose familiar tools",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David selected five smooth stones, carried his shepherd's bag and used a sling he knew well. Faith did not replace preparation, skill or wise tool selection.",
      "displayText": "He entered with tools he understood.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David chose familiar tools",
        "items": [
          "Staff",
          "Five stones",
          "Bag",
          "Sling",
          "Practice"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-23-approach",
      "title": "Goliath despised David",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "Goliath mocked David's youth and appearance. He assumed visible status determined capacity and expected fear before the battle began.",
      "displayText": "Goliath judged by appearance and reputation.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "Goliath despised David",
        "items": [
          "Young means weak",
          "No armour means helpless",
          "Reputation guarantees victory"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-24-declaration",
      "title": "David named his confidence",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "David answered that Goliath came with weapons, but he came in the name of the Lord. He declared that the battle belonged to God and that deliverance was not ultimately controlled by human weapons.",
      "displayText": "His confidence was theological, not merely psychological.",
      "visual": {
        "type": "comparison",
        "emoji": "📖",
        "title": "David named his confidence",
        "items": [
          "Goliath: weapons",
          "David: God, calling and tested faith"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-25-action",
      "title": "David ran toward the battle",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "As Goliath moved forward, David ran toward the battle line, placed a stone in his sling and released it. The stone struck Goliath in the forehead, and the giant fell.",
      "displayText": "Faith produced decisive action.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "David ran toward the battle",
        "items": [
          "Runs forward",
          "Loads sling",
          "Releases",
          "Goliath falls"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-26-aftermath",
      "title": "The battle changed",
      "kind": "story",
      "responseType": "none",
      "teacherPrompt": "After Goliath fell, the Philistines fled and Israel pursued. One person's courageous action changed the emotional direction of an entire army.",
      "displayText": "Private preparation became public leadership.",
      "visual": {
        "type": "timeline",
        "emoji": "📖",
        "title": "The battle changed",
        "items": [
          "Israel retreats",
          "David acts",
          "Goliath falls",
          "Israel advances"
        ]
      },
      "ayoPose": "point-slide",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-27-meaning",
      "title": "The story is bigger than a giant",
      "kind": "concept",
      "responseType": "none",
      "teacherPrompt": "This story is not permission for reckless risk or a promise that every problem ends instantly. It teaches God's faithfulness, responsible preparation, tested skill, courage under pressure and refusal to let intimidation define what is possible.",
      "displayText": "Biblical courage is not careless confidence.",
      "visual": {
        "type": "cards",
        "emoji": "📖",
        "title": "The story is bigger than a giant",
        "items": [
          "Trust God",
          "Prepare",
          "Use skill",
          "Respect authority",
          "Act responsibly"
        ]
      },
      "ayoPose": "explain",
      "durationSeconds": 60,
      "autoAdvance": true,
      "microphoneEnabled": false,
      "allowRaiseHand": true
    },
    {
      "id": "david-28-profile-quiz",
      "title": "Who was David before the battle?",
      "kind": "quiz",
      "responseType": "choice",
      "teacherPrompt": "Which description best represents David before he fought Goliath?",
      "question": "Which profile is most accurate?",
      "choices": [
        {
          "id": "a",
          "label": "A young shepherd, musician and anointed future king with tested experience"
        },
        {
          "id": "b",
          "label": "An experienced general who already ruled Israel"
        },
        {
          "id": "c",
          "label": "A stranger who had never met Saul and had no responsibilities"
        }
      ],
      "acceptedAnswers": [
        "A young shepherd, musician and anointed future king with tested experience",
        "a"
      ],
      "hint": "Remember Bethlehem, the sheep, the lyre and Samuel's anointing.",
      "explanation": "David was a young shepherd and musician, already anointed for a future role but not yet king.",
      "ayoPose": "listen",
      "autoAdvance": false,
      "microphoneEnabled": true,
      "allowRaiseHand": true,
      "points": 10
    },
    {
      "id": "david-29-meaning-quiz",
      "title": "What did David combine?",
      "kind": "quiz",
      "responseType": "choice",
      "teacherPrompt": "Which answer best describes David's approach?",
      "question": "What did David combine?",
      "choices": [
        {
          "id": "a",
          "label": "Faith, preparation, tested skill and courageous action"
        },
        {
          "id": "b",
          "label": "Pride, borrowed armour and careless risk"
        },
        {
          "id": "c",
          "label": "Avoidance, excuses and dependence on reputation"
        }
      ],
      "acceptedAnswers": [
        "Faith, preparation, tested skill and courageous action",
        "a"
      ],
      "hint": "Think about the sheep, Saul's permission, the stones and the sling.",
      "explanation": "David trusted God while using tested experience, preparation and responsible action.",
      "ayoPose": "listen",
      "autoAdvance": false,
      "microphoneEnabled": true,
      "allowRaiseHand": true,
      "points": 10
    },
    {
      "id": "david-30-reflection",
      "title": "Your hidden preparation",
      "kind": "reflection",
      "responseType": "text",
      "teacherPrompt": "Think of one responsibility, skill or difficult experience that may be preparing you for a future challenge.",
      "question": "What hidden preparation may help you face a future challenge?",
      "acceptedAnswers": [
        "practice",
        "practise",
        "prepare",
        "pray",
        "learn",
        "help",
        "ask",
        "responsibility",
        "skill"
      ],
      "hint": "Name the skill or experience, then identify one responsible next action.",
      "explanation": "Courage often grows through ordinary faithfulness before a public challenge appears.",
      "ayoPose": "listen",
      "autoAdvance": false,
      "microphoneEnabled": true,
      "allowRaiseHand": true,
      "points": 20
    },
    {
      "id": "david-31-summary",
      "title": "The shepherd who was being prepared",
      "kind": "summary",
      "responseType": "none",
      "teacherPrompt": "David was the youngest son of Jesse, a shepherd from Bethlehem, a musician who served Saul, and the anointed future king who still had to wait. He came to the camp on an ordinary family errand. He remembered God's help, explained his experience, received permission, rejected unfamiliar armour, used a practised skill and acted decisively. The stone was released in a moment, but the person was formed over years.",
      "displayText": "The stone was released in a moment. The person was formed over years.",
      "visual": {
        "type": "timeline",
        "emoji": "🎓",
        "title": "David's journey",
        "items": [
          "Shepherd",
          "Anointed",
          "Musician",
          "Servant",
          "Messenger",
          "Champion",
          "Future king"
        ]
      },
      "ayoPose": "celebrate",
      "durationSeconds": 75,
      "autoAdvance": false,
      "microphoneEnabled": false,
      "allowRaiseHand": true,
      "points": 20
    }
  ]
};
