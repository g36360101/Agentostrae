"use client";

import { ApiClient, ApiClientError } from "@agentos/api-client";
import { type FormEvent, useMemo, useState } from "react";

type AuthMode = "login" | "register";

export function AuthForm() {
  const api = useMemo(
    () =>
      new ApiClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
      }),
    [],
  );
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      if (mode === "register") {
        await api.register({
          email,
          name: String(formData.get("name") ?? "").trim(),
          password,
        });
      } else {
        await api.login({ email, password });
      }
      window.location.assign("/projects");
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason.message : "认证失败，请稍后重试。");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8">
      <div className="mb-7 flex rounded-md border border-[var(--border)] bg-[var(--background)] p-1">
        <ModeButton active={mode === "login"} onClick={() => setMode("login")}>
          登录
        </ModeButton>
        <ModeButton active={mode === "register"} onClick={() => setMode("register")}>
          注册
        </ModeButton>
      </div>

      <h2 className="mb-6 font-serif text-2xl">{mode === "login" ? "继续创作" : "建立创作账户"}</h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <AuthField label="称呼" name="name" type="text" autoComplete="name" maxLength={120} />
        ) : null}
        <AuthField label="邮箱" name="email" type="email" autoComplete="email" maxLength={320} />
        <AuthField
          label="密码"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={10}
          maxLength={128}
          {...(mode === "register" ? { hint: "至少 10 个字符" } : {})}
        />

        {error ? (
          <p role="alert" className="text-sm text-[var(--danger)]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[var(--accent)] px-5 py-3 font-medium text-[#17130c] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "正在处理…" : mode === "login" ? "登录" : "注册并进入项目"}
        </button>
      </form>
    </section>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: Readonly<{ active: boolean; onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded px-3 py-2 text-sm transition ${
        active ? "bg-[var(--surface-raised)] text-white" : "text-[var(--muted)] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function AuthField({
  label,
  name,
  type,
  autoComplete,
  minLength,
  maxLength,
  hint,
}: Readonly<{
  label: string;
  name: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  minLength?: number;
  maxLength: number;
  hint?: string;
}>) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-4">
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
        {hint ? <span className="text-xs text-[var(--muted)]">{hint}</span> : null}
      </div>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-white focus:border-[var(--accent)] focus:outline-none"
      />
    </div>
  );
}
