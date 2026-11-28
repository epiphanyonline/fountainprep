import {queryVisionGateway} from "@/features/ai-tutor/visionGateway";
import {handleVision} from "@/features/ai-tutor/visionBoundary";
import {speechAccess} from "@/app/fountaintalk/speech/serverAccess";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 let access:Awaited<ReturnType<typeof speechAccess>>|undefined;
 return handleVision(request,{
 environment:process.env.VERCEL_ENV,branch:process.env.VERCEL_GIT_COMMIT_REF,
 enabled:process.env.AYO_VISION_ENABLED==="true",
 accessVerified:process.env.AYO_VISION_ACCESS_VERIFIED==="true",
 budgetApproved:process.env.AYO_VISION_BUDGET_APPROVED==="true"
 },async()=>{access=await speechAccess(request);return true;},async()=>{
 if(!access)return false;
 const {data,error}=await access.db.rpc("fountaintalk_reserve_speech_pilot",{p_user_id:access.userId});
 return !error&&data===true;
 },queryVisionGateway);
}
