import {describe,it,expect,vi} from "vitest";
import {handleVision} from "./visionBoundary";
const settings={environment:"preview",branch:"feature/unified-ai-tutor",enabled:true,accessVerified:true,budgetApproved:true};
function request(){return new Request("https://example.test/api/vision",{method:"POST",headers:{origin:"https://example.test","content-type":"image/png","x-learning-task":"Summarise","x-learning-context":JSON.stringify({kind:"homework",subject:"mathematics"})},body:new Uint8Array([137,80,78,71,13,10,26,10])});}
describe("vision transport",()=>{
 it("blocks disabled and unauthorised requests without provider calls",async()=>{const p=vi.fn(async()=>"answer");expect((await handleVision(request(),{...settings,enabled:false},async()=>true,async()=>true,p)).status).toBe(404);expect((await handleVision(request(),settings,async()=>false,async()=>true,p)).status).toBe(403);expect(p).not.toHaveBeenCalled();});
 it("reserves quota before processing",async()=>{const p=vi.fn(async()=>"answer");expect((await handleVision(request(),settings,async()=>true,async()=>false,p)).status).toBe(429);expect(p).not.toHaveBeenCalled();const r=await handleVision(request(),settings,async()=>true,async()=>true,p);expect(r.status).toBe(200);expect(p).toHaveBeenCalledTimes(1);});
});
