"use client";

import Link from "next/link";
import { useState } from "react";

import { resetPassword } from "@/lib/auth/api-client";

import { AuthFormShell } from "./auth-form-shell";

type ResetPasswordFormProps = {
  initialToken?: string;
};

export function ResetPasswordForm({ initialToken = "" }: ResetPasswordFormProps) {
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({ token, newPassword });
      setMessage(result.message);
      setToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      const submitMessage = submitError instanceof Error ? submitError.message : "Could not reset password";
      setError(submitMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Reset Password"
      subtitle="Use your reset token to set a new account password."
      footer={
        <>
          Remembered your password?{" "}
          <Link className="text-cyan-300 hover:text-cyan-200" href="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Reset token</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 font-mono text-xs outline-none transition focus:border-cyan-400"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">New password</span>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Confirm new password</span>
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
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <button
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthFormShell>
  );
}
