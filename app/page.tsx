
"use client";

import { useEffect, useState } from "react";

import SupportWidget from "./components/SupportWidget";
import HomeHero from "./components/home-v3/HomeHero";
import ChooseLearningMode from "./components/home-v3/ChooseLearningMode";
import LiveTutorPaths from "./components/home-v3/LiveTutorPaths";
import SelfPacedAcademies from "./components/home-v3/SelfPacedAcademies";
import WhyParentsChoose from "./components/home-v3/WhyParentsChoose";
import LearningJourney from "./components/home-v3/LearningJourney";
import Countries from "./components/home-v3/Countries";
import FinalCTA from "./components/home-v3/FinalCTA";

const BANNER_KEY = "fountainprep-welcome-seen";

function WelcomeBanner() {
  const [status, setStatus] = useState<
    "loading" | "open" | "minimised"
  >("loading");

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(BANNER_KEY);

      if (seen) {
        setStatus("minimised");
      } else {
        setStatus("open");
        sessionStorage.setItem(BANNER_KEY, "yes");
      }
    } catch {
      setStatus("open");
    }
  }, []);

  if (status === "loading") return null;

  if (status === "minimised") {
    return (
      <div className="fixed bottom-24 left-4 z-[80] sm:bottom-6 sm:left-6">
        <button
          type="button"
          onClick={() => setStatus("open")}
          className="rounded-full bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-purple-800"
          aria-label="Open Fountain Prep welcome banner"
        >
          🎓 Explore Fountain Prep +
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label="Welcome to Fountain Prep"
      className="fixed bottom-24 left-4 right-4 z-[80] max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-2xl border border-purple-100 bg-white text-slate-900 shadow-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:w-[390px]"
    >
      <div className="flex items-center justify-between bg-purple-700 px-5 py-4 text-white">
        <div>
          <h2 className="text-lg font-bold">
            👋 Welcome to Fountain Prep
          </h2>
          <p className="mt-1 text-xs text-purple-100">
            Discover your learning journey
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStatus("minimised")}
          className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-purple-600"
          aria-label="Minimise welcome banner"
          title="Minimise"
        >
          −
        </button>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-sm font-medium text-slate-700">
          What would you like to explore today?
        </p>

        <a
          href="/financial-education"
          className="block rounded-xl border border-purple-100 bg-purple-50 p-4 transition hover:border-purple-300 hover:bg-purple-100"
        >
          <h3 className="font-semibold text-purple-900">
            💰 Financial Literacy Academy
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Discover practical financial education,
            money management and our learning academies.
          </p>
          <p className="mt-2 text-sm font-semibold text-purple-700">
            Explore Financial Education →
          </p>
        </a>

        <a
          href="/languages"
          className="block rounded-xl border border-purple-100 bg-purple-50 p-4 transition hover:border-purple-300 hover:bg-purple-100"
        >
          <h3 className="font-semibold text-purple-900">
            🌍 Nigerian Language Lessons
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Explore Yoruba, Igbo and Hausa lessons
            for children and learners worldwide.
          </p>
          <p className="mt-2 text-sm font-semibold text-purple-700">
            Explore Nigerian Languages →
          </p>
        </a>

        <p className="pt-1 text-center text-xs text-slate-500">
          You can minimise this banner and continue
          browsing Fountain Prep.
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <ChooseLearningMode />
      <LiveTutorPaths />
      <SelfPacedAcademies />
      <WhyParentsChoose />
      <LearningJourney />
      <Countries />
      <FinalCTA />
      <SupportWidget />
      <WelcomeBanner />
    </main>
  );
}
