import { Suspense } from "react";
import FinancialLiteracyCertificateClient from "./FinancialLiteracyCertificateClient";

export const metadata = {
  title:
    "Financial Literacy Graduation Certificate | FountainPrep",
  description:
    "FountainPrep Financial Literacy Academy graduation certificate.",
};

export default function
FinancialLiteracyGraduationPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            fontFamily:
              "Inter, Arial, sans-serif",
            color: "#6f5c7b",
          }}
        >
          Preparing certificate...
        </main>
      }
    >
      <FinancialLiteracyCertificateClient />
    </Suspense>
  );
}
