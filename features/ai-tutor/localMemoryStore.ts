import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { PilotStore } from "./unifiedMemoryBoundary";
import { localMemoryAllowed, PILOT_LIMIT } from "./unifiedMemoryPersistence";

type Settings=Parameters<typeof localMemoryAllowed>[0] & {anonKey?:string;serviceKey?:string};
const enrollmentTable="ayo_memory_pilot_enrollment";
const attemptTable="ayo_memory_pilot_attempt";
const exchangeTable="ayo_memory_pilot_exchange";
const opts={auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}};

/** Instantiate only inside a local server request. Never use the live app's Supabase keys. */
export function createLocalMemoryStore(settings:Settings):PilotStore{
  if(!localMemoryAllowed(settings)||!settings.url||!settings.anonKey||!settings.serviceKey)throw Error("Local memory disabled");
  const url=settings.url, anon=settings.anonKey;
  const auth=createClient(url,anon,opts);
  const service=createClient(url,settings.serviceKey,opts);
  let owner:string|null=null;
  let reader:SupabaseClient|null=null;
  function own(userId:string):SupabaseClient{
    if(!reader||owner!==userId)throw Error("Unauthorised memory access");
    return reader;
  }
  return {
    async authenticate(token){
      owner=null;reader=null;
      const {data,error}=await auth.auth.getUser(token);
      if(error||!data.user||data.user.is_anonymous)return null;
      owner=data.user.id;
      reader=createClient(url,anon,{...opts,global:{headers:{Authorization:"Bearer "+token}}});
      return owner;
    },
    async enrollment(userId){
      const {data,error}=await own(userId).from(enrollmentTable).select("enrollment_id").eq("user_id",userId).maybeSingle();
      if(error)throw Error("Enrollment query failed");
      return data?.enrollment_id??null;
    },
    async read(userId,enrollmentId){
      const db=own(userId);
      const [attempts,exchanges]=await Promise.all([
        db.from(attemptTable).select("context_key,question_id,correct",{count:"exact"}).eq("user_id",userId).eq("enrollment_id",enrollmentId).order("context_key").order("question_id").limit(PILOT_LIMIT),
        db.from(exchangeTable).select("context_key,mode,completed_at,event_id",{count:"exact"}).eq("user_id",userId).eq("enrollment_id",enrollmentId).order("completed_at",{ascending:false}).order("event_id",{ascending:false}).limit(PILOT_LIMIT),
      ]);
      if(attempts.error||exchanges.error||attempts.count===null||exchanges.count===null)throw Error("Memory read failed");
      if(attempts.count>(attempts.data?.length??0))throw Error("Incomplete assessment snapshot");
      return {attempts:attempts.data??[],exchanges:exchanges.data??[],limited:exchanges.count>(exchanges.data?.length??0)};
    },
    async attempt(userId,enrollmentId,row){
      own(userId);
      // A conflict is an already recorded first attempt. Never overwrite it.
      const {error}=await service.from(attemptTable).upsert({
        user_id:userId,enrollment_id:enrollmentId,context_key:row.context_key,question_id:row.question_id,correct:row.correct,
      },{onConflict:"user_id,enrollment_id,context_key,question_id",ignoreDuplicates:true});
      if(error)throw Error("Assessment write failed");
    },
    async revoke(userId,enrollmentId){
      own(userId);
      // Composite foreign keys cascade deletion. A newer enrollment cannot be deleted by this request.
      const {data,error}=await service.from(enrollmentTable).delete().eq("user_id",userId).eq("enrollment_id",enrollmentId).select("enrollment_id").maybeSingle();
      if(error||!data)throw Error("Memory deletion failed or enrollment changed");
    },
  };
}
