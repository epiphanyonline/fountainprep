import type { MentorLetter } from "../mentor/types";

export default function MentorLetterCard({ letter }: { letter: MentorLetter }) {
  return (
    <article className="mx-auto max-w-2xl rounded-[2rem] border border-amber-200 bg-amber-50 p-7 text-slate-800 shadow-xl md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">A letter from Ayo</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">{letter.subject}</h2>
      <p className="mt-7 font-medium">{letter.salutation}</p>
      <div className="mt-5 space-y-4 leading-7">
        {letter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <p className="mt-8 whitespace-pre-line font-semibold text-slate-950">{letter.signOff}</p>
    </article>
  );
}
