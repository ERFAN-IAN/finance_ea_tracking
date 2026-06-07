import { NextResponse, NextRequest } from "next/server";

const DJANGO_BASE = process.env.DJANGO_URL ?? "http://localhost:8000/api/";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return await handleRefreshAndContinue(refreshToken, request);
  }

  const verifyRes = await fetch(`${DJANGO_BASE}token/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: accessToken }),
  });

  if (verifyRes.ok) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return await handleRefreshAndContinue(refreshToken, request);
}

async function handleRefreshAndContinue(
  refreshToken: string,
  request: NextRequest,
) {
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
  const newRefreshToken = data.refresh;

  const response = NextResponse.next();

  response.cookies.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  if (newRefreshToken) {
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|login|logout).*)",
  ],
};
