"use client";

import { ApiClient, ApiClientError } from "@agentos/api-client";
import type { Project } from "@agentos/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type LoadState = "loading" | "ready" | "error";

export function ProjectsWorkspace() {
  const api = useMemo(
    () =>
      new ApiClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
      }),
    [],
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [loadErrorCode, setLoadErrorCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const router = useRouter();

  const loadProjects = useCallback(async () => {
    setLoadState("loading");
    setLoadError("");
    setLoadErrorCode("");
    try {
      const response = await api.listProjects();
      setProjects(response.data);
      setLoadState("ready");
    } catch (error: unknown) {
      setLoadError(toMessage(error));
      setLoadErrorCode(error instanceof ApiClientError ? (error.code ?? "") : "");
      setLoadState("error");
    }
  }, [api]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    setCreateError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const genre = String(formData.get("genre") ?? "").trim();
    const premise = String(formData.get("premise") ?? "").trim();

    try {
      const response = await api.createProject({
        title,
        ...(genre ? { genre } : {}),
        ...(premise ? { premise } : {}),
      });
      router.push(`/projects/${response.data.id}`);
    } catch (error: unknown) {
      setCreateError(toMessage(error));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-2 text-sm text-[var(--accent)]">新作品</p>
        <h2 className="mb-6 font-serif text-2xl">创建项目</h2>

        <form className="space-y-5" onSubmit={handleCreate}>
          <Field label="作品名" htmlFor="title" required>
            <input
              id="title"
              name="title"
              required
              maxLength={120}
              placeholder="例如：天道草稿"
              className={inputClassName}
            />
          </Field>

          <Field label="题材" htmlFor="genre">
            <input
              id="genre"
              name="genre"
              maxLength={80}
              placeholder="例如：玄幻悬疑"
              className={inputClassName}
            />
          </Field>

          <Field label="初始构想" htmlFor="premise">
            <textarea
              id="premise"
              name="premise"
              rows={5}
              maxLength={2000}
              placeholder="用一两句话记录最初的灵感。"
              className={inputClassName}
            />
          </Field>

          {createError ? (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {createError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full rounded-md bg-[var(--accent)] px-5 py-3 font-medium text-[#17130c] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {isCreating ? "正在创建…" : "创建作品项目"}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-6">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-[var(--accent)]">作品库</p>
            <h2 className="font-serif text-2xl">我的项目</h2>
          </div>
          {loadState === "ready" ? (
            <span className="text-sm text-[var(--muted)]">{projects.length} 个项目</span>
          ) : null}
        </div>

        {loadState === "loading" ? (
          <p aria-live="polite" className="text-[var(--muted)]">
            正在读取项目…
          </p>
        ) : null}

        {loadState === "error" ? (
          <div className="rounded-md border border-[var(--danger)]/40 bg-[var(--danger)]/5 p-4">
            <p role="alert" className="mb-3 text-sm text-[var(--danger)]">
              {loadError}
            </p>
            {loadErrorCode === "UNAUTHORIZED" ? (
              <Link href="/login" className="text-sm text-[var(--accent)] underline">
                前往登录
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void loadProjects()}
                className="text-sm underline"
              >
                重试
              </button>
            )}
          </div>
        ) : null}

        {loadState === "ready" && projects.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--border)] p-8 text-center">
            <p className="mb-2 font-medium">还没有作品项目</p>
            <p className="text-sm text-[var(--muted)]">从左侧记录第一个作品名和初始构想。</p>
          </div>
        ) : null}

        {loadState === "ready" && projects.length > 0 ? (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="block rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/60"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl">{project.title}</h3>
                    <span className="rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)]">
                      {project.status}
                    </span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {project.premise || "尚未记录初始构想。"}
                  </p>
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>{project.genre || "题材待定"}</span>
                    <span>{formatDate(project.updatedAt)} 更新</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required = false,
  children,
}: Readonly<{
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label} {required ? <span className="text-[var(--accent)]">*</span> : null}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-white placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none";

const toMessage = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  return "发生未知错误，请稍后重试。";
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(new Date(value));
