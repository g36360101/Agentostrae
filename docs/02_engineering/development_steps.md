# 开发初期步骤

## 阶段 0：仓库初始化

产出：

- 前端工程。
- 后端工程。
- 共享类型包。
- 数据库包。
- AI 核心包。
- 本地环境说明。

建议命令后续再执行，不在文档阶段强行生成：

```text
apps/web        React / Next.js 前端
apps/api        NestJS 后端
packages/shared 共享 TypeScript 类型
packages/db     Prisma schema 和迁移
packages/ai-core AI 任务定义和 Prompt 模板
```

## 阶段 1：最小数据模型

先建这些表：

- users
- projects
- project_ideas
- high_concept_candidates
- project_core_cards
- development_plans
- story_assets
- story_relations
- context_packs
- ai_jobs
- exports

先不要建太多治理、审计、策略、实验表。

## 阶段 2：后端 P0 API

优先接口：

```text
POST   /auth/register
POST   /auth/login

POST   /projects
GET    /projects
GET    /projects/:projectId
PATCH  /projects/:projectId

POST   /projects/:projectId/ideas
POST   /projects/:projectId/high-concepts/generate
POST   /projects/:projectId/high-concepts/:candidateId/select

POST   /projects/:projectId/core-card/generate
GET    /projects/:projectId/core-card

POST   /projects/:projectId/development-plan/generate
GET    /projects/:projectId/development-plan

POST   /projects/:projectId/assets/extract
GET    /projects/:projectId/assets
POST   /projects/:projectId/assets/confirm

GET    /projects/:projectId/relations
POST   /projects/:projectId/context-packs/build

POST   /projects/:projectId/chat
POST   /projects/:projectId/exports
```

## 阶段 3：前端 P0 页面

页面顺序：

1. 登录 / 注册。
2. 项目列表。
3. 创建项目。
4. 项目工作台。
5. 创意输入与高概念候选。
6. 作品核心卡。
7. 作品开发案。
8. 设定资产库。
9. 项目 AI 对话。
10. 导出页。

项目工作台应该成为中心页，而不是做一堆分散工具。

## 阶段 4：AI Mock 到真实调用

开发初期允许 Mock AI 输出，但返回格式必须从第一天就稳定。

AI 任务统一格式：

```text
task_type
project_id
input
context_pack_id?
model_config
structured_output_schema
```

第一批 AI 任务：

- generate_high_concepts
- generate_core_card
- generate_development_plan
- extract_story_assets
- extract_story_relations
- build_context_pack_summary
- project_chat

## 阶段 5：验收闭环

用 3 个样例项目测试：

1. 玄幻升级流。
2. 都市悬疑。
3. 科幻群像。

每个样例都要跑通：

- 创意输入。
- 高概念生成。
- 开发案生成。
- 资产抽取。
- 上下文对话。
- Markdown 导出。

## 开发节奏建议

每个小功能必须有可见结果：

- 一个页面。
- 一个接口。
- 一个可保存的数据对象。
- 一个可验收的用户动作。

不要写只存在于脑海里的“平台能力”。

