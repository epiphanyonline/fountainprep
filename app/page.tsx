"use client";

import SupportWidget from "./components/SupportWidget";
import HomeHero from "./components/home-v3/HomeHero";
import ChooseLearningMode from "./components/home-v3/ChooseLearningMode";
import LiveTutorPaths from "./components/home-v3/LiveTutorPaths";
import SelfPacedAcademies from "./components/home-v3/SelfPacedAcademies";
import WhyParentsChoose from "./components/home-v3/WhyParentsChoose";
import LearningJourney from "./components/home-v3/LearningJourney";
import Countries from "./components/home-v3/Countries";
import FinalCTA from "./components/home-v3/FinalCTA";

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
    </main>
  );
}
