"use client";

import * as React from "react";

type AuthCardProps = {
  title?: string;
  subtitle?: string;
  onSubmit?: (data: { username: string; password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export default function AuthCard({
  title = "Ingresar",
  subtitle = "Accede a tu cuenta para continuar.",
  onSubmit,
  loading = false,
  error = null,
}: AuthCardProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit?.({ username: username.trim(), password });
  }

  const disabled = loading || username.trim().length === 0 || password.length === 0;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-black/10 bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.06)] sm:px-10 sm:py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-black/45">
              MISTIKA / CUENTA
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black">
              {title}
            </h1>
            <p className="mt-2 text-sm text-black/55">{subtitle}</p>
          </div>

          {/* Icono minimalista */}
          <div className="mt-1 grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-black/[0.02]">
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-black/70"
            >
              <path
                d="M16 9V7a4 4 0 10-8 0v2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M6.5 9.5h11a2 2 0 012 2v7a2 2 0 01-2 2h-11a2 2 0 01-2-2v-7a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-black/10 bg-black/[0.01] p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-xs font-medium uppercase tracking-[0.18em] text-black/55"
              >
                Usuario
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario"
                className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[15px] text-black outline-none transition focus:border-black/25 focus:ring-4 focus:ring-black/5"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-[0.18em] text-black/55"
              >
                Contraseña
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 pr-14 text-[15px] text-black outline-none transition focus:border-black/25 focus:ring-4 focus:ring-black/5"
                />

              </div>
            </div>

            {/* Error */}
            {error ? (
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70">
                <span className="font-medium">Ups:</span> {error}
              </div>
            ) : null}

            {/* Botón */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={disabled}
                className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Ingresando
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-2 py-1">
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white"
                      >
                        <path
                          d="M10 17l5-5-5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Ingresar
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-between text-xs text-black/50">
                <button
                  type="button"
                  className="underline decoration-black/15 underline-offset-4 hover:text-black/70"
                  onClick={() => alert("Aquí puedes abrir tu modal de recuperación.")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
