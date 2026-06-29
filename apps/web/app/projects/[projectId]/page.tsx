import Link from "next/link";
import { ProjectDetail } from "./project-detail";

export default async function ProjectPage({
  params,
}: Readonly<{ params: Promise<{ projectId: string }> }>) {
  const { projectId } = await params;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-6 lg:px-10">
      <Link
        href="/projects"
        className="mb-6 inline-block text-sm text-[var(--muted)] hover:text-white"
      >
        ← 返回项目列表
      </Link>
      <ProjectDetail projectId={projectId} />
    </main>
  );
}
