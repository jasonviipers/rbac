import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add any additional public routes to this array
const publicRoutes = ["/", "/api/:path*"];

// Define a function to check if a request URL matches any of the public routes
function isPublicRoute(url: URL): boolean {
  for (const route of publicRoutes) {
    if (url.pathname === route || url.pathname.startsWith(route)) {
      return true;
    }
  }
  return false;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);

  // Allow all GET requests and requests to public routes
  if (request.method === "GET" || isPublicRoute(url)) {
    return NextResponse.next();
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");

  // Verify the request origin and return a 403 response if it's not valid
  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  // If the request origin is valid, continue processing the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};