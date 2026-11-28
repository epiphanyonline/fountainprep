import {handleTranscription} from "@/features/ai-tutor/unifiedTranscription";
import {speechAccess} from "@/app/fountaintalk/speech/serverAccess";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 const settings={environment:process.env.VERCEL_ENV,branch:process.env.VERCEL_GIT_COMMIT_REF,enabled:process.env.AYO_VOICE_ENABLED==="true",accessVerified:process.env.AYO_VOICE_ACCESS_VERIFIED==="true",budgetApproved:process.env.AYO_VOICE_BUDGET_APPROVED==="true"};
 const key=process.env.OPENAI_API_KEY;
 return handleTranscription(request,settings,async req=>{
  const {userId,db}=await speechAccess(req);
  const {data,error}=await db.rpc("fountaintalk_reserve_speech_pilot",{p_user_id:userId});
  return !error&&data===true;
 },key?async(audio,mime,locale)=>{
  const extension=({"audio/webm":"webm","audio/ogg":"ogg","audio/mp4":"mp4","audio/wav":"wav"} as Record<string,string>)[mime];
  const form=new FormData();
  form.append("file",new Blob([new Uint8Array(audio)],{type:mime}),"recording."+extension);
  form.append("model","gpt-4o-transcribe");
  form.append("language",locale.split("-")[0]);
  const response=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{Authorization:"Bearer "+key},body:form,signal:AbortSignal.timeout(25000)});
  if(!response.ok)throw Error("Transcription failed");
  const data=await response.json();
  return typeof data.text==="string"?data.text:"";
 }:undefined);
}
