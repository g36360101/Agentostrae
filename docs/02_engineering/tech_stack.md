# 技术栈决策

## 1. 最终选择

AgentOS 第一版采用：

```text
Monorepo：pnpm workspace / Turborepo
Web 端：Next.js + React + TypeScript
微信小程序：Taro + React + TypeScript
后端：NestJS + TypeScript
数据库：PostgreSQL
ORM：Prisma
缓存 / 队列：Redis + BullMQ
AI 层：packages/ai-core + AIOrchestratorService
请求状态：TanStack Query
Web UI：Tailwind CSS + shadcn/ui
小程序 UI：Taro 组件 + 自建业务组件
导出：Markdown 优先，后续 DOCX / PDF
部署：Web 和 API 分开部署，数据库使用 PostgreSQL 托管或自建实例
```

一句话：

> Web 是完整创作工作台，小程序是轻量入口和移动审核端，后端统一承载项目、资产、AI 任务和导出能力。

## 2. 为什么采用这套方案

### 2.1 TypeScript 全栈

项目里有大量结构化对象：

- Project
- ProjectIdea
- HighConceptCandidate
- ProjectCoreCard
- DevelopmentPlan
- StoryAsset
- StoryRelation
- ContextPack
- AIJob

这些对象会同时出现在 Web、小程序、后端、AI 输出 schema 和数据库中。

TypeScript 全栈可以让类型、枚举、DTO、校验规则在 `packages/shared` 中复用，减少接口漂移。

### 2.2 Web 端使用 Next.js

Web 端是主工作台，承担复杂创作能力：

- 开发案编辑。
- 高概念比较。
- 资产审核。
- 关系管理。
- AI 对话。
- 导出。
- 后续图谱、版本和冲突检测。

Next.js 适合做复杂 React Web 应用，也方便后续支持服务端渲染、权限页面、导出入口和管理后台。

### 2.3 微信小程序使用 Taro React

小程序不是主编辑器，而是轻量入口：

- 快速记录灵感。
- 查看项目状态。
- 查看核心卡。
- 审核少量候选资产。
- 接收 AI 任务状态。
- 移动端继续简单对话。

Taro 允许继续使用 React + TypeScript，和 Web 端共享类型、API client、业务常量和部分工具函数。

### 2.4 后端使用 NestJS

后端会有清晰模块边界：

- Auth
- Projects
- Ideas
- HighConcepts
- CoreCards
- DevelopmentPlans
- Assets
- Relations
- ContextPacks
- AIOrchestrator
- Exports

NestJS 的模块化结构适合这个项目，不容易把 AI 调用、数据库写入和业务流程混在一起。

### 2.5 数据库使用 PostgreSQL + Prisma

作品设定工具需要关系型数据：

- 项目和用户。
- 资产和关系。
- AI 任务记录。
- 上下文包。
- 导出记录。
- 审核状态。

PostgreSQL 适合做主数据库。Prisma 提供类型安全的数据访问和迁移管理，和 TypeScript 体系一致。

### 2.6 Redis + BullMQ 用于异步任务

AI 生成、资产抽取、导出 DOCX / PDF 都可能是长任务。

初期可以先同步或简化，进入真实模型调用后应使用：

- Redis 存任务队列。
- BullMQ 执行后台任务。
- AIJob 记录任务状态。

## 3. 推荐目录结构

```text
agentOS/
  apps/
    web/                  # Next.js Web 主工作台
    miniapp/              # Taro 微信小程序
    api/                  # NestJS 后端 API
  packages/
    shared/               # 共享类型、枚举、Zod schema、DTO
    api-client/           # Web 和小程序共用 API client
    ai-core/              # AI 任务、Prompt、结构化输出 schema、解析器
    db/                   # Prisma schema、migration、seed
    ui-tokens/            # 跨端设计 token、颜色、间距、文案常量
  assets/
    samples/              # 样例项目、Mock 输出、导出样例
  docs/
  infra/
  scripts/
  tests/
```

注意：不要强求 Web 和小程序共享同一套 UI 组件。共享类型、协议、API client、业务规则即可。

## 4. Web 和小程序的职责边界

### 4.1 Web 端优先做完整能力

Web 端负责：

- 项目完整工作台。
- 高概念生成和比较。
- 作品核心卡编辑。
- 开发案查看和编辑。
- 资产批量审核。
- 关系审核和管理。
- AI 上下文包构建。
- 项目内 AI 对话。
- Markdown / DOCX / PDF 导出。
- 后续图谱、版本历史、质量检查。

### 4.2 小程序优先做轻量能力

小程序负责：

- 登录和项目列表。
- 快速记录灵感。
- 查看作品核心卡。
- 查看开发案摘要。
- 审核少量候选资产。
- 查看 AI 任务状态。
- 简单项目内对话。
- 接收提醒和继续任务入口。

小程序第一版不负责：

- 复杂开发案编辑。
- 大批量资产审核。
- 复杂图谱。
- DOCX / PDF 导出。
- 管理后台。

## 5. 应用间共享内容

建议共享：

- 类型定义。
- 枚举。
- Zod schema。
- API client。
- AI 任务类型。
- 资产类型。
- 关系类型。
- 状态枚举。
- 基础文案常量。
- 设计 token。

不建议共享：

- 复杂 UI 组件。
- 页面布局。
- 富文本编辑器。
- Web 专用图谱组件。
- 小程序专用交互组件。

## 6. 初期工程落地顺序

第一阶段按这个顺序创建：

1. 初始化 pnpm workspace。
2. 创建 `packages/shared`。
3. 创建 `packages/db` 和 Prisma schema 草案。
4. 创建 `packages/ai-core`。
5. 创建 `apps/api` NestJS。
6. 创建 `apps/web` Next.js。
7. 创建 `apps/miniapp` Taro。
8. 创建 `packages/api-client`。
9. 准备 `assets/samples`。
10. 接入统一 lint、format、typecheck。

原因：

- 先稳定共享类型和数据模型。
- 后端先有 API 协议。
- Web 端作为主工作台优先验证主链路。
- 小程序跟随 API 和共享类型做轻量入口。

## 7. 初期技术原则

### 7.1 先协议，后智能

AI 可以先 Mock，但接口、schema、状态流转必须认真设计。

### 7.2 Web 优先，小程序跟随

完整创作体验先在 Web 打磨，小程序只承载移动端最自然的动作。

### 7.3 共享业务，不强行共享界面

跨端复用的重点是类型、协议、规则和 API，不是把同一套页面塞进两个端。

### 7.4 AI 任务异步化预留

初期可以同步返回 Mock，真实模型调用阶段必须能切到 AIJob + 队列。

### 7.5 导出先 Markdown

Markdown 最快形成可用交付，也最适合验证内容结构。DOCX / PDF 在中期增强。

## 8. 备选方案记录

### 8.1 为什么不选 uni-app

uni-app 更适合 Vue 技术栈。如果团队更熟 Vue，可以考虑。但当前项目 Web 主工作台更适合 React + Next.js，Taro React 能保持端侧技术一致。

### 8.2 为什么不直接用原生微信小程序

原生小程序可以做，但类型、API、业务规则和 Web 端复用成本更高。Taro 更适合当前的 TypeScript monorepo。

### 8.3 为什么不只用 Next.js 做 H5

H5 可以快速上线，但微信小程序有更强的微信生态入口、提醒、分享和移动端访问习惯。长期看，小程序值得作为独立端。

## 9. 当前决策

本项目正式采用：

```text
Next.js Web 主工作台
+ Taro React 微信小程序
+ NestJS API
+ PostgreSQL / Prisma
+ Redis / BullMQ
+ TypeScript monorepo
```

后续所有工程文档、目录规划、开发步骤和任务拆分都以这套方案为准。
