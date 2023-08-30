import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    const redirectUrl = new URL('/documents', req.url);

    return NextResponse.redirect(redirectUrl);
  }

  if (req.nextUrl.pathname.startsWith('/signin')) {
    const token = await getToken({ req });

    if (token) {
      console.log('has has token', req.url);
      const redirectUrl = new URL('/dashboard', req.url);

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}
