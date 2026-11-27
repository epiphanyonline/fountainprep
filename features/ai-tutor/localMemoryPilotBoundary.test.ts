import {describe,it,expect,vi} from "vitest";
import {handleLocalMemoryPilot} from "./localMemoryPilotBoundary";
const settings={nodeEnv:"development",enabled:"true",url:"http://127.0.0.1:54321"};
const url="http://localhost:3000/api/ai-tutor-preview/memory-pilot";
const login=()=>vi.fn(async()=>({userId:"owner",token:"synthetic.token",enrolled:true}));
function post(email="learner@example.test",origin="http://localhost:3000"){
 return new Request(url,{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify({email,password:"test-password"})});
}
describe("standalone memory pilot",()=>{
 it("does not expose login or HTML in production",async()=>{
  const auth=login();
  for(const patch of [{nodeEnv:"production"},{vercel:"1"},{enabled:"false"},{url:"https://example.supabase.co"}]){
   expect((await handleLocalMemoryPilot(new Request(url),{...settings,...patch},["owner"],auth)).status).toBe(404);
   expect((await handleLocalMemoryPilot(post(),{...settings,...patch},["owner"],auth)).status).toBe(404);
  }
  expect(auth).not.toHaveBeenCalled();
 });
 it("serves isolated HTML with a nonce and no caching",async()=>{
  const response=await handleLocalMemoryPilot(new Request(url),settings,[],login());
  expect(response.status).toBe(200);
  expect(response.headers.get("content-security-policy")).toContain("connect-src 'self'");
  expect(response.headers.get("cache-control")).toBe("no-store");
  const html=await response.text();
  expect(html).toContain("Saved learning progress");
  expect(html).not.toContain("correctId");
  expect(html).not.toContain("facebook.net");
 });
 it("rejects external origins and real email addresses before login",async()=>{
  const auth=login();
  expect((await handleLocalMemoryPilot(post("learner@example.test","https://other.test"),settings,["owner"],auth)).status).toBe(403);
  expect((await handleLocalMemoryPilot(post("learner@example.com"),settings,["owner"],auth)).status).toBe(400);
  expect(auth).not.toHaveBeenCalled();
 });
 it("returns a token only for allowed enrolled users",async()=>{
  const auth=login();
  expect((await handleLocalMemoryPilot(post(),settings,["other"],auth)).status).toBe(403);
  auth.mockResolvedValueOnce({userId:"owner",token:"synthetic.token",enrolled:false});
  expect((await handleLocalMemoryPilot(post(),settings,["owner"],auth)).status).toBe(403);
  const result=await handleLocalMemoryPilot(post(),settings,["owner"],auth);
  expect(await result.json()).toEqual({token:"synthetic.token"});
 });
});
