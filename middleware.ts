import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const path = url.pathname;
  
  // Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production' && url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url);
  }

  // Skip middleware for API routes and webhooks
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // TEMPORARILY DISABLED: HOST-BASED ROUTING
  // const isAdminHost = host.toLowerCase().startsWith('admin.') || 
  //                      host.toLowerCase().includes('.admin.') ||
  //                      host === 'admin.kreativeaiagency.com';
  
  // If request hits admin host but not already under /admin, rewrite
  // if (isAdminHost && !path.startsWith('/admin')) {
  //   const newUrl = url.clone();
  //   newUrl.pathname = `/admin${path === '/' ? '' : path}`;
  //   const res = NextResponse.rewrite(newUrl);
  //   res.headers.set('X-Portal', 'admin');
  //   return res;
  // }

  // TEMPORARILY DISABLED: AUTHENTICATION CHECK
  // Protect admin routes (except login and public assets)
  // if (path.startsWith('/admin') && 
  //     !path.startsWith('/admin/login')) {
    
  //   // Check for admin session cookie
  //   const session = request.cookies.get('admin_session');
    
  //   if (!session || session.value !== 'authenticated') {
  //     // Redirect to login page
  //     const loginUrl = new URL('/admin/login', request.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }

  const res = NextResponse.next();
  // res.headers.set('X-Portal', isAdminHost ? 'admin' : 'main');
  return res;
}

export const config = {
  // Run on all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico).*)'],
};