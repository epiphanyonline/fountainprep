"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { supabase } from "@/app/lib/supabase";
import type {
  AcademyCode,
} from "@/features/academy-content";

import UniversalAcademyClassroom from "./UniversalAcademyClassroom";

type StudentRow = {
  id: string;
  full_name: string;
};

export default function AcademyClassroomPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Loader />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="min-h-screen grid place-items-center bg-purple-50 p-6">
      <div className="rounded-3xl bg-white p-8 font-bold shadow-sm">
        Preparing your classroom...
      </div>
    </main>
  );
}

function Loader() {
  const params = useSearchParams();
  const studentId = params.get("studentId");
  const academyCode =
    params.get("academy") as AcademyCode | null;
  const programmeId = params.get("programme");
  const courseId = params.get("course");
  const lessonId = params.get("lesson");

  const [student, setStudent] =
    useState<StudentRow | null>(null);
  const [error, setError] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!studentId || !academyCode) {
          throw new Error(
            "A learner and academy must be selected.",
          );
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) {
          throw new Error(
            "Please log in before opening the classroom.",
          );
        }

        const { data: parent, error: parentError } =
          await supabase
            .from("parent_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (parentError) throw parentError;
        if (!parent) {
          throw new Error(
            "A parent profile could not be found.",
          );
        }

        const { data, error: studentError } =
          await supabase
            .from("student_profiles")
            .select("id, full_name")
            .eq("id", studentId)
            .eq("parent_id", parent.id)
            .maybeSingle();

        if (studentError) throw studentError;
        if (!data) {
          throw new Error(
            "The selected learner could not be found.",
          );
        }

        if (!cancelled) {
          setStudent(data as StudentRow);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the learner.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [academyCode, studentId]);

  if (loading) return <Loading />;

  if (
    error ||
    !student ||
    !studentId ||
    !academyCode
  ) {
    return (
      <main className="min-h-screen grid place-items-center bg-purple-50 p-6">
        <div className="max-w-xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black">
            Unable to open classroom
          </h1>
          <p className="mt-3 text-red-700">
            {error ?? "Missing classroom information."}
          </p>
          <Link
            href="/subjects"
            className="mt-5 inline-flex rounded-full bg-purple-600 px-5 py-3 font-bold text-white"
          >
            Return to Subjects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <UniversalAcademyClassroom
      studentId={studentId}
      learnerName={student.full_name}
      academyCode={academyCode}
      programmeId={programmeId}
      courseId={courseId}
      lessonId={lessonId}
    />
  );
}
