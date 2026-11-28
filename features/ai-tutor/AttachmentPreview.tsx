"use client";
import {useEffect,useRef,useState} from "react";
import {attachmentKind,MAX_IMAGE_BYTES,MAX_DOCUMENT_BYTES} from "./visionAttachment";
import {supabase} from "@/app/lib/supabase";
import type {LearningContext} from "./learningContext";
export default function AttachmentPreview({context,enabled=false}:{context:LearningContext;enabled?:boolean}){
 const [file,setFile]=useState<File|null>(null);
 const [url,setUrl]=useState("");
 const [status,setStatus]=useState("");
 const [task,setTask]=useState("Explain step by step");
 const [answer,setAnswer]=useState("");
 const [busy,setBusy]=useState(false);
 const pending=useRef<AbortController|null>(null);
 const version=useRef(0);
 const object=useRef("");
 function clear(){version.current++;pending.current?.abort();pending.current=null;setBusy(false);setAnswer("");if(object.current)URL.revokeObjectURL(object.current);object.current="";setFile(null);setUrl("");setStatus("");}
 useEffect(()=>()=>{version.current++;pending.current?.abort();if(object.current)URL.revokeObjectURL(object.current);},[]);
 async function select(next:File){
 clear();const id=version.current;
 if(next.size>(next.type==="application/pdf"?MAX_DOCUMENT_BYTES:MAX_IMAGE_BYTES)){setStatus("File is too large.");return;}
 try{
 const kind=attachmentKind(new Uint8Array(await next.arrayBuffer()),next.type);
 if(id!==version.current)return;
 if(!kind){setStatus("Choose a valid JPEG, PNG or PDF.");return;}
 setFile(next);
 if(kind==="image"){object.current=URL.createObjectURL(next);setUrl(object.current);}
 setStatus("File screened locally. No upload or AI processing has taken place.");
 }catch{if(id===version.current)setStatus("Unable to read this file.");}
 }
 async function analyse(){
 if(!enabled||!file||pending.current)return;
 const id=version.current, controller=new AbortController();pending.current=controller;setBusy(true);setAnswer("");setStatus("Analysing learning material…");
 try{
 const {data}=await supabase.auth.getSession();
 if(!data.session)throw Error("Sign in with an authorised pilot account.");
 if(controller.signal.aborted)return;
 const r=await fetch("/api/ai-tutor-preview/vision",{method:"POST",cache:"no-store",signal:controller.signal,headers:{Authorization:"Bearer "+data.session.access_token,"Content-Type":file.type,"X-Learning-Context":JSON.stringify(context),"X-Learning-Task":task},body:file});
 if(!r.ok)throw Error("Analysis unavailable. Your attachment is still selected.");
 const result=await r.json();
 if(result.status!=="answered"||typeof result.response!=="string"||!result.response.trim())throw Error("No explanation returned.");
 if(id===version.current){setAnswer(result.response.slice(0,4000));setStatus("Analysis complete. Check the explanation against your source.");}
 }catch(e){if(id===version.current)setStatus(e instanceof Error?e.message:"Analysis unavailable.");}
 finally{if(id===version.current){pending.current=null;setBusy(false);}}
 }
 return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
 <h2 className="font-semibold">Study with an image or document</h2>
 <p className="mt-2 text-sm text-slate-600">{enabled?"Pilot only. Selecting Analyse sends your file to the AI provider. Use fictional materials without personal details.":"Local preview only. Choose fictional learning materials without personal details."} JPEG/PNG up to 2 MB; PDF up to 4 MB.</p>
 <label className="mt-3 block text-sm">Choose learning material<input type="file" accept="image/jpeg,image/png,application/pdf" className="mt-2 block w-full text-sm" onChange={e=>{const next=e.target.files?.[0];e.target.value="";if(next)void select(next);}}/></label>
 {file&&<div className="mt-3 space-y-3"><p className="break-all text-sm">{file.name} · {Math.ceil(file.size/1024)} KB</p>{url&&<img src={url} alt="Selected learning material" className="max-h-72 max-w-full rounded-lg object-contain"/>}<label className="block text-sm">Learning task<select value={task} disabled={busy} onChange={e=>{setTask(e.target.value);setAnswer("");}} className="mt-1 block w-full rounded-lg border p-2">{["Explain step by step","Explain in simpler words","Summarise","Create revision notes","Quiz me"].map(t=><option key={t}>{t}</option>)}</select></label><p className="text-xs text-slate-500">Selected task: {task}. {!enabled&&"AI analysis is not enabled yet."}</p>{enabled&&<button type="button" disabled={busy} onClick={()=>void analyse()} className="rounded-lg bg-violet-700 px-4 py-2 text-white disabled:opacity-50">{busy?"Analysing…":"Analyse with AYO"}</button>}<button type="button" onClick={clear} className="rounded-lg border px-3 py-2 text-sm">Remove attachment</button></div>}
 {answer&&<div className="mt-4 rounded-xl bg-violet-50 p-4"><h3 className="font-semibold">AYO explanation</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm">{answer}</p></div>}
 {status&&<p role="status" className="mt-3 text-sm">{status}</p>}
 </section>;
}
