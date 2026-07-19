"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error ?? "Login failed.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 rounded-2xl bg-card/50 p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <div>
          <label className="text-sm font-medium mb-2 block">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        <Button type="submit" className="w-full mt-2">
          Log In
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}