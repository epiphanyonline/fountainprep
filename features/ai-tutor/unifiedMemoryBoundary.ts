import { buildSnapshot, localMemoryAllowed, parseAttempt, type AttemptRow, type ExchangeRow } from "./unifiedMemoryPersistence";
type Settings=Parameters<typeof localMemoryAllowed>[0];
export type PilotStore={
  authenticate(token:string):Promise<string|null>;
  enrollment(userId:string):Promise<string|null>;
  read(userId:string,enrollmentId:string):Promise<{attempts:AttemptRow[];exchanges:ExchangeRow[];limited:boolean}>;
  attempt(userId:string,enrollmentId:string,row:AttemptRow):Promise<void>;
  revoke(userId:string,enrollmentId:string):Promise<void>;
};
const reply=(status:number,body:object)=>Response.json(body,{status,headers:{"Cache-Control":"no-store","Vary":"Authorization"}});
export async function readSmallJson(request:Request):Promise<unknown>{
  if(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json")throw Error("type");
  const reader=request.body?.getReader();
  if(!reader)throw Error("body");
  let size=0,text="";
  const decoder=new TextDecoder("utf-8",{fatal:true});
  try{
    for(;;){
      const {done,value}=await reader.read();
      if(done)break;
      size+=value.byteLength;
      if(size>4096){await reader.cancel().catch(()=>undefined);throw Error("size");}
      text+=decoder.decode(value,{stream:true});
    }
    return JSON.parse(text+decoder.decode());
  }finally{reader.releaseLock();}
}
/** Local synthetic accounts only. No browser-supplied identity, score, or enrollment. */
export async function handleMemoryRequest(request:Request,settings:Settings,makeStore:()=>PilotStore,allowedUsers:readonly string[]):Promise<Response>{
  if(!localMemoryAllowed(settings))return reply(404,{error:"not_found"});
  const url=new URL(request.url);
  if(url.protocol!=="http:"||!["localhost","127.0.0.1"].includes(url.hostname))return reply(404,{error:"not_found"});
  if(!["GET","POST","DELETE"].includes(request.method))return reply(405,{error:"method_not_allowed"});
  if(request.method!=="GET"&&request.headers.get("origin")!==url.origin)return reply(403,{error:"origin_not_allowed"});
  const token=request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9._-]{1,8192})$/i)?.[1];
  if(!token)return reply(401,{error:"authentication_required"});
  try{
    const store=makeStore();
    const userId=await store.authenticate(token);
    if(!userId)return reply(401,{error:"invalid_session"});
    if(!allowedUsers.includes(userId))return reply(403,{error:"pilot_not_authorised"});
    const enrollmentId=await store.enrollment(userId);
    if(!enrollmentId)return reply(403,{error:"not_enrolled"});
    if(request.method==="DELETE"){
      await store.revoke(userId,enrollmentId);
      return reply(200,{status:"deleted"});
    }
    if(request.method==="POST"){
      let raw:unknown;
      try{raw=await readSmallJson(request);}catch{return reply(400,{error:"invalid_request"});}
      const result=parseAttempt(raw);
      if(!result)return reply(400,{error:"invalid_attempt"});
      await store.attempt(userId,enrollmentId,{context_key:result.evidence.context,question_id:result.evidence.questionId,correct:result.evidence.correct});
    }
    const rows=await store.read(userId,enrollmentId);
    // Fail closed if consent was revoked or enrollment replaced during a request.
    if(await store.enrollment(userId)!==enrollmentId)return reply(409,{error:"enrollment_changed"});
    const snapshot=buildSnapshot(rows.attempts,rows.exchanges);
    return reply(200,{status:"saved_progress",...snapshot,activityWindowLimited:rows.limited||snapshot.activityWindowLimited});
  }catch{return reply(503,{error:"memory_unavailable"});}
}
