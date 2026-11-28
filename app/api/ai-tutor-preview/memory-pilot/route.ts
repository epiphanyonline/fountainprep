import { createClient } from "@supabase/supabase-js";
import { handleLocalMemoryPilot } from "@/features/ai-tutor/localMemoryPilotBoundary";
import { createLocalMemoryStore } from "@/features/ai-tutor/localMemoryStore";
import { localMemoryAllowed } from "@/features/ai-tutor/unifiedMemoryPersistence";
export const runtime="nodejs";
export const dynamic="force-dynamic";
function handle(request:Request){
 const settings={nodeEnv:process.env.NODE_ENV,vercel:process.env.VERCEL,enabled:process.env.AYO_LOCAL_MEMORY_ENABLED,url:process.env.AYO_LOCAL_SUPABASE_URL,anonKey:process.env.AYO_LOCAL_SUPABASE_ANON_KEY,serviceKey:process.env.AYO_LOCAL_SUPABASE_SERVICE_KEY};
 const allowed=(process.env.AYO_LOCAL_MEMORY_USERS??"").split(",").map(x=>x.trim()).filter(Boolean);
 return handleLocalMemoryPilot(request,settings,allowed,async(email,password)=>{
   if(!localMemoryAllowed(settings)||!settings.url||!settings.anonKey||!settings.serviceKey)return null;
   const client=createClient(settings.url,settings.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
   const {data,error}=await client.auth.signInWithPassword({email,password});
   if(error||!data.session||!data.user||data.user.is_anonymous||!allowed.includes(data.user.id))return null;
   const store=createLocalMemoryStore(settings);
   const id=await store.authenticate(data.session.access_token);
   if(id!==data.user.id)return null;
   return {userId:id,token:data.session.access_token,enrolled:Boolean(await store.enrollment(id))};
 });
}
export const GET=handle;
export const POST=handle;
