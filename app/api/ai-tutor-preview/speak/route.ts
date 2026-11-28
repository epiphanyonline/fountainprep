import {voicePlan,voicePreviewAllowed,MAX_SPOKEN_CHARS} from "@/features/ai-tutor/unifiedVoice";
import {readSmallJson} from "@/features/ai-tutor/unifiedMemoryBoundary";
import {speechAccess} from "@/app/fountaintalk/speech/serverAccess";
import {makeSsml} from "@/app/fountaintalk/speech/voiceProfiles";
import {synthesizeOrinode} from "@/app/fountaintalk/speech/providers";
import {detectAudioType,MAX_SYNTHESIS_BYTES} from "@/app/fountaintalk/speech/audioValidation";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const fail=(status:number)=>Response.json({error:"speech_unavailable"},{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request){
 if(!voicePreviewAllowed({environment:process.env.VERCEL_ENV,branch:process.env.VERCEL_GIT_COMMIT_REF,enabled:process.env.AYO_VOICE_ENABLED==="true",accessVerified:process.env.AYO_VOICE_ACCESS_VERIFIED==="true",budgetApproved:process.env.AYO_VOICE_BUDGET_APPROVED==="true"}))return fail(404);
 if(request.headers.get("origin")!==new URL(request.url).origin)return fail(403);
 try{
 const {userId,db}=await speechAccess(request);
 let raw:unknown;try{raw=await readSmallJson(request);}catch{return fail(400);}
 if(!raw||typeof raw!=="object"||Array.isArray(raw))return fail(400);
 const {context,text}=raw as Record<string,unknown>;
 const plan=voicePlan(context);
 if(!plan||typeof text!=="string"||!text.trim()||text.length>MAX_SPOKEN_CHARS)return fail(400);
 const key=plan.provider==="orinode"?process.env.ORINODE_API_KEY:process.env.AZURE_SPEECH_KEY;
 const region=process.env.AZURE_SPEECH_REGION;
 if(!key||(plan.provider==="azure"&&(!region||!/^[a-z0-9]+$/.test(region))))return fail(503);
 const {data,error}=await db.rpc("fountaintalk_reserve_speech_pilot",{p_user_id:userId});
 if(error)return fail(503);if(data!==true)return fail(429);
 let bytes:Uint8Array;
 if(plan.provider==="orinode"){
 if(plan.language!=="yoruba"&&plan.language!=="igbo"&&plan.language!=="hausa")return fail(400);
 bytes=await synthesizeOrinode(plan.language,text.trim(),key);
 }else{
 const r=await fetch("https://"+region+".tts.speech.microsoft.com/cognitiveservices/v1",{method:"POST",headers:{"Ocp-Apim-Subscription-Key":key,"Content-Type":"application/ssml+xml","X-Microsoft-OutputFormat":"audio-24khz-48kbitrate-mono-mp3"},body:makeSsml(plan.locale,plan.voice,text.trim()),signal:AbortSignal.timeout(15000)});
 if(!r.ok)return fail(502);
 bytes=new Uint8Array(await r.arrayBuffer());
 }
 const type=detectAudioType(bytes);
 if(!type||bytes.length>MAX_SYNTHESIS_BYTES)return fail(502);
 return new Response(new Uint8Array(bytes),{headers:{"Content-Type":type,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }catch{return fail(503);}
}
