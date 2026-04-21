"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { signup } from "@/lib/auth/api-client";
import { DEFAULT_POST_LOGIN_REDIRECT } from "@/lib/auth/constants";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signup({ name, email, password });
      router.push(DEFAULT_POST_LOGIN_REDIRECT);
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Could not create account";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Create Account"
      subtitle="Register a workspace identity for secure unlearning operations."
      footer={
        <>
          Already have an account?{" "}
          <Link className="text-cyan-300 hover:text-cyan-200" href="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Full name</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

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
            minLength={8}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Confirm password</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthFormShell>
  );
}
