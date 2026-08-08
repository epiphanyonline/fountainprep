import AcademyLanding from "@/app/components/academy/AcademyLanding";
import { academyMarketing } from "@/app/data/academies/marketing";

export const metadata = {
  title: "Financial Literacy Academy",
  description:
    "Equip children and young people with practical money skills for a brighter financial future.",
};

export default function FinancialLiteracyPage() {
  return (
    <AcademyLanding
      academy={academyMarketing["financial-literacy"]}
    />
  );
}
