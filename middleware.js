import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const protectedPaths = [
    "/dashboard/doctor",
    "/dashboard/patient",
    "/dashboard/assistant",
    "/dashboard/pharmacy",
    "/dashboard/laboratory",
  ];

  if (protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
