import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of routes that require authentication
const protectedRoutes = ['/dashboard', '/users', '/roles', '/permissions', '/modules', '/audit-logs', '/leads', '/tasks', '/reports', '/settings', '/customer-portal'];
// List of routes only for unauthenticated users
const authRoutes = ['/login', '/register', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for refreshToken in cookies (since it's httpOnly and stored by the browser)
  // We use refreshToken as a proxy for 'is logged in' because accessToken is in memory
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuth = !!refreshToken;

  // 1. Redirect unauthenticated users trying to access protected routes
  if (!isAuth && protectedRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Redirect authenticated users away from auth pages (login/register)
  if (isAuth && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(isAuth ? '/dashboard' : '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
