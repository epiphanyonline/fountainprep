import {
  NextRequest,
  NextResponse,
} from "next/server";

export function proxy(
  request: NextRequest,
) {
  const { pathname } =
    request.nextUrl;

  /*
   * Financial Literacy is the first
   * self-paced Academy being reopened.
   *
   * Only the Financial Literacy journey
   * and its classroom routes are allowed.
   * Other self-paced Academies remain
   * protected by the Coming Soon page.
   */
  const isFinancialLiteracyRoute =
    pathname ===
      "/financial-education" ||
    pathname.startsWith(
      "/financial-education/",
    ) ||
    pathname ===
      "/academies/financial-literacy" ||
    pathname.startsWith(
      "/academies/financial-literacy/",
    ) ||
    pathname ===
      "/fountaintalk/classroom/wealth" ||
    pathname.startsWith(
      "/fountaintalk/classroom/wealth/",
    ) ||
    pathname ===
      "/fountaintalk/classroom/personal-finance" ||
    pathname.startsWith(
      "/fountaintalk/classroom/personal-finance/",
    );

  if (isFinancialLiteracyRoute) {
    return NextResponse.next();
  }

  /*
   * Keep every other self-paced Academy
   * route unavailable for now.
   */
  const isProtectedSelfPacedRoute =
    pathname === "/academies" ||
    pathname.startsWith(
      "/academies/",
    ) ||
    pathname === "/fountaintalk" ||
    pathname.startsWith(
      "/fountaintalk/",
    );

  if (!isProtectedSelfPacedRoute) {
    return NextResponse.next();
  }

  const url =
    request.nextUrl.clone();

  url.pathname =
    "/academy-coming-soon";

  url.search = "";

  return NextResponse.redirect(
    url,
  );
}

export const config = {
  matcher: [
    "/academies/:path*",
    "/financial-education/:path*",
    "/fountaintalk/:path*",
  ],
};