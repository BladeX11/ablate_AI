"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "@/lib/auth/api-client";
import { DEFAULT_POST_LOGIN_REDIRECT } from "@/lib/auth/constants";

import { AuthFormShell } from "./auth-form-shell";

type LoginFormProps = {
  nextUrl?: string;
};

export function LoginForm({ nextUrl }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("admin@ablate.ai");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      router.push(nextUrl || DEFAULT_POST_LOGIN_REDIRECT);
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Login failed";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Sign In"
      subtitle="Access your enterprise unlearning workspace."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link className="text-cyan-300 hover:text-cyan-200" href="/signup">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Email</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Password</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link className="text-slate-400 hover:text-slate-200" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </AuthFormShell>
  );
}
