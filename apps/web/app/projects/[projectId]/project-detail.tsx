"use client";

import { ApiClient, ApiClientError } from "@agentos/api-client";
import type { Project } from "@agentos/shared";
import { useEffect, useMemo, useState } from "react";

export function ProjectDetail({ projectId }: Readonly<{ projectId: string }>) {
  const api = useMemo(
    () =>
      new ApiClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
      }),
    [],
  );
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void api
      .getProject(projectId)
      .then((response) => setProject(response.data))
      .catch((reason: unknown) =>
        setError(reason instanceof ApiClientError ? reason.message : "读取项目失败"),
      );
  }, [api, projectId]);

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-md border border-[var(--danger)]/40 p-5 text-[var(--danger)]"
      >
        {error}
      </p>
    );
  }

  if (!project) {
    return (
      <p aria-live="polite" className="text-[var(--muted)]">
        正在打开项目…
      </p>
    );
  }

  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-9">
      <div className="mb-8 border-b border-[var(--border)] pb-6">
        <p className="mb-2 text-sm text-[var(--accent)]">项目工作台</p>
        <h1 className="mb-3 font-serif text-4xl">{project.title}</h1>
        <p className="text-[var(--muted)]">{project.genre || "题材待定"}</p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-xl">初始构想</h2>
        <p className="max-w-3xl whitespace-pre-wrap leading-7 text-[var(--muted)]">
          {project.premise || "尚未记录初始构想。"}
        </p>
      </section>

      <section className="rounded-md border border-dashed border-[var(--border)] p-6">
        <p className="mb-2 font-medium">下一步：输入创意</p>
        <p className="text-sm leading-6 text-[var(--muted)]">
          当前切片已经完成项目持久化。创意输入将在本切片验收后开始开发。
        </p>
      </section>
    </article>
  );
}
