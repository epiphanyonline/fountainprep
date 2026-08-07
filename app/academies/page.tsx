import Link from "next/link";
import { academyMarketing, publicAcademySlugs } from "@/app/data/academies/marketing";

export const metadata = { title: "AI Academies", description: "Explore FountainPrep academies and learning pathways." };

export default function AcademiesPage() {
  return <main className="wrap">
    <section className="hero"><p>FountainPrep Academies</p><h1>Build skills that create real opportunities.</h1><span>Choose an academy, explore its pathway and begin at the learner's current stage.</span></section>
    <section className="grid">{publicAcademySlugs.map(slug => { const a=academyMarketing[slug]; return <Link key={slug} href={`/academies/${slug}`} className="card"><small>{a.title}</small><h2>{a.headline}</h2><p>{a.summary}</p><b>Explore academy →</b></Link> })}</section>
    <style>{`.wrap{min-height:100vh;padding:70px 20px 100px;background:linear-gradient(180deg,#fff,#f6f0ff);color:#241438}.hero{max-width:920px;margin:0 auto 48px;text-align:center}.hero p{color:#7c3aed;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.hero h1{font-size:clamp(44px,7vw,78px);line-height:.98;letter-spacing:-.06em;margin:18px 0}.hero span{color:#6f6478;font-size:19px;line-height:1.7}.grid{max-width:1260px;margin:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.card{min-height:330px;padding:28px;border:1px solid #eadff5;border-radius:30px;background:#fff;color:inherit;text-decoration:none;box-shadow:0 18px 55px rgba(48,29,82,.07);display:flex;flex-direction:column}.card small{color:#7c3aed;font-weight:900;text-transform:uppercase}.card h2{font-size:29px;letter-spacing:-.04em}.card p{color:#716679;line-height:1.65}.card b{margin-top:auto;color:#6d28d9}@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.grid{grid-template-columns:1fr}}`}</style>
  </main>;
}
