import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that should be accessible only to authenticated users
const protectedPaths = [
  '/reservation',
  '/payment',
  '/confirmation',
];

// Define paths that should be accessible only to admins
const adminPaths = [
  '/admin',
];

// Paths that should be accessible without authentication
const publicPaths = [
  '/',
  '/api/movies',
  '/api/screenings',
  '/api/auth/login',
  '/movie',
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Always allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('session_id');
  
  // If accessing a protected path and no session exists, redirect to login
  if (protectedPaths.some(path => pathname.startsWith(path)) && !sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // For admin paths, you might want additional checks in a real application
  // For simplicity, we're just checking if the session exists
  if (adminPaths.some(path => pathname.startsWith(path)) && !sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
} 