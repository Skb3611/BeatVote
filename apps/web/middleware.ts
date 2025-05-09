import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
export default clerkMiddleware(async (auth, req,next ) => {
  const { getToken } = await auth();
  const token = await getToken()
  // console.log(token)
  // if (req.nextUrl.pathname.startsWith('/rooms')) {
  //    return NextResponse.next()
  // }
  // if (token) {
  //       return NextResponse.redirect(new URL('/rooms', req.url))
  // }
  return NextResponse.next()
});

export const config = {

  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};