import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Academy chat route is active.",
    },
    {
      status: 200,
    }
  );
}