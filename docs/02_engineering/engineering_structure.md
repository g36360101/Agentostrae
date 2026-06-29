# 工程结构建议

## 总体架构

```text
Web UI (Next.js)
Miniapp UI (Taro React)
  -> Shared API Client
  -> API Server (NestJS)
    -> Database
    -> Queue / Cache
    -> AI Orchestrator
      -> Prompt Task
      -> Model Provider
      -> Structured Output Parser
      -> Safety / Validation
```

## 应用边界

### apps/web

负责：

- Next.js Web 主工作台。
- 复杂页面。
- 表单。
- 用户操作流程。
- 调用 API。
- 展示生成结果。
- 提供确认 / 保存 / 导出操作。

不负责：

- 直接调用 AI。
- 拼接复杂 Prompt。
- 直接写数据库。

### apps/miniapp

负责：

- 微信小程序轻量入口。
- 快速记录灵感。
- 查看项目状态。
- 查看作品核心卡。
- 审核少量候选资产。
- 查看 AI 任务状态。
- 简单项目内对话。

不负责：

- 复杂开发案编辑。
- 大批量资产审核。
- 复杂图谱。
- DOCX / PDF 导出。
- 管理后台。

### apps/api

负责：

- 用户认证。
- 项目与资产 API。
- 权限校验。
- AI 任务调度。
- 数据持久化。
- 导出。

### packages/shared

负责：

- 共享类型。
- 枚举。
- DTO 类型。
- 简单校验规则。

### packages/api-client

负责：

- Web 和小程序共用 API client。
- 请求类型约束。
- API 错误格式归一。
- 认证 token 注入。

### packages/ai-core

负责：

- AI 任务定义。
- Prompt 模板。
- 结构化输出 schema。
- 输出解析。
- 输出质量检查。

### packages/db

负责：

- Prisma schema。
- migrations。
- seed 数据。
- 数据库说明。

### packages/ui-tokens

负责：

- 跨端设计 token。
- 颜色。
- 间距。
- 字体尺度。
- 基础文案常量。

## 模块划分

后端初期建议模块：

```text
AuthModule
ProjectsModule
IdeasModule
HighConceptsModule
CoreCardsModule
DevelopmentPlansModule
AssetsModule
RelationsModule
ContextPacksModule
AIOrchestratorModule
ExportsModule
MiniappAuthModule
TaskQueueModule
```

## 核心设计取舍

### 1. AI 输出必须结构化

所有关键 AI 任务都要返回 JSON，而不是只返回自然语言。

### 2. AI 建议不能直接入库

资产和关系必须有状态：

- suggested
- confirmed
- rejected
- archived

### 3. 项目正史和草稿分开

开发案可以更新，但已确认资产要有明确来源和状态。

### 4. context_pack 是核心中间层

AI 对话不要直接把整个项目塞进 Prompt，而是通过 context_pack 控制范围、优先级和剧透风险。

### 5. 先 Mock，后真实模型

Mock 不是偷懒，是为了先稳定产品协议和界面流程。

### 6. Web 和小程序分端开发

Web 端负责完整创作工作台，小程序负责轻量入口和移动端审核。

共享类型、API client、业务规则和设计 token，但不强求共享复杂 UI 组件。

### 7. AI 长任务预留队列

AI 生成、资产抽取和导出都可能变成长任务。

初期可以同步 Mock，真实模型调用阶段切到 Redis + BullMQ + AIJob 状态记录。
