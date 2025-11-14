"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "mk_auth";

export function middleware(request: NextRequest) {
  const username = process.env.SITE_USERNAME;
  const password = process.env.SITE_PASSWORD;

  if (!username || !password) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE);
  if (cookie?.value === Buffer.from(`${username}:${password}`).toString("base64")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, credentials] = authHeader.split(" ");
    if (scheme === "Basic") {
      const decoded = Buffer.from(credentials, "base64").toString();
      const [user, pass] = decoded.split(":");
      if (user === username && pass === password) {
        const response = NextResponse.next();
        response.cookies.set({
          name: AUTH_COOKIE,
          value: Buffer.from(`${user}:${pass}`).toString("base64"),
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 6, // 6 hours
        });
        return response;
      }
    }
  }

  const response = new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Macmillan Keck"',
    },
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/opportunities).*)"],
};


