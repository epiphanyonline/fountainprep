import {describe,it,expect,vi} from "vitest";
import {handleMemoryRequest,type PilotStore} from "./unifiedMemoryBoundary";
const url="http://localhost:3000/api/ai-tutor-preview/memory";
const settings={nodeEnv:"development",enabled:"true",url:"http://127.0.0.1:54321"};
const body={context:{kind:"general",subject:"financial-literacy"},questionId:"fl-1",choiceId:"a",correct:true,userId:"other"};
function req(method="GET",token="valid",origin="http://localhost:3000"){
 return new Request(url,{method,headers:{authorization:"Bearer "+token,origin,"content-type":"application/json"},...(method==="POST"?{body:JSON.stringify(body)}:{})});
}
function fixture(){
 const store={authenticate:vi.fn(async(token:string)=>token==="valid"?"owner":null),enrollment:vi.fn(async(_id:string)=>"enrollment"),read:vi.fn(async()=>({attempts:[],exchanges:[],limited:false})),attempt:vi.fn(async()=>{}),revoke:vi.fn(async()=>{})} satisfies PilotStore;
 return {store,make:vi.fn(()=>store)};
}
describe("local memory boundary",()=>{
 it("never initializes database in production or with hosted URLs",async()=>{
  const {make}=fixture();
  for(const patch of [{nodeEnv:"production"},{vercel:"1"},{url:"https://example.supabase.co"},{enabled:"false"}])
   expect((await handleMemoryRequest(req(),{...settings,...patch},make,["owner"])).status).toBe(404);
  expect(make).not.toHaveBeenCalled();
 });
 it("rejects unverified sessions, accounts and cross-origin writes",async()=>{
  const {make,store}=fixture();
  expect((await handleMemoryRequest(req("GET","bad"),settings,make,["owner"])).status).toBe(401);
  expect((await handleMemoryRequest(req(),settings,make,["other"])).status).toBe(403);
  expect((await handleMemoryRequest(req("POST","valid","http://other"),settings,make,["owner"])).status).toBe(403);
  expect(store.read).not.toHaveBeenCalled();
  expect(store.attempt).not.toHaveBeenCalled();
 });
 it("grades server-side and binds access to authenticated identity",async()=>{
  const {make,store}=fixture();
  const result=await handleMemoryRequest(req("POST"),settings,make,["owner"]);
  expect(result.status).toBe(200);
  expect(store.attempt).toHaveBeenCalledWith("owner","enrollment",{context_key:"general:financial-literacy",question_id:"fl-1",correct:false});
  expect(store.read).toHaveBeenCalledWith("owner","enrollment");
  expect(result.headers.get("cache-control")).toBe("no-store");
 });
 it("revokes only the authenticated enrollment",async()=>{
  const {make,store}=fixture();
  expect((await handleMemoryRequest(req("DELETE"),settings,make,["owner"])).status).toBe(200);
  expect(store.revoke).toHaveBeenCalledWith("owner","enrollment");
 });
 it("suppresses snapshots when enrollment changes",async()=>{
  const {make,store}=fixture();
  store.enrollment.mockResolvedValueOnce("enrollment").mockResolvedValueOnce("replacement");
  expect((await handleMemoryRequest(req(),settings,make,["owner"])).status).toBe(409);
 });
});
