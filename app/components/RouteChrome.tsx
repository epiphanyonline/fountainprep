"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import SupportWidget from "./SupportWidget";

const immersiveRoutes = [
  "/classroom",
  "/academy/dashboard",
];

export default function RouteChrome() {
  const pathname = usePathname();

  const isImmersiveRoute = immersiveRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );

  if (isImmersiveRoute) {
    return null;
  }

  return (
    <>
      <Navbar />
      <SupportWidget />
    </>
  );
}