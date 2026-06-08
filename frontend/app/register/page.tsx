"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
    password2: z.string().min(1, "Please repeat your password"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(registerSchema) });
  const router = useRouter();
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(async (data) => {
              const request = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}register/`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(data),
                }
              );
              if (request.ok) {
                router.push("/");
                return;
              }
              const errorData = await request.json().catch(() => null);
              if (errorData) {
                for (const [field, messages] of Object.entries(errorData)) {
                  if (field in data) {
                    setError(field as keyof typeof data, {
                      type: "server",
                      message: Array.isArray(messages)
                        ? messages[0]
                        : String(messages),
                    });
                  }
                }
              }
              if (errorData.detail) {
                setError("root", {
                  type: "server",
                  message: errorData?.detail ?? "Failed",
                });
              }
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="abc@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
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

            <div className="grid gap-2">
              <Label htmlFor="password2">Repeat Password</Label>
              <Input
                id="password2"
                type="password"
                placeholder="••••••••"
                {...register("password2")}
              />
              {errors.password2 && (
                <p className="text-sm text-red-500">
                  {errors.password2.message}
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
                className="w-full cursor-pointer mb-2"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <Link href="/login">
                <Button className="w-full border-2 border-black bg-white text-black hover:bg-gray-100 transition-colors cursor-pointer">
                  Login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
