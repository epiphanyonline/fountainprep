import {attachmentKind,visionAllowed,MAX_DOCUMENT_BYTES,attachmentInstruction} from "./visionAttachment";
import {parseLearningContext} from "./learningContext";
export const visionTasks=["Explain step by step","Explain in simpler words","Summarise","Create revision notes","Quiz me"] as const;
export type VisionProvider=(input:{bytes:Uint8Array;mime:string;kind:"image"|"pdf";prompt:string})=>Promise<string>;
const reply=(status:number,body:object)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function handleVision(request:Request,settings:Parameters<typeof visionAllowed>[0],authorize:()=>Promise<boolean>,reserve:()=>Promise<boolean>,provider?:VisionProvider){
 if(!visionAllowed(settings))return reply(404,{error:"not_found"});
 if(request.method!=="POST")return reply(405,{error:"method_not_allowed"});
 if(request.headers.get("origin")!==new URL(request.url).origin)return reply(403,{error:"origin_not_allowed"});
 try{if(!await authorize())return reply(403,{error:"not_authorised"});}catch{return reply(403,{error:"not_authorised"});}
 const mime=request.headers.get("content-type")??"";
 if(!["image/jpeg","image/png","application/pdf"].includes(mime))return reply(415,{error:"unsupported_type"});
 const task=visionTasks.find(t=>t===request.headers.get("x-learning-task"));
 let context;try{context=parseLearningContext(JSON.parse(request.headers.get("x-learning-context")??""));}catch{return reply(400,{error:"invalid_context"});}
 if(!context||!task)return reply(400,{error:"invalid_task"});
 const reader=request.body?.getReader();if(!reader)return reply(400,{error:"missing_attachment"});
 const chunks:Uint8Array[]=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_DOCUMENT_BYTES){await reader.cancel().catch(()=>undefined);return reply(413,{error:"attachment_too_large"});}chunks.push(value);}}catch{return reply(400,{error:"invalid_attachment"});}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 const kind=attachmentKind(bytes,mime);if(!kind)return reply(400,{error:"invalid_attachment"});
 if(!provider)return reply(503,{error:"analysis_unavailable"});
 try{if(!await reserve())return reply(429,{error:"quota_unavailable"});const answer=await provider({bytes,mime,kind,prompt:attachmentInstruction+" Learning context: "+JSON.stringify(context)+". Task: "+task});if(typeof answer!=="string"||!answer.trim())return reply(502,{error:"analysis_unavailable"});return reply(200,{status:"answered",response:answer.trim().slice(0,4000)});}catch{return reply(502,{error:"analysis_unavailable"});}
}
