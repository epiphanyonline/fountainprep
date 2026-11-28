import { handleMemoryRequest } from "@/features/ai-tutor/unifiedMemoryBoundary";
import { createLocalMemoryStore } from "@/features/ai-tutor/localMemoryStore";
export const runtime="nodejs";
export const dynamic="force-dynamic";
function handle(request:Request){
  const settings={
    nodeEnv:process.env.NODE_ENV,vercel:process.env.VERCEL,
    enabled:process.env.AYO_LOCAL_MEMORY_ENABLED,url:process.env.AYO_LOCAL_SUPABASE_URL,
    anonKey:process.env.AYO_LOCAL_SUPABASE_ANON_KEY,serviceKey:process.env.AYO_LOCAL_SUPABASE_SERVICE_KEY,
  };
  return handleMemoryRequest(request,settings,()=>createLocalMemoryStore(settings),
    (process.env.AYO_LOCAL_MEMORY_USERS??"").split(",").map(x=>x.trim()).filter(Boolean));
}
export const GET=handle;
export const POST=handle;
export const DELETE=handle;
