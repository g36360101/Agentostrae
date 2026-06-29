# Slice 1: 创建并重新打开项目 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建项目后自动跳转到项目详情页，详情页展示完整项目信息。

**Architecture:** 在现有前端代码基础上补充 2 处交互和展示逻辑。后端 API 已就绪，无需改动。

**Tech Stack:** Next.js App Router, React hooks, Tailwind CSS

---

### Task 1: 创建成功后自动跳转详情页

**Files:**
- Modify: `apps/web/app/projects/projects-workspace.tsx`

- [ ] **Step 1: 导入 `useRouter`**

在现有 import 中增加 `useRouter`：

```tsx
import { useRouter } from "next/navigation";
```

- [ ] **Step 2: 在组件内获取 router**

在 `ProjectsWorkspace` 组件顶部，现有 state 声明之后添加：

```tsx
const router = useRouter();
```

- [ ] **Step 3: 修改 `handleCreate` 成功后跳转**

将现有的创建成功逻辑：

```tsx
setProjects((current) => [response.data, ...current]);
form.reset();
```

替换为跳转行为：

```tsx
router.push(`/projects/${response.data.id}`);
```

删除 `form.reset()`（跳转后页面卸载，无需重置）。

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/projects/projects-workspace.tsx
git commit -m "feat(web): navigate to project detail after creation"
```

---

### Task 2: 详情页补充状态标签和更新时间

**Files:**
- Modify: `apps/web/app/projects/[projectId]/project-detail.tsx`

- [ ] **Step 1: 添加日期格式化函数**

在文件底部 `toMessage` 函数附近添加：

```tsx
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
```

- [ ] **Step 2: 修改详情页头部展示**

将现有的标题区域：

```tsx
<div className="mb-8 border-b border-[var(--border)] pb-6">
  <p className="mb-2 text-sm text-[var(--accent)]">项目工作台</p>
  <h1 className="mb-3 font-serif text-4xl">{project.title}</h1>
  <p className="text-[var(--muted)]">{project.genre || "题材待定"}</p>
</div>
```

替换为带状态和更新时间的展示：

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/projects/[projectId]/project-detail.tsx
git commit -m "feat(web): show project status and update time on detail"
```

---

### Task 3: 验证

- [ ] **Step 1: 运行 lint**

```bash
pnpm lint
```

Expected: 0 errors

- [ ] **Step 2: 运行 typecheck**

```bash
pnpm typecheck
```

Expected: 全部通过

- [ ] **Step 3: 运行 test**

```bash
pnpm test
```

Expected: 24 tests passed, 0 failed

- [ ] **Step 4: 运行 build**

```bash
pnpm build
```

Expected: 7 packages build success

- [ ] **Step 5: Commit（如有额外修复）**

---

## Spec Coverage Check

| 需求 | 对应 Task |
|---|---|
| 创建项目表单 | 已有代码，无需改动 |
| 项目持久化 | 后端已有，无需改动 |
| 创建后重新打开 | Task 1 |
| 项目详情展示 | Task 2 |
| 成功/失败状态 | 已有代码（错误处理、加载态） |
| lint/typecheck/test/build | Task 3 |
