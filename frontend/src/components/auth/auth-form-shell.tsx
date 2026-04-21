import Link from "next/link";

type AuthFormShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthFormShell({ title, subtitle, children, footer }: AuthFormShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-[#E5E7EB]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.18),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/65 shadow-[0_20px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:grid-cols-[1.05fr_1fr]">
          <div className="hidden border-r border-slate-800 bg-slate-950/60 p-10 md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Ablate AI</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
                Enterprise Machine Unlearning Console
              </h1>
              <p className="mt-5 max-w-sm text-sm text-slate-400">
                Secure sessions, compliant unlearning workflows, and traceable operations for production AI systems.
              </p>
            </div>
            <div className="space-y-3 text-xs text-slate-500">
              <p>Protected by signed session cookies and route-level authorization guards.</p>
              <Link className="inline-flex text-cyan-300 hover:text-cyan-200" href="/">
                Back to landing page
              </Link>
            </div>
          </div>
          <div className="p-7 sm:p-10">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-sm text-slate-400">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
