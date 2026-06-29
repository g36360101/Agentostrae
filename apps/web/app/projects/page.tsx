import Link from "next/link";
import { AccountActions } from "./account-actions";
import { ProjectsWorkspace } from "./projects-workspace";

export default function ProjectsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-6 py-6 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <Link href="/" className="mb-3 inline-block text-sm text-[var(--muted)] hover:text-white">
            ← 返回首页
          </Link>
          <p className="mb-1 text-xs tracking-[0.22em] text-[var(--accent)] uppercase">Projects</p>
          <h1 className="font-serif text-3xl">作品项目</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AccountActions />
          <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
            项目会真实保存到 PostgreSQL，并按登录账户隔离。
          </p>
        </div>
      </header>

      <ProjectsWorkspace />
    </main>
  );
}
