import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles/fountainprep.css";

export const metadata: Metadata = {
  title: {
    default: "FountainPrep",
    template: "%s | FountainPrep",
  },
  description:
    "A calm, story-led learning experience designed to help learners discover, reflect, and grow.",
};

type FountainPrepLayoutProps = {
  children: ReactNode;
};

export default function FountainPrepLayout({
  children,
}: FountainPrepLayoutProps) {
  return (
    <div className="fp-app">
      <a className="fp-skip-link" href="#fountainprep-main">
        Skip to content
      </a>

      <main id="fountainprep-main" className="fp-main">
        {children}
      </main>
    </div>
  );
}