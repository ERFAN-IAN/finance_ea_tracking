// app/auth/refresh-and-redirect/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  console.log(11111);
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_APP_URL),
    );
  }

  const refreshRes = await fetch("http://localhost:8000/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!refreshRes.ok) {
    return NextResponse.redirect("/login");
  }

  const data = await refreshRes.json();
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });
  const res = NextResponse.redirect("http://localhost:3000/accounts/");
  res.cookies.set("access_token", data.access, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  return res;
}
