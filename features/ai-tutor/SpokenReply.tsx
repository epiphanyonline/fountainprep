"use client";
import {useEffect,useRef,useState} from "react";
import {supabase} from "@/app/lib/supabase";
import type {LearningContext} from "./learningContext";
export default function SpokenReply({text,context}:{text:string;context:LearningContext}){
 const [url,setUrl]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [slow,setSlow]=useState(false);
 const audio=useRef<HTMLAudioElement>(null);const object=useRef("");const pending=useRef<AbortController|null>(null);
 useEffect(()=>()=>{pending.current?.abort();if(object.current)URL.revokeObjectURL(object.current);},[]);
 useEffect(()=>{if(audio.current)audio.current.playbackRate=slow?0.75:1;},[slow,url]);
 async function load(){
 if(pending.current||url)return;
 const controller=new AbortController();pending.current=controller;setBusy(true);setError("");
 try{
 const {data}=await supabase.auth.getSession();
 if(!data.session)throw Error("Sign in with an authorised pilot account.");
 if(controller.signal.aborted)return;
 const r=await fetch("/api/ai-tutor-preview/speak",{method:"POST",cache:"no-store",signal:controller.signal,headers:{Authorization:"Bearer "+data.session.access_token,"Content-Type":"application/json"},body:JSON.stringify({text,context})});
 if(!r.ok)throw Error("Spoken reply unavailable. Read the written explanation instead.");
 const blob=await r.blob();
 if(controller.signal.aborted)return;
 if(!["audio/mpeg","audio/wav"].includes(blob.type)||!blob.size||blob.size>5000000)throw Error("Invalid audio.");
 object.current=URL.createObjectURL(blob);setUrl(object.current);
 }catch(e){if(!controller.signal.aborted)setError(e instanceof Error?e.message:"Audio unavailable.");}
 finally{if(!controller.signal.aborted){pending.current=null;setBusy(false);}}
 }
 return <div className="mt-3 space-y-2"><button type="button" disabled={busy||!!url} onClick={()=>void load()} className="rounded-lg border px-3 py-2 text-sm">{busy?"Preparing audio…":url?"Audio ready":"Prepare spoken reply"}</button>{url&&<><audio ref={audio} controls src={url} className="max-w-full"/><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={slow} onChange={e=>setSlow(e.target.checked)}/>Slower playback</label></>}{error&&<p role="status" className="text-xs">{error}</p>}</div>;
}
