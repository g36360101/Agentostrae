"use client";

import { ApiClient, ApiClientError } from "@agentos/api-client";
import type {
  HighConceptCandidate,
  Project,
  ProjectCoreCard,
  ProjectIdea,
  UpdateCoreCardInput,
} from "@agentos/shared";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const api = new ApiClient({ baseUrl: "http://localhost:4000" });

interface IdeaForm {
  rawText: string;
  genrePreference: string;
  readerExpectation: string;
  tabooNotes: string;
  referenceVibe: string;
}

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const statusLabel: Record<string, string> = {
  draft: "草稿",
  active: "进行中",
  archived: "已归档",
};

const toMessage = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  return "发生未知错误，请稍后重试。";
};

export function ProjectDetail({
  projectId,
}: Readonly<{ projectId: string }>) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [candidates, setCandidates] = useState<HighConceptCandidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateError, setCandidateError] = useState("");

  const [ideaForm, setIdeaForm] = useState<IdeaForm>({
    rawText: "",
    genrePreference: "",
    readerExpectation: "",
    tabooNotes: "",
    referenceVibe: "",
  });
  const [submittingIdea, setSubmittingIdea] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [submittedIdea, setSubmittedIdea] = useState<ProjectIdea | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const [coreCard, setCoreCard] = useState<ProjectCoreCard | null>(null);
  const [loadingCoreCard, setLoadingCoreCard] = useState(false);
  const [coreCardError, setCoreCardError] = useState("");
  const [selectingCandidate, setSelectingCandidate] = useState<string | null>(
    null,
  );
  const [isEditingCoreCard, setIsEditingCoreCard] = useState(false);
  const [editForm, setEditForm] = useState<UpdateCoreCardInput>({});
  const [savingCoreCard, setSavingCoreCard] = useState(false);
  const [saveError, setSaveError] = useState("");

  const loadProject = useCallback(async () => {
    try {
      const response = await api.getProject(projectId);
      setProject(response.data);
      setError("");
    } catch (err: unknown) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const loadCandidates = useCallback(async () => {
    setLoadingCandidates(true);
    setCandidateError("");
    try {
      const response = await api.listHighConceptCandidates(projectId);
      setCandidates(response.data);
    } catch (err: unknown) {
      setCandidateError(toMessage(err));
    } finally {
      setLoadingCandidates(false);
    }
  }, [projectId]);

  const loadCoreCard = useCallback(async () => {
    setLoadingCoreCard(true);
    setCoreCardError("");
    try {
      const response = await api.getCoreCard(projectId);
      setCoreCard(response.data as ProjectCoreCard);
    } catch (err: unknown) {
      const msg = toMessage(err);
      if (msg.includes("404")) {
        setCoreCard(null);
      } else {
        setCoreCardError(msg);
      }
    } finally {
      setLoadingCoreCard(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
    void loadCandidates();
    void loadCoreCard();
  }, [loadProject, loadCandidates, loadCoreCard]);

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaForm.rawText.trim()) return;

    setSubmittingIdea(true);
    setIdeaError("");
    try {
      const response = await api.createProjectIdea(projectId, {
        rawText: ideaForm.rawText,
        genrePreference: ideaForm.genrePreference || undefined,
        readerExpectation: ideaForm.readerExpectation || undefined,
        tabooNotes: ideaForm.tabooNotes || undefined,
        referenceVibe: ideaForm.referenceVibe || undefined,
        aiCreativityLevel: 0.7,
      });
      setSubmittedIdea(response.data as ProjectIdea);
      setIdeaForm({
        rawText: "",
        genrePreference: "",
        readerExpectation: "",
        tabooNotes: "",
        referenceVibe: "",
      });
    } catch (err: unknown) {
      setIdeaError(toMessage(err));
    } finally {
      setSubmittingIdea(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError("");
    try {
      const response = await api.generateHighConcepts(projectId);
      setCandidates(response.data);
    } catch (err: unknown) {
      setGenerateError(toMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectCandidate = async (candidateId: string) => {
    setSelectingCandidate(candidateId);
    try {
      const response = await api.createCoreCard(projectId, candidateId);
      setCoreCard(response.data as ProjectCoreCard);
      await loadCandidates();
    } catch (err: unknown) {
      setCoreCardError(toMessage(err));
    } finally {
      setSelectingCandidate(null);
    }
  };

  const handleStartEdit = () => {
    if (!coreCard) return;
    setEditForm({
      title: coreCard.title,
      genre: coreCard.genre ?? undefined,
      logline: coreCard.logline,
      readerPromise: coreCard.readerPromise,
      worldviewSummary: coreCard.worldviewSummary,
      protagonistSummary: coreCard.protagonistSummary,
      protagonistGap: coreCard.protagonistGap,
      centralConflict: coreCard.centralConflict,
      antagonistForce: coreCard.antagonistForce,
      longTermMystery: coreCard.longTermMystery,
      themeStatement: coreCard.themeStatement,
      targetReader: coreCard.targetReader,
    });
    setSaveError("");
    setIsEditingCoreCard(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCoreCard(true);
    setSaveError("");
    try {
      const response = await api.updateCoreCard(projectId, editForm);
      setCoreCard(response.data as ProjectCoreCard);
      setIsEditingCoreCard(false);
    } catch (err: unknown) {
      setSaveError(toMessage(err));
    } finally {
      setSavingCoreCard(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--muted)]">正在打开项目…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || "项目不存在"}</p>
        <Link
          href="/projects"
          className="text-sm text-[var(--accent)] hover:underline"
        >
          ← 返回项目列表
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 border-b border-[var(--border)] pb-6">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-sm text-[var(--accent)]">项目工作台</p>
          <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
            {statusLabel[project.status] ?? project.status}
          </span>
        </div>
        <h1 className="mb-3 font-serif text-4xl">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
          <span>{project.genre || "题材待定"}</span>
          <span>·</span>
          <span>更新于 {formatDate(project.updatedAt)}</span>
        </div>
      </div>

      {project.premise && (
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">初始构想</h2>
          <p className="leading-relaxed text-[var(--muted)]">
            {project.premise}
          </p>
        </section>
      )}

      <section className="mb-10 border-t border-[var(--border)] pt-8">
        <h2 className="mb-4 text-lg font-semibold">输入创意</h2>
        {submittedIdea ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="mb-2 text-sm text-[var(--accent)]">
              创意已保存，可以生成高概念候选
            </p>
            <p className="mb-3 text-sm text-[var(--muted)] line-clamp-3">
              {submittedIdea.rawText}
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--bg)] transition hover:opacity-90 disabled:opacity-50"
            >
              {generating ? "生成中…" : "生成高概念候选"}
            </button>
            {generateError && (
              <p className="mt-2 text-sm text-red-400">{generateError}</p>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleIdeaSubmit}
            className="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div>
              <label className="mb-1 block text-sm text-[var(--muted)]">
                原始创意 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={ideaForm.rawText}
                onChange={(e) =>
                  setIdeaForm((f) => ({ ...f, rawText: e.target.value }))
                }
                placeholder="描述你的创意，至少10个字…"
                rows={4}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                required
                minLength={10}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-[var(--muted)]">
                  题材偏好
                </label>
                <input
                  value={ideaForm.genrePreference}
                  onChange={(e) =>
                    setIdeaForm((f) => ({
                      ...f,
                      genrePreference: e.target.value,
                    }))
                  }
                  placeholder="例如：玄幻悬疑"
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--muted)]">
                  参考氛围
                </label>
                <input
                  value={ideaForm.referenceVibe}
                  onChange={(e) =>
                    setIdeaForm((f) => ({
                      ...f,
                      referenceVibe: e.target.value,
                    }))
                  }
                  placeholder="例如：《三体》式硬科幻"
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-[var(--muted)]">
                读者预期
              </label>
              <textarea
                value={ideaForm.readerExpectation}
                onChange={(e) =>
                  setIdeaForm((f) => ({
                    ...f,
                    readerExpectation: e.target.value,
                  }))
                }
                placeholder="希望读者获得怎样的阅读体验？"
                rows={2}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[var(--muted)]">
                禁忌备注
              </label>
              <textarea
                value={ideaForm.tabooNotes}
                onChange={(e) =>
                  setIdeaForm((f) => ({ ...f, tabooNotes: e.target.value }))
                }
                placeholder="有哪些元素或情节需要避免？"
                rows={2}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            {ideaError && (
              <p className="text-sm text-red-400">{ideaError}</p>
            )}
            <button
              type="submit"
              disabled={submittingIdea}
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--bg)] transition hover:opacity-90 disabled:opacity-50"
            >
              {submittingIdea ? "保存中…" : "保存创意"}
            </button>
          </form>
        )}
      </section>

      <section className="mb-10 border-t border-[var(--border)] pt-8">
        <h2 className="mb-4 text-lg font-semibold">高概念候选</h2>
        {loadingCandidates ? (
          <p className="text-sm text-[var(--muted)]">加载中…</p>
        ) : candidateError ? (
          <p className="text-sm text-red-400">{candidateError}</p>
        ) : candidates.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            尚未生成高概念候选。先输入创意并点击「生成高概念候选」。
          </p>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`rounded-lg border bg-[var(--surface)] p-4 transition ${
                  coreCard?.sourceCandidateId === candidate.id
                    ? "border-[var(--accent)]"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{candidate.title}</h3>
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]">
                      {candidate.genre}
                    </span>
                    {coreCard?.sourceCandidateId === candidate.id && (
                      <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-[var(--bg)]">
                        已选择
                      </span>
                    )}
                  </div>
                  {coreCard?.sourceCandidateId !== candidate.id && (
                    <button
                      onClick={() => handleSelectCandidate(candidate.id)}
                      disabled={
                        !!selectingCandidate || !!coreCard
                      }
                      className="rounded-md border border-[var(--border)] px-3 py-1 text-xs transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
                    >
                      {selectingCandidate === candidate.id
                        ? "处理中…"
                        : "选择此方向"}
                    </button>
                  )}
                </div>
                <p className="mb-2 text-sm text-[var(--muted)]">
                  {candidate.logline}
                </p>
                <p className="text-sm">
                  <span className="text-[var(--accent)]">核心钩子：</span>
                  {candidate.coreHook}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10 border-t border-[var(--border)] pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">作品核心卡</h2>
          {coreCard && !isEditingCoreCard && (
            <button
              onClick={handleStartEdit}
              className="rounded-md border border-[var(--border)] px-3 py-1 text-xs transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              编辑
            </button>
          )}
        </div>
        {loadingCoreCard ? (
          <p className="text-sm text-[var(--muted)]">加载中…</p>
        ) : coreCardError ? (
          <p className="text-sm text-red-400">{coreCardError}</p>
        ) : !coreCard ? (
          <p className="text-sm text-[var(--muted)]">
            尚未保存核心卡。从高概念候选中选择一个方向来生成核心卡。
          </p>
        ) : isEditingCoreCard ? (
          <form
            onSubmit={handleSaveEdit}
            className="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">标题</label>
                <input
                  value={editForm.title ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">题材</label>
                <input
                  value={editForm.genre ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, genre: e.target.value }))}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted)]">一句话承诺</label>
              <textarea
                value={editForm.logline ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, logline: e.target.value }))}
                rows={2}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted)]">世界观概述</label>
              <textarea
                value={editForm.worldviewSummary ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, worldviewSummary: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">主角</label>
                <textarea
                  value={editForm.protagonistSummary ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, protagonistSummary: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">主角缺陷</label>
                <textarea
                  value={editForm.protagonistGap ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, protagonistGap: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">核心冲突</label>
                <textarea
                  value={editForm.centralConflict ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, centralConflict: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">对立力量</label>
                <textarea
                  value={editForm.antagonistForce ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, antagonistForce: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted)]">长期悬念</label>
              <textarea
                value={editForm.longTermMystery ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, longTermMystery: e.target.value }))}
                rows={2}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">主题</label>
                <textarea
                  value={editForm.themeStatement ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, themeStatement: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">读者承诺</label>
                <textarea
                  value={editForm.readerPromise ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, readerPromise: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--muted)]">目标读者</label>
              <input
                value={editForm.targetReader ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, targetReader: e.target.value }))}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            {saveError && <p className="text-sm text-red-400">{saveError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingCoreCard}
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-[var(--bg)] transition hover:opacity-90 disabled:opacity-50"
              >
                {savingCoreCard ? "保存中…" : "保存修改"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingCoreCard(false)}
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm transition hover:border-[var(--accent)]"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="mb-1 font-serif text-2xl">{coreCard.title}</h3>
              <p className="text-sm text-[var(--muted)]">
                版本 {coreCard.version} · {coreCard.genre}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                一句话承诺
              </p>
              <p className="text-sm">{coreCard.logline}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                世界观概述
              </p>
              <p className="text-sm">{coreCard.worldviewSummary}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                  主角
                </p>
                <p className="text-sm">{coreCard.protagonistSummary}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                  主角缺陷
                </p>
                <p className="text-sm">{coreCard.protagonistGap}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                  核心冲突
                </p>
                <p className="text-sm">{coreCard.centralConflict}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                  对立力量
                </p>
                <p className="text-sm">{coreCard.antagonistForce}</p>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                主题
              </p>
              <p className="text-sm">{coreCard.themeStatement}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--accent)]">
                读者承诺
              </p>
              <p className="text-sm">{coreCard.readerPromise}</p>
            </div>
          </div>
        )}
      </section>

      <div className="mt-8">
        <Link
          href="/projects"
          className="text-sm text-[var(--accent)] hover:underline"
        >
          ← 返回项目列表
        </Link>
      </div>
    </div>
  );
}
