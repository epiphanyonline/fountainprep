type TutorSpeechBubbleProps = {
  text: string;
};

export default function TutorSpeechBubble({
  text,
}: TutorSpeechBubbleProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border-[10px] border-amber-800 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 p-6 shadow-2xl sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute left-12 top-10 h-20 w-32 rotate-6 rounded-full border-4 border-white" />
        <div className="absolute bottom-12 right-14 h-16 w-16 rounded-full border-4 border-white" />
      </div>

      <div className="relative">
        <div className="mb-5 flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              👨🏾‍🏫
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                Ayo’s class board
              </p>

              <p className="text-sm text-white/70">
                Read, listen and answer
              </p>
            </div>
          </div>

          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            FountainTalk
          </span>
        </div>

        <div
          aria-live="polite"
          className="min-h-36 whitespace-pre-line font-serif text-2xl font-semibold leading-relaxed text-white drop-shadow sm:text-3xl"
        >
          {text}
        </div>

        <div className="mt-7 flex items-center gap-3 border-t border-white/20 pt-4">
          <span className="h-3 w-20 rounded-full bg-white/75 shadow" />
          <span className="h-3 w-12 rounded-full bg-yellow-200/80 shadow" />

          <p className="ml-auto text-xs font-medium text-emerald-100/70">
            Listen carefully, then speak
          </p>
        </div>
      </div>
    </section>
  );
}