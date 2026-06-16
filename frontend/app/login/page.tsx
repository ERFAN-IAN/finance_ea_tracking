"use client";

import { useForm } from "react-hook-form";
import { Home } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(loginSchema) });
  const router = useRouter();
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Link
            href="/"
            className="mb-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(async (data) => {
              const csrf = getCookie("csrftoken");
              if (!csrf) {
                const csrfRequset = await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_API}csrf/`,
                );
                if (!csrfRequset.ok) {
                  setError("root", { message: "login failed." });
                  return;
                }
              }

              const request = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}login/`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken") as string,
                  },
                  credentials: "include",
                  body: JSON.stringify(data),
                },
              );
              if (request.ok) {
                router.refresh();
                router.replace("/");
                return;
              }
              const errorData = await request.json().catch(() => null);
              setError("root", {
                type: "server",
                message: errorData?.detail ?? "Login failed",
              });
            })}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {errors.root?.message && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}
            <div>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full mb-2 cursor-pointer"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              <Link href="/register">
                <Button className="w-full border-2 border-black bg-white text-black hover:bg-gray-100 transition-colors cursor-pointer">
                  Register
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
