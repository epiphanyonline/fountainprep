import { randomBytes } from "node:crypto";
import { localMemoryAllowed } from "./unifiedMemoryPersistence";
import { readSmallJson } from "./unifiedMemoryBoundary";
import { memoryPilotHtml } from "./localMemoryPilotHtml";

type Settings=Parameters<typeof localMemoryAllowed>[0];
export type PilotLogin=(email:string,password:string)=>Promise<{userId:string;token:string;enrolled:boolean}|null>;
const headers={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","X-Frame-Options":"DENY","X-Robots-Tag":"noindex, nofollow"};
const reply=(status:number,body:object)=>Response.json(body,{status,headers});
export async function handleLocalMemoryPilot(request:Request,settings:Settings,allowedUsers:readonly string[],login:PilotLogin):Promise<Response>{
  const url=new URL(request.url);
  if(!localMemoryAllowed(settings)||url.protocol!=="http:"||!["localhost","127.0.0.1"].includes(url.hostname))return reply(404,{error:"not_found"});
  if(request.method==="GET"){
    const nonce=randomBytes(18).toString("base64");
    return new Response(memoryPilotHtml(nonce),{headers:{...headers,"Content-Type":"text/html; charset=utf-8",
      "Content-Security-Policy":"default-src 'none'; script-src 'nonce-"+nonce+"'; style-src 'nonce-"+nonce+"'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"}});
  }
  if(request.method!=="POST")return reply(405,{error:"method_not_allowed"});
  if(request.headers.get("origin")!==url.origin)return reply(403,{error:"origin_not_allowed"});
  let input:unknown;
  try{input=await readSmallJson(request);}catch{return reply(400,{error:"invalid_request"});}
  if(!input||typeof input!=="object"||Array.isArray(input))return reply(400,{error:"invalid_request"});
  const {email,password}=input as Record<string,unknown>;
  if(typeof email!=="string"||email.length>120||! /^[a-z0-9._+-]+@example\.test$/i.test(email)||typeof password!=="string"||password.length<8||password.length>128)return reply(400,{error:"synthetic_credentials_required"});
  try{
    const result=await login(email.toLowerCase(),password);
    if(!result||!allowedUsers.includes(result.userId)||!result.enrolled||! /^[A-Za-z0-9._-]{1,8192}$/.test(result.token))return reply(403,{error:"pilot_login_denied"});
    return reply(200,{token:result.token});
  }catch{return reply(503,{error:"pilot_login_unavailable"});}
}
