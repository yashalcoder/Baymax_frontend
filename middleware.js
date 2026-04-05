import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const roleRoutes = {
    "/lab": "laboratory",
    "/pharmacy": "pharmacy",
    "/doctor": "doctor",
    "/patient": "patient",
    "/assistant": "assistant",
  };

  const matchedRoute = Object.keys(roleRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET || "super-secret-jwt-key"
      );
      const { payload } = await jwtVerify(token, secret);

      const requiredRole = roleRoutes[matchedRoute];

      if (payload.role !== requiredRole) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/lab/:path*",
    "/pharmacy/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/assistant/:path*",
  ],
};