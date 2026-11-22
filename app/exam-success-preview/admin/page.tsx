import {notFound} from "next/navigation";
import QuestionBankAdminPreview from "@/features/exam-success/QuestionBankAdminPreview";

export const metadata = {
  title:"Question Bank Admin — Development Preview | Fountain Prep",
  robots:{index:false,follow:false},
};

/** Preview only, never a substitute for authenticated real admin permissions. */
export default function QuestionBankPreviewPage() {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  return <QuestionBankAdminPreview/>;
}
