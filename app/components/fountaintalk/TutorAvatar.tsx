import Image from "next/image";

import type { TutorStatus } from "@/app/types/fountaintalk";

type TutorAvatarProps = {
  name?: string;
  status: TutorStatus;
  academyLabel?: string;
  tutorDescription?: string;
  imageSrc?: string;
};

const statusText: Record<TutorStatus, string> = {
  ready: "Ready for class",
  listening: "Listening to you",
  thinking: "Preparing an answer",
  speaking: "Teaching now",
  completed: "Class completed",
};

export default function TutorAvatar({
  name = "Ayo",
  status,
  academyLabel = "Language Academy",
  tutorDescription = "Your personal AI tutor",
  imageSrc = "/images/fountaintalk/ayo-tutor.png",
}: TutorAvatarProps) {
  const isActive =
    status === "listening" ||
    status === "thinking" ||
    status === "speaking";

  const statusColour =
    status === "listening"
      ? "bg-emerald-500"
      : status === "speaking"
        ? "bg-violet-500"
        : status === "thinking"
          ? "bg-amber-400"
          : status === "completed"
            ? "bg-emerald-500"
            : "bg-slate-400";

  return (
    <section className="flex w-full flex-col items-center text-center">
      <div className="relative w-full max-w-[370px]">
        {isActive && (
          <>
            <div className="absolute -inset-7 animate-pulse rounded-[3.5rem] bg-violet-400/20 blur-2xl" />

            <div className="absolute -inset-2 rounded-[3rem] border border-violet-300/60" />
          </>
        )}

        <div className="relative overflow-hidden rounded-[2.8rem] border-[7px] border-white bg-white shadow-[0_30px_90px_rgba(45,24,74,0.25)]">
          <div className="relative h-[430px] w-full sm:h-[490px]">
            <Image
              src={imageSrc}
              alt={`${name}, your Learn with AYO tutor`}
              fill
              priority
              sizes="(max-width: 640px) 340px, 370px"
              className={`object-cover object-top transition duration-500 ${
                status === "speaking"
                  ? "scale-[1.025]"
                  : "scale-100"
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#160b24]/95 via-[#160b24]/10 to-transparent" />

            <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
              {academyLabel}
            </div>

            {status === "speaking" && (
              <div className="absolute right-5 top-5 flex items-end gap-1 rounded-full border border-white/30 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                <span className="h-3 w-1 animate-pulse rounded-full bg-violet-600" />

                <span className="h-6 w-1 animate-pulse rounded-full bg-violet-600 [animation-delay:120ms]" />

                <span className="h-4 w-1 animate-pulse rounded-full bg-violet-600 [animation-delay:240ms]" />

                <span className="h-7 w-1 animate-pulse rounded-full bg-violet-600 [animation-delay:360ms]" />

                <span className="h-3 w-1 animate-pulse rounded-full bg-violet-600 [animation-delay:480ms]" />
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 px-6 pb-7 pt-32 text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                Learn with AYO
              </p>

              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-white">
                    {name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-white/75">
                    {tutorDescription}
                  </p>
                </div>

                <div
                  className={`mb-1 h-5 w-5 shrink-0 rounded-full border-4 border-white shadow-lg ${statusColour}`}
                  aria-label={statusText[status]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 left-1/2 flex min-w-[210px] -translate-x-1/2 items-center justify-center gap-3 rounded-full border border-violet-100 bg-white px-5 py-3 shadow-xl">
          <span
            className={`h-3 w-3 rounded-full ${statusColour}`}
          />

          <span className="text-sm font-black text-[#4c1d95]">
            {statusText[status]}
          </span>
        </div>
      </div>

      {status === "listening" && (
        <p className="mt-10 rounded-full bg-emerald-50 px-5 py-2 text-sm font-bold text-emerald-700">
          Go ahead — Ayo is listening.
        </p>
      )}

      {status !== "listening" && (
        <div className="h-10" aria-hidden="true" />
      )}
    </section>
  );
}