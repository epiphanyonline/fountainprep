"use client";
import {useEffect,useRef,useState} from "react";
import {MAX_VOICE_SECONDS,MAX_VOICE_BYTES,validateRecording} from "./unifiedVoice";

/** Local microphone rehearsal only: no upload, transcription or persistent storage. */
export default function VoiceRecordingPreview(){
 const [status,setStatus]=useState("Ready");
 const [phase,setPhase]=useState<"idle"|"requesting"|"recording">("idle");
 const [audio,setAudio]=useState("");
 const active=useRef<MediaRecorder|null>(null);
 const stream=useRef<MediaStream|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const generation=useRef(0);
 const objectUrl=useRef("");
 function release(){
  if(timer.current!==null)clearTimeout(timer.current);
  timer.current=null;
  stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;
 }
 function clear(){
  generation.current++;
  if(active.current?.state==="recording")active.current.stop();
  active.current=null;release();
  if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);
  objectUrl.current="";
 }
 useEffect(()=>()=>clear(),[]);
 async function start(){
  if(phase!=="idle")return;
  clear();setAudio("");setPhase("requesting");setStatus("Requesting microphone permission…");
  const id=generation.current;
  try{
   if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined")throw Error("unsupported");
   const media=await navigator.mediaDevices.getUserMedia({audio:true});
   if(id!==generation.current){media.getTracks().forEach(t=>t.stop());return;}
   stream.current=media;
   const recorder=new MediaRecorder(media);active.current=recorder;
   const chunks:Blob[]=[];let bytes=0;let oversized=false;const started=performance.now();
   recorder.ondataavailable=e=>{
    if(id!==generation.current)return;
    bytes+=e.data.size;
    if(bytes>MAX_VOICE_BYTES){oversized=true;if(recorder.state==="recording")recorder.stop();return;}
    if(e.data.size)chunks.push(e.data);
   };
   recorder.onerror=()=>{if(id===generation.current){clear();setPhase("idle");setStatus("Recording failed.");}};
   recorder.onstop=()=>{
    if(id!==generation.current)return;
    release();active.current=null;setPhase("idle");
    const blob=new Blob(chunks,{type:recorder.mimeType});
    const seconds=(performance.now()-started)/1000;
    if(oversized||!validateRecording(blob.type,blob.size,Math.min(seconds,MAX_VOICE_SECONDS))){setStatus("Recording unavailable or too large. Try again.");return;}
    objectUrl.current=URL.createObjectURL(blob);setAudio(objectUrl.current);setStatus("Recording ready for local playback. Nothing uploaded.");
   };
   recorder.start(250);setPhase("recording");setStatus("Recording…");
   timer.current=setTimeout(()=>{if(recorder.state==="recording")recorder.stop();},MAX_VOICE_SECONDS*1000);
  }catch{if(id===generation.current){clear();setPhase("idle");setStatus("Microphone unavailable or permission denied.");}}
 }
 return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
  <h2 className="font-semibold">Microphone rehearsal</h2>
  <p className="mt-2 text-sm text-slate-600">Local recording only. Use fictional examples. No transcription or AI upload.</p>
  <div className="mt-3 flex flex-wrap gap-3">
   <button type="button" disabled={phase!=="idle"} onClick={()=>void start()} className="rounded-lg bg-violet-700 px-4 py-2 text-white disabled:opacity-50">Record</button>
   <button type="button" disabled={phase!=="recording"} onClick={()=>{if(active.current?.state==="recording")active.current.stop();}} className="rounded-lg border px-4 py-2 disabled:opacity-50">Stop</button>
   <button type="button" onClick={()=>{clear();setAudio("");setPhase("idle");setStatus("Recording discarded.");}} className="rounded-lg border px-4 py-2">Discard</button>
  </div>
  <p role="status" className="mt-3 text-sm">{status}</p>
  {audio&&<audio className="mt-3 max-w-full" controls src={audio}/>}
 </section>;
}
