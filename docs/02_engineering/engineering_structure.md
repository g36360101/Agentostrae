# 工程结构建议

## 总体架构

```text
Web UI
  -> API Server
    -> Database
    -> AI Orchestrator
      -> Prompt Task
      -> Model Provider
      -> Structured Output Parser
      -> Safety / Validation
```

## 应用边界

### apps/web

负责：

- 页面。
- 表单。
- 用户操作流程。
- 调用 API。
- 展示生成结果。
- 提供确认 / 保存 / 导出操作。

不负责：

- 直接调用 AI。
- 拼接复杂 Prompt。
- 直接写数据库。

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

