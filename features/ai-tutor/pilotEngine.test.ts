import {describe,expect,it} from "vitest";
import {
  TUTOR_TRACKS,moveTutorDemo,restoreTutorDemo,startTutorDemo,
  tutorOutcome,tutorQuestion,type TutorTrackId,
} from "./pilotEngine";

const tracks=Object.keys(TUTOR_TRACKS) as TutorTrackId[];

describe("Fountain Prep adaptive tutoring walkthrough",()=>{
  it("offers subject-specific original diagnostic, practice and reteach questions",()=>{
    for(const id of tracks){
      const track=TUTOR_TRACKS[id];
      expect(track.welcome.length).toBeGreaterThan(30);
      expect(track.guidedExample.length).toBeGreaterThan(30);
      expect(track.simplerExplanation.length).toBeGreaterThan(30);
      expect(new Set([track.diagnostic.id,track.practice.id,track.retry.id]).size).toBe(3);
      for(const q of [track.diagnostic,track.practice,track.retry]){
        expect(q.options).toHaveLength(4);
        expect(q.options.some(o=>o.id===q.correctId)).toBe(true);
        expect(q.explanation.length).toBeGreaterThan(30);
      }
    }
  });
  it("advances a learner with sound diagnostic understanding to practice",()=>{
    for(const track of tracks){
      const initial=startTutorDemo(track);
      const right=TUTOR_TRACKS[track].diagnostic.correctId;
      const progressed=moveTutorDemo(initial,{type:"answer",choiceId:right});
      expect(progressed.step).toBe("practice");
      expect(progressed.answers.diagnostic).toBe(right);
      expect(tutorQuestion(progressed)?.id).toBe(TUTOR_TRACKS[track].practice.id);
      const succeeded=moveTutorDemo(progressed,{type:"answer",choiceId:TUTOR_TRACKS[track].practice.correctId});
      expect(tutorOutcome(succeeded)).toBe("demonstrated");
    }
  });
  it("provides instruction when learner is confused or makes a diagnostic mistake",()=>{
    const initial=startTutorDemo("jamb-maths");
    const taught=moveTutorDemo(initial,{type:"teach"});
    expect(taught.step).toBe("lesson");
    expect(taught.explainedFirst).toBe(true);
    expect(moveTutorDemo(taught,{type:"continue"}).step).toBe("practice");
    const incorrect=moveTutorDemo(initial,{type:"answer",choiceId:"a"});
    expect(incorrect.step).toBe("lesson");
    expect(incorrect.feedback).toMatch(/explain/i);
  });
  it("reteaches after an incorrect answer then tests a new application",()=>{
    const taught=moveTutorDemo(startTutorDemo("jamb-maths"),{type:"teach"});
    const practice=moveTutorDemo(taught,{type:"continue"});
    const wrong=moveTutorDemo(practice,{type:"answer",choiceId:"a"});
    expect(wrong.step).toBe("reteach");
    const retry=moveTutorDemo(wrong,{type:"continue"});
    expect(retry.step).toBe("retry");
    expect(tutorQuestion(retry)?.id).not.toBe(TUTOR_TRACKS["jamb-maths"].practice.id);
    const improved=moveTutorDemo(retry,{type:"answer",choiceId:"b"});
    expect(improved.step).toBe("complete");
    expect(tutorOutcome(improved)).toBe("improving");
  });
  it("does not claim mastery when learner still needs more practice",()=>{
    const initial=startTutorDemo("jamb-maths");
    const practice=moveTutorDemo(
      moveTutorDemo(initial,{type:"teach"}),{type:"continue"});
    const reteach=moveTutorDemo(practice,{type:"answer",choiceId:"a"});
    const retry=moveTutorDemo(reteach,{type:"continue"});
    const finished=moveTutorDemo(retry,{type:"answer",choiceId:"a"});
    expect(tutorOutcome(finished)).toBe("needs-practice");
    expect(moveTutorDemo(finished,{type:"answer",choiceId:"b"})).toBe(finished);
  });
  it("rejects arbitrary answer options and unexpected progression",()=>{
    const initial=startTutorDemo("jamb-english");
    expect(moveTutorDemo(initial,{type:"answer",choiceId:"not-an-option"})).toBe(initial);
    expect(moveTutorDemo(initial,{type:"continue"})).toBe(initial);
  });
  it("can restore sample-only progress without trusting malformed browser content",()=>{
    const progressed=moveTutorDemo(startTutorDemo("ielts-reading"),{type:"answer",choiceId:"a"});
    expect(restoreTutorDemo(JSON.parse(JSON.stringify(progressed)))).toEqual(progressed);
    expect(restoreTutorDemo({version:1,track:"not-exam",step:"diagnostic",answers:{},explainedFirst:false,feedback:""})).toBeNull();
    expect(restoreTutorDemo({...progressed,feedback:"x".repeat(1000)})).toBeNull();
    expect(restoreTutorDemo({...progressed,answers:{admin:"b"}})).toBeNull();
  });
});
