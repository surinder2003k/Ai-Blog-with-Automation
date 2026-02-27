import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
// These admin routes can also be accessed via master-admin cookie (no Clerk login needed)
const isMasterAdminRoute = createRouteMatcher([
    '/dashboard/admin(.*)',
    '/dashboard/edit(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    // Allow master admin sessions to bypass Clerk protection on admin routes
    if (isMasterAdminRoute(req)) {
        const masterCookie = req.cookies.get('master_admin_session');
        if (masterCookie?.value === 'true') {
            return NextResponse.next();
        }
    }

    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
