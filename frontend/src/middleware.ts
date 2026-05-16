import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/income', '/expenses', '/reports', '/settings', '/users'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // If trying to access login/register while already logged in, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/income/:path*',
    '/expenses/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/users/:path*',
    '/login',
    '/register',
  ],
};
