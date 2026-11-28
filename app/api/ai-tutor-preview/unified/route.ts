import { speechAccess } from "@/app/fountaintalk/speech/serverAccess";
import { handleUnifiedPreviewRequest, unifiedLiveAllowed } from "@/features/ai-tutor/unifiedPreviewBoundary";
import { queryTutorGateway } from "@/features/ai-tutor/tutorGateway";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const settings = {
    environment: process.env.VERCEL_ENV,
    branch: process.env.VERCEL_GIT_COMMIT_REF,
    enabled: process.env.FOUNTAIN_UNIFIED_AI_ENABLED === "true",
    budgetApproved: process.env.FOUNTAIN_UNIFIED_BUDGET_APPROVED === "true",
    accessVerified: process.env.FOUNTAIN_UNIFIED_ACCESS_VERIFIED === "true",
  };
  if (unifiedLiveAllowed(settings)) {
    if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"origin_not_allowed"},{status:403});
    try {
      const {userId,db}=await speechAccess(request);
      return handleUnifiedPreviewRequest(request,settings,async(prompt,messages)=>{
        const {data,error}=await db.rpc("fountaintalk_reserve_speech_pilot",{p_user_id:userId});
        if(error||data!==true)throw Error("Quota unavailable");
        return queryTutorGateway(prompt,messages);
      });
    }catch{return Response.json({error:"not_authorised"},{status:403,headers:{"Cache-Control":"no-store"}});}
  }
  return handleUnifiedPreviewRequest(request,settings);
}
