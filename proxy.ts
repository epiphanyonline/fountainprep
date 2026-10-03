import { NextRequest, NextResponse } from "next/server";

const SELF_PACED_ENABLED = false;

export function proxy(request: NextRequest) {
  if (SELF_PACED_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const isSelfPacedRoute =
  pathname === "/academies" ||
  pathname.startsWith("/academies/") ||
  pathname === "/financial-education" ||
  pathname.startsWith("/financial-education/") ||
  pathname === "/fountaintalk" ||
  pathname.startsWith("/fountaintalk/");

  if (!isSelfPacedRoute) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/academy-coming-soon";
  url.search = "";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/academies/:path*",
    "/financial-education/:path*",
    "/fountaintalk/:path*",
  ],
};