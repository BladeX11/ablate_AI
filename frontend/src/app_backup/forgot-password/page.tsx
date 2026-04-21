"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { forgotPassword } from "@/lib/auth/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setResetToken(null);
    setLoading(true);

    try {
      const result = await forgotPassword({ email });
      setMessage(result.message);
      setResetToken(result.resetToken ?? null);
    } catch (submitError) {
      const submitMessage = submitError instanceof Error ? submitError.message : "Could not process request";
      setError(submitMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Forgot Password"
      subtitle="Request a reset token for your workspace account."
      footer={
        <>
          Back to{" "}
          <Link className="text-cyan-300 hover:text-cyan-200" href="/login">
            sign in
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

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        {resetToken ? (
          <p className="rounded-xl border border-cyan-900/70 bg-cyan-950/40 px-4 py-3 text-xs text-cyan-200">
            Dev reset token: <span className="font-mono">{resetToken}</span>
          </p>
        ) : null}

        <button
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Send reset request"}
        </button>
      </form>
    </AuthFormShell>
  );
}
