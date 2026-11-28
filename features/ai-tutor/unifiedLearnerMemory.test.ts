import { describe, expect, it } from "vitest";
import { emptyMemory, parseMemory, recordMemory, reviewSuggestions } from "./unifiedLearnerMemory";
import { buildUnifiedTutorPrompt, validateUnifiedChat } from "./unifiedConversation";
const at="2026-11-27T10:00:00.000Z";
const later="2026-11-28T10:00:00.000Z";
const finance={kind:"general",subject:"financial-literacy"} as const;
const spanish={kind:"language",language:"spanish",level:"foundation"} as const;
describe("unified memory",()=>{
  it("separates financial literacy and language activity",()=>{
    const first=recordMemory(emptyMemory(),finance,"simplify",at);
    const next=recordMemory(first,spanish,"practise",at);
    expect(next.entries).toHaveLength(2);
    expect(next.entries[0]).toMatchObject({sessions:1,practice:1,help:0});
    expect(next.entries[1]).toMatchObject({sessions:1,practice:0,help:1});
    expect(parseMemory(next)).toEqual(next);
    expect(reviewSuggestions(next,at)).toEqual([]);
    expect(reviewSuggestions(next,later)[0].context).toEqual(finance);
  });
  it("deduplicates repeated or stale events and rejects corrupt records",()=>{
    const first=recordMemory(emptyMemory(),finance,"teach",at);
    expect(recordMemory(first,finance,"teach",at)).toEqual(first);
    expect(parseMemory({version:1,entries:[first.entries[0],first.entries[0]]})).toBeNull();
    expect(parseMemory({version:1,entries:[{...first.entries[0],sessions:-1}]})).toBeNull();
  });
  it("strips raw conversation and personal profile fields",()=>{
    const first=recordMemory(emptyMemory(),finance,"teach",at);
    expect(parseMemory({version:1,entries:[{...first.entries[0],message:"private text",name:"example"}]})).toEqual(first);
  });
  it("supports financial education without personalised recommendations",()=>{
    const input=validateUnifiedChat({context:finance,messages:[{role:"user",content:"Teach me compound interest"}]});
    expect(input).not.toBeNull();
    expect(buildUnifiedTutorPrompt(input!)).toContain("Do not recommend specific investments");
  });
});
