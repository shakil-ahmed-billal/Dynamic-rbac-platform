import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES = ["/dashboard", "/users", "/roles", "/permissions", "/modules", "/settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route)) || pathname === "/";

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !accessToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth route with token
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Handle root route
  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/users/:path*",
    "/roles/:path*",
    "/permissions/:path*",
    "/modules/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
