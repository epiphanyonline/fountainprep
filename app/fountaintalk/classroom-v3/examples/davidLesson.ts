import type { LivingLesson } from "../engine/types";

export const davidLesson: LivingLesson = {
  id: "bible-david-01", moduleId: "bible-david", title: "Before the Giant", summary: "Meet David before the battlefield and discover how courage is formed long before it is tested.", estimatedMinutes: 26,
  learningObjectives: ["Explain David's early formation", "Identify courage as preparation plus conviction", "Reflect on unseen practice"], access: { tier: "explorer", previewAllowed: true },
  scenes: [
    { id:"david-sunrise",kind:"story",title:"Before anyone knew his name",eyebrow:"Bethlehem · Dawn",displayText:"A young shepherd begins another ordinary day.",narration:"Long before the battlefield, David learned responsibility where almost nobody was watching.",durationMs:9000,camera:"wide",transition:"fade",background:{id:"bethlehem",gradient:"linear-gradient(180deg,#f59e0b,#1e293b)",alt:"Sunrise over Bethlehem"},actors:[{id:"david",assetId:"/images/stories/david/david-young.png",displayName:"David",position:"right",animation:"walk",emotion:"curious"}],memoryTags:["david","preparation","responsibility"]},
    { id:"david-discovery",kind:"discovery",title:"What do you notice?",eyebrow:"Discovery moment",displayText:"The work is quiet. The responsibility is not.",narration:"Look closely before I explain. What might a shepherd learn that could matter later in life?",durationMs:12000,camera:"reflection",transition:"dissolve",background:{id:"pasture",gradient:"linear-gradient(160deg,#14532d,#0f172a)"},interaction:{id:"discover-shepherd",mode:"reflection",prompt:"What qualities could shepherding develop?",skippable:true},memoryTags:["discovery","leadership"]},
    { id:"david-memory",kind:"reflection",title:"The hidden classroom",eyebrow:"Memory moment",displayText:"Preparation often looks ordinary while it is happening.",narration:"Remember this scene. Later, when David faces Goliath, we will return here.",durationMs:8000,camera:"close",transition:"zoom",background:{id:"field",gradient:"linear-gradient(135deg,#365314,#172554)"},memoryTags:["flashback-anchor","preparation"]}
  ]
};
