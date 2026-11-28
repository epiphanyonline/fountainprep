import { parseLearningContext } from "./learningContext";
import { voiceProfiles } from "../../app/fountaintalk/speech/voiceProfiles";

export const MAX_VOICE_SECONDS=30;
export const MAX_VOICE_BYTES=2_000_000;
export const MAX_SPOKEN_CHARS=1300;
export function voicePlan(raw:unknown){
 const context=parseLearningContext(raw);
 if(!context)return null;
 if(context.kind==="language")return {...voiceProfiles[context.language],language:context.language};
 return {provider:"azure",locale:"en-GB",voice:"en-GB-SoniaNeural",language:"english"} as const;
}
export function validateRecording(mime:string,bytes:number,seconds:number){
 return ["audio/webm","audio/ogg","audio/mp4","audio/wav"].includes(mime.split(";")[0].trim().toLowerCase()) &&
 Number.isSafeInteger(bytes)&&bytes>0&&bytes<=MAX_VOICE_BYTES&&Number.isFinite(seconds)&&seconds>0&&seconds<=MAX_VOICE_SECONDS;
}
export function voicePreviewAllowed(settings:{environment?:string;branch?:string;enabled?:boolean;accessVerified?:boolean;budgetApproved?:boolean}){
 return settings.environment==="preview"&&settings.branch==="feature/unified-ai-tutor"&&settings.enabled===true&&settings.accessVerified===true&&settings.budgetApproved===true;
}
