# AgentOS Slice 1 Design — 创建并重新打开项目

- 日期：2026-06-29
- 范围：第一纵向切片（Phase 1 起始）
- 目标：用户可以创建项目、查看列表、打开项目详情，创建后自动进入详情页

## 背景

Phase 0 工程地基已完成。后端 `ProjectsController` 和 `ProjectsService` 的 CRUD 骨架已就绪，前端项目列表和详情页占位已存在。本切片将前后端串联，形成第一个可演示的用户闭环。

## 用户流程

```
/projects（工作台）
  ├── 查看已有项目列表（加载/空态/错误处理）
  ├── 填写「创建项目」表单（标题、题材、初始构想）
  ├── 提交 → POST /projects → 数据库保存
  └── 创建成功后自动跳转到 /projects/:id（详情页）

/projects/:id（项目详情）
  ├── 展示项目标题、题材、状态、初始构想、更新时间
  └── 返回链接回到列表
```

## 状态映射

| 用户动作 | 前端状态 | 后端行为 | 数据保存 |
|---|---|---|---|
| 进入工作台 | loading → ready/error | GET /projects | 读取 projects 表 |
| 提交创建表单 | 提交中 → 跳转 | POST /projects | 写入 projects 表 |
| 进入详情页 | 加载中 → 展示 | GET /projects/:id | 读取 projects 表 |

## 错误处理

- 表单校验失败：Zod 在 API 层拦截，前端展示 `ApiClientError.message`
- 网络/API 不可用：前端展示错误态，提供「重试」按钮
- 项目不存在：后端返回 404，前端展示错误信息
- 未授权：前端检测到 `UNAUTHORIZED` 错误码，引导到登录页

## 需要改动的文件

### 1. `apps/web/app/projects/projects-workspace.tsx`

- 导入 `useRouter`（next/navigation）
- `handleCreate` 成功后调用 `router.push(\`/projects/${response.data.id}\`)`
- 保持现有列表刷新行为作为 fallback

### 2. `apps/web/app/projects/[projectId]/project-detail.tsx`

- 补充 `status` 状态标签展示（draft / active / archived）
- 补充 `updatedAt` 格式化展示

### 后端文件

无需改动。`ProjectsController` 和 `ProjectsService` 的 create/list/get 已实现并通过测试。

## 测试策略

- API 测试：现有 `test/projects.test.ts` 已覆盖 create/list/get，无需新增
- 前端测试：本切片以手动验证为主，Web 端测试框架已就位但暂不增加测试文件
- 验收：创建项目后自动跳转到详情页，刷新后数据仍在

## 验收标准

- [ ] 从工作台创建项目，提交后自动进入项目详情页
- [ ] 详情页展示完整信息：标题、题材、状态、初始构想、更新时间
- [ ] 返回项目列表后，新项目出现在列表首位
- [ ] 刷新页面后数据不丢失
- [ ] lint / typecheck / test / build 全部通过

## 风险

- 无。改动范围极小，只涉及 2 个前端文件，后端已稳定。
