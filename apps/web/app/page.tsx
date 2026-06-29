import Link from "next/link";
import { HealthStatus } from "./health-status";

const steps = [
  { name: "创建项目", state: "当前入口" },
  { name: "输入创意", state: "下一步" },
  { name: "生成高概念", state: "Mock 就绪" },
  { name: "保存核心卡", state: "等待开发" },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 py-5 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="mb-1 text-xs tracking-[0.22em] text-[var(--accent)] uppercase">AgentOS</p>
          <h1 className="font-serif text-2xl tracking-tight">作品设定工作台</h1>
        </div>
        <HealthStatus />
      </header>

      <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm text-[var(--accent)]">第一里程碑</p>
            <h2 className="mb-4 font-serif text-3xl leading-tight lg:text-4xl">
              从一个模糊创意，开始建立可持续生长的作品。
            </h2>
            <p className="leading-7 text-[var(--muted)]">
              当前工程地基用于跑通“创建项目 → 高概念 → 作品核心卡”。AI
              只提出候选，所有正史内容都由你确认。
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex rounded-md bg-[var(--accent)] px-5 py-3 font-medium text-[#17130c] transition hover:brightness-110"
          >
            进入项目工作台
          </Link>
        </article>

        <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-6">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-xl">准备进度</h2>
            <span className="text-xs text-[var(--muted)]">Phase 1A</span>
          </div>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li
                key={step.name}
                className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--border)] text-xs text-[var(--muted)]">
                    {index + 1}
                  </span>
                  <span>{step.name}</span>
                </div>
                <span className="text-xs text-[var(--muted)]">{step.state}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <footer className="border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        AI 建议默认处于 suggested 状态，未经确认不会写入作品正史。
      </footer>
    </main>
  );
}
