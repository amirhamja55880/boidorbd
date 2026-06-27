import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// এই pages সবাই দেখতে পারবে
const publicPages = [
  '/',
  '/about',
  '/login',
  '/register',
  '/forgot-password',
  '/shop',
  '/shop/cart',
  '/shop/wishlist',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public pages — সবাই দেখতে পারবে
  const isPublic = publicPages.some(page => pathname === page);
  if (isPublic) {
    return NextResponse.next();
  }

  // Static files, API, _next — touch করবে না
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Token check করো — Cookie থেকে
  const token = request.cookies.get('token')?.value;

  // Token নেই → Register page এ পাঠাও
  if (!token) {
    const registerUrl = new URL('/register', request.url);
    registerUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(registerUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};