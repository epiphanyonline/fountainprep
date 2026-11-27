import { contexts } from "./unifiedMemoryPersistence";
import { assessmentQuestions } from "./unifiedAssessment";
import { contextKey, EXAM_LABELS, LANGUAGE_LABELS, SUBJECT_LABELS } from "./learningContext";

/** Standalone synthetic pilot: intentionally bypasses the site's analytics and shared layout. */
export function memoryPilotHtml(nonce:string):string {
  const catalogue=contexts.filter(c=>assessmentQuestions(c).length>0).map(context=>({
    context,key:contextKey(context),
    label:context.kind==="exam"?EXAM_LABELS[context.track]:context.kind==="language"?LANGUAGE_LABELS[context.language]:SUBJECT_LABELS[context.subject]+" ("+context.kind+")",
    questions:assessmentQuestions(context).map(({id,prompt,options})=>({id,prompt,options})),
  }));
  const json=JSON.stringify(catalogue).replace(/</g,"\\u003c");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AYO local memory pilot</title>
<style nonce="${nonce}">*{box-sizing:border-box}body{font:16px/1.5 system-ui,sans-serif;background:#faf9fd;color:#172033;margin:0;padding:24px}main{max-width:680px;margin:auto}section{background:white;border:1px solid #ddd6ef;border-radius:16px;padding:20px;margin:16px 0}h1,h2{line-height:1.2}label{display:block;margin:12px 0 4px}input,select,button{font:inherit;border:1px solid #bdb5ce;border-radius:8px;padding:10px;max-width:100%}input,select{width:100%}button{background:#6d28d9;color:white;cursor:pointer;margin:8px 8px 0 0}button:disabled{opacity:.5;cursor:default}.choice{display:block;width:100%;text-align:left;background:white;color:#172033}.muted{color:#555b6a;font-size:.9rem}.danger{background:#9f1239}[hidden]{display:none!important}#status{min-height:1.5em}</style></head><body><main>
<p class="muted">FOUNTAIN PREP / AYO · LOCAL TEST ONLY</p><h1>Saved learning progress</h1><p>Use fictional, pre-enrolled test accounts only. No production accounts, live AI or external analytics.</p>
<section id="login"><h2>Sign in to the local pilot</h2><label for="email">Synthetic email (example.test)</label><input id="email" type="email" autocomplete="off" placeholder="learner-a@example.test"><label for="password">Local test password</label><input id="password" type="password" autocomplete="off"><button id="signin" type="button">Sign in and load progress</button></section>
<section id="progress" hidden><h2>My learning records</h2><p id="activity"></p><label for="subject">Learning pathway</label><select id="subject"></select><p id="score"></p><p id="question"></p><div id="choices"></div><p id="feedback" role="status"></p><p class="muted">First attempts only. These sample questions do not establish proficiency.</p><button id="reload" type="button">Reload saved progress</button><button id="leave" type="button">Clear session from this tab</button><button id="delete" class="danger" type="button">Delete saved progress and leave pilot</button></section>
<p id="status" role="status" aria-live="polite"></p></main>
<script nonce="${nonce}">
"use strict";
const catalogue=${json};
const el=id=>document.getElementById(id);
let token="",snapshot=null,busy=false;
const controls=["signin","email","password","subject","reload","leave","delete"];
function setBusy(value){busy=value;controls.forEach(id=>el(id).disabled=value);el("choices").querySelectorAll("button").forEach(b=>b.disabled=value);}
function status(message){el("status").textContent=message;}
function clearSession(){token="";snapshot=null;el("password").value="";el("email").value="";el("progress").hidden=true;el("login").hidden=false;el("choices").replaceChildren();["activity","score","question","feedback"].forEach(id=>el(id).textContent="");}
function show(){
 const item=catalogue.find(c=>c.key===el("subject").value)||catalogue[0];
 const evidence=snapshot.evidence.filter(e=>e.context===item.key);
 const activity=snapshot.memory.entries.find(e=>{const c=e.context;return c.kind==="exam"?"exam:"+c.track===item.key:c.kind==="language"?"language:"+c.language+":"+c.level===item.key:c.kind+":"+c.subject===item.key;});
 el("activity").textContent=(activity?.sessions||0)+" recorded AI exchanges in this pathway."+(snapshot.activityWindowLimited?" Recent activity window only.":"");
 el("score").textContent=evidence.filter(e=>e.correct).length+" correct / "+evidence.length+" first attempts";
 const question=item.questions.find(q=>!evidence.some(e=>e.questionId===q.id));
 el("question").textContent=question?question.prompt:"All sample questions attempted.";
 el("choices").replaceChildren();
 if(question)question.options.forEach(option=>{const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=option.text;b.disabled=busy;b.onclick=()=>save(item,question,option);el("choices").append(b);});
 el("login").hidden=true;el("progress").hidden=false;
}
async function request(method,body){
 const r=await fetch("/api/ai-tutor-preview/memory",{method,cache:"no-store",credentials:"omit",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},...(body?{body:JSON.stringify(body)}:{})});
 if(!r.ok){if([401,403,409].includes(r.status))clearSession();throw Error("request");}
 return r.json();
}
async function load(){const data=await request("GET");if(data.status!=="saved_progress")throw Error("snapshot");snapshot=data;show();}
async function save(item,question,option){
 if(busy)return;setBusy(true);status("");el("feedback").textContent="";
 try{const data=await request("POST",{context:item.context,questionId:question.id,choiceId:option.id});if(data.status!=="saved_progress")throw Error("snapshot");snapshot=data;show();const result=data.evidence.find(e=>e.context===item.key&&e.questionId===question.id);el("feedback").textContent=result?(result.correct?"Recorded first attempt: correct.":"Recorded first attempt: incorrect. Review this concept."):"No saved result returned. Reload to check.";}
 catch{status("Could not confirm the saved answer. Reload before retrying.");}finally{setBusy(false);}
}
catalogue.forEach(item=>{const option=document.createElement("option");option.value=item.key;option.textContent=item.label;el("subject").append(option);});
el("subject").onchange=()=>{el("feedback").textContent="";if(snapshot)show();};
el("signin").onclick=async()=>{
 if(busy)return;setBusy(true);status("");token="";snapshot=null;
 try{const r=await fetch(location.pathname,{method:"POST",cache:"no-store",credentials:"omit",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:el("email").value,password:el("password").value})});el("password").value="";if(!r.ok)throw Error("login");const data=await r.json();if(typeof data.token!=="string"||!data.token)throw Error("token");token=data.token;await load();status("Saved progress loaded.");}
 catch{clearSession();status("Unable to sign in or load progress. Check the local test account and enrolment.");}finally{setBusy(false);}
};
el("reload").onclick=async()=>{if(busy)return;setBusy(true);try{await load();el("feedback").textContent="";status("Saved progress reloaded.");}catch{status("Unable to reload saved progress.");}finally{setBusy(false);}};
el("leave").onclick=()=>{if(!busy){clearSession();status("Session cleared from this tab. Saved records remain.");}};
el("delete").onclick=async()=>{if(busy||!confirm("Delete all saved pilot progress and withdraw this test account from the pilot?"))return;setBusy(true);try{const data=await request("DELETE");if(data.status!=="deleted")throw Error("delete");clearSession();status("Saved pilot records deleted and enrolment withdrawn.");}catch{status("Deletion was not confirmed. Check the local database before retrying.");}finally{setBusy(false);}};
window.addEventListener("pagehide",clearSession);
</script></body></html>`;
}
