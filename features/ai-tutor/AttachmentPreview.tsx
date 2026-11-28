"use client";
import {useEffect,useRef,useState} from "react";
import {attachmentKind,MAX_IMAGE_BYTES,MAX_DOCUMENT_BYTES} from "./visionAttachment";
export default function AttachmentPreview(){
 const [file,setFile]=useState<File|null>(null);
 const [url,setUrl]=useState("");
 const [status,setStatus]=useState("");
 const [task,setTask]=useState("Explain step by step");
 const version=useRef(0);
 const object=useRef("");
 function clear(){version.current++;if(object.current)URL.revokeObjectURL(object.current);object.current="";setFile(null);setUrl("");setStatus("");}
 useEffect(()=>()=>{version.current++;if(object.current)URL.revokeObjectURL(object.current);},[]);
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
 return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
 <h2 className="font-semibold">Study with an image or document</h2>
 <p className="mt-2 text-sm text-slate-600">Local preview only. Choose fictional learning materials without personal details. JPEG/PNG up to 2 MB; PDF up to 4 MB.</p>
 <label className="mt-3 block text-sm">Choose learning material<input type="file" accept="image/jpeg,image/png,application/pdf" className="mt-2 block w-full text-sm" onChange={e=>{const next=e.target.files?.[0];e.target.value="";if(next)void select(next);}}/></label>
 {file&&<div className="mt-3 space-y-3"><p className="break-all text-sm">{file.name} · {Math.ceil(file.size/1024)} KB</p>{url&&<img src={url} alt="Selected learning material" className="max-h-72 max-w-full rounded-lg object-contain"/>}<label className="block text-sm">Learning task<select value={task} onChange={e=>setTask(e.target.value)} className="mt-1 block w-full rounded-lg border p-2">{["Explain step by step","Explain in simpler words","Summarise","Create revision notes","Quiz me"].map(t=><option key={t}>{t}</option>)}</select></label><p className="text-xs text-slate-500">Selected task: {task}. AI analysis is not enabled yet.</p><button type="button" onClick={clear} className="rounded-lg border px-3 py-2 text-sm">Remove attachment</button></div>}
 {status&&<p role="status" className="mt-3 text-sm">{status}</p>}
 </section>;
}
