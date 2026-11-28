import {MAX_VOICE_BYTES,voicePreviewAllowed,voicePlan} from "./unifiedVoice";
import {parseLearningContext} from "./learningContext";
type Settings=Parameters<typeof voicePreviewAllowed>[0];
export type Transcriber=(audio:Uint8Array,mime:string,locale:string)=>Promise<string>;
const reply=(status:number,body:object)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function handleTranscription(request:Request,settings:Settings,authorize:(request:Request)=>Promise<boolean>,provider?:Transcriber){
 if(!voicePreviewAllowed(settings))return reply(404,{error:"not_found"});
 if(request.method!=="POST")return reply(405,{error:"method_not_allowed"});
 if(request.headers.get("origin")!==new URL(request.url).origin)return reply(403,{error:"origin_not_allowed"});
 try{if(!await authorize(request))return reply(403,{error:"not_authorised"});}catch{return reply(403,{error:"not_authorised"});}
 const mime=request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()??"";
 if(!["audio/webm","audio/ogg","audio/mp4","audio/wav"].includes(mime))return reply(415,{error:"unsupported_audio"});
 let context:unknown;
 try{context=JSON.parse(request.headers.get("x-learning-context")??"");}catch{return reply(400,{error:"invalid_context"});}
 const plan=voicePlan(parseLearningContext(context));
 if(!plan)return reply(400,{error:"invalid_context"});
 if(!provider)return reply(503,{error:"transcription_unavailable"});
 const reader=request.body?.getReader();
 if(!reader)return reply(400,{error:"missing_audio"});
 const chunks:Uint8Array[]=[];let size=0;
 try{
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_VOICE_BYTES){await reader.cancel().catch(()=>undefined);return reply(413,{error:"audio_too_large"});}chunks.push(value);}
 }catch{return reply(400,{error:"invalid_audio"});}finally{reader.releaseLock();}
 if(!size)return reply(400,{error:"missing_audio"});
 const audio=new Uint8Array(size);let offset=0;for(const chunk of chunks){audio.set(chunk,offset);offset+=chunk.length;}
 try{const transcript=await provider(audio,mime,plan.locale);if(typeof transcript!=="string"||!transcript.trim())return reply(422,{error:"no_speech"});return reply(200,{status:"transcribed",transcript:transcript.trim().slice(0,700)});}catch{return reply(502,{error:"transcription_unavailable"});}
}
