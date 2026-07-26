"use client";
import type { JourneyModule, LearnerProgress } from "../engine/types";
import { accessReason, canAccess } from "../engine/access";

export default function JourneyRoadmap({ modules, progress }: { modules: JourneyModule[]; progress: LearnerProgress }) {
  return <section className="journey"><header><small>Your journey</small><h1>See where you are going</h1><p>Future modules remain visible so learners can anticipate what comes next.</p></header><div className="module-list">{[...modules].sort((a,b)=>a.order-b.order).map((module)=>{
    const complete=progress.completedModuleIds.includes(module.id); const unlocked=canAccess(module.access,progress); const reason=accessReason(module.access,progress);
    return <article key={module.id} className={complete?"complete":unlocked?"available":"locked"}><div className="number">{complete?"✓":module.order}</div><div><small>{complete?"Completed":unlocked?"Available":"Locked"}</small><h2>{module.title}</h2><p>{module.description}</p>{module.storyHook&&<blockquote>{module.storyHook}</blockquote>}<div className="meta"><span>{module.estimatedMinutes} min</span><span>{module.lessonIds.length} lessons</span>{module.skills.slice(0,3).map((skill)=><span key={skill}>{skill}</span>)}</div>{!unlocked&&reason&&<strong>{reason}</strong>}</div></article>;
  })}</div><style jsx>{`
    .journey{max-width:980px;margin:auto;padding:48px 20px}.journey>header h1{font-size:clamp(40px,6vw,72px);margin:6px 0}.module-list{display:grid;gap:14px;margin-top:30px}.module-list article{display:grid;grid-template-columns:auto 1fr;gap:18px;padding:22px;border:1px solid #e2e8f0;border-radius:20px;background:white}.module-list article.locked{opacity:.72;background:#f8fafc}.number{width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:#ede9fe;color:#5b21b6;font-weight:950}.module-list h2{margin:4px 0}.module-list p{color:#64748b}.module-list blockquote{margin:12px 0;padding-left:14px;border-left:3px solid #8b5cf6}.meta{display:flex;flex-wrap:wrap;gap:8px}.meta span{padding:6px 9px;border-radius:999px;background:#f1f5f9;font-size:12px}.module-list strong{display:block;margin-top:12px;color:#7c3aed}
  `}</style></section>;
}
