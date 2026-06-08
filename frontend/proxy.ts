import { NextResponse, NextRequest } from "next/server";

const DJANGO_BASE = process.env.BACKEND_API_SERVER;

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const pathname = request.nextUrl.pathname;
  if (!DJANGO_BASE) throw new Error("BACKEND_API_SERVER not set!");

  if (!accessToken) {
    if (!refreshToken) {
      if (pathname !== "/login" && pathname !== "/register")
        return NextResponse.redirect(new URL("/login", request.url));
      return NextResponse.next();
    }
    return await handleRefreshAndContinue(refreshToken, request);
  }

  const verifyRes = await fetch(`${DJANGO_BASE}token/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: accessToken }),
  });

  if (verifyRes.ok) {
    if (pathname === "/login" || pathname === "/register")
      return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return await handleRefreshAndContinue(refreshToken, request);
}

async function handleRefreshAndContinue(
  refreshToken: string,
  request: NextRequest
) {
  if (!process.env.ACCESS_TOKEN_LIFETIME_MINUTES)
    throw new Error("ACCESS_TOKEN_LIFETIME_MINUTES not set!");

  const refreshRes = await fetch(`${DJANGO_BASE}token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!refreshRes.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const data = await refreshRes.json();
  const newAccessToken = data.access;

  const response = NextResponse.next();

  response.cookies.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.PRODUCTION === "production",
    sameSite: "lax",
    path: "/",
    maxAge: parseInt(process.env.ACCESS_TOKEN_LIFETIME_MINUTES) * 60,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
