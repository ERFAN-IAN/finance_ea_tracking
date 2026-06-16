"use server";

import { serverFetch } from "@/lib/fetch/server";
import { redirect } from "next/navigation";

export async function logout() {
  const response = await serverFetch("logout/", { method: "POST" });
  if (response.success) return redirect("/login");
}
