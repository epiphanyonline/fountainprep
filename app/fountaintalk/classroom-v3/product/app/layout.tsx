import type { Metadata } from "next";
import "./product.css";

export const metadata: Metadata = {
  title: "FountainPrep",
  description: "Learning that stays with you.",
};

export default function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
