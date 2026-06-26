# Loop Engine 工程设计草案

## 1. 设计目标

Loop Engine 是 AgentOS 的产品骨架。它不负责“变聪明”，而负责让创作流程可执行、可保存、可恢复、可审计。

第一版 Loop Engine 只服务作品设定 MVP。

## 2. 核心概念

### 2.1 LoopDefinition

定义一个可执行循环。

示例：

```text
story_setting_mvp_loop
```

包含：

- loop_key
- display_name
- version
- steps
- transition_rules
- required_entities

### 2.2 LoopRun

某个项目的一次 loop 执行记录。

一个 Project 可以有多个 LoopRun，但第一版默认一个项目一个主 LoopRun。

字段建议：

- id
- project_id
- loop_key
- version
- status
- current_step_key
- started_at
- completed_at
- created_at
- updated_at

状态：

- not_started
- running
- waiting_for_user
- blocked
- completed
- archived

### 2.3 LoopStep

Loop 中的一个节点。

第一版节点：

```text
idea_input
high_concept_generation
high_concept_selection
core_card_generation
development_plan_generation
asset_extraction
asset_review
relation_extraction
relation_review
context_pack_build
project_chat
export
```

### 2.4 LoopStepRun

某个节点的执行记录。

字段建议：

- id
- loop_run_id
- step_key
- status
- input_json
- output_json
- user_decision_json
- ai_job_id
- started_at
- completed_at

状态：

- not_started
- ready
- running
- waiting_for_user
- completed
- failed
- skipped

### 2.5 Transition

节点之间的流转规则。

示例：

```text
high_concept_generation completed -> high_concept_selection ready
high_concept_selection completed -> core_card_generation ready
asset_extraction completed -> asset_review waiting_for_user
asset_review completed -> relation_extraction ready
```

## 3. 第一版数据库增量

在已有数据模型基础上，建议增加三张表：

### creative_loops

保存 loop 定义。

字段：

- id
- loop_key
- name
- version
- definition_json
- is_active
- created_at

### loop_runs

保存项目级 loop 执行状态。

字段：

- id
- project_id
- loop_key
- version
- status
- current_step_key
- created_at
- updated_at
- completed_at

### loop_step_runs

保存每一步执行状态。

字段：

- id
- loop_run_id
- step_key
- status
- input_json
- output_json
- user_decision_json
- ai_job_id
- error_message
- created_at
- updated_at
- completed_at

## 4. API 设计

### 获取项目 loop 状态

```text
GET /projects/:projectId/loop
```

返回：

- loop_run
- current_step
- steps
- available_actions
- next_recommended_action

### 启动 loop

```text
POST /projects/:projectId/loop/start
```

创建 LoopRun，并初始化所有 StepRun。

### 执行当前步骤

```text
POST /projects/:projectId/loop/steps/:stepKey/run
```

用于触发 AI 生成、抽取、构建上下文等动作。

### 提交用户决定

```text
POST /projects/:projectId/loop/steps/:stepKey/decision
```

用于：

- 选择高概念。
- 确认资产。
- 拒绝资产。
- 确认关系。
- 跳过某步。

### 回退到指定步骤

```text
POST /projects/:projectId/loop/steps/:stepKey/reopen
```

第一版只允许回退到最近一个用户确认点。

## 5. Step 执行策略

### 自动步骤

系统可以直接执行：

- high_concept_generation
- core_card_generation
- development_plan_generation
- asset_extraction
- relation_extraction
- context_pack_build

### 人工确认步骤

必须等待用户：

- high_concept_selection
- asset_review
- relation_review
- export

### 半自动步骤

可以持续发生：

- project_chat

## 6. Loop 与 AIJob 的关系

AIJob 不等于 LoopStepRun。

- LoopStepRun 记录产品流程状态。
- AIJob 记录某次 AI 调用。

一个 StepRun 可以关联一个或多个 AIJob。第一版可以先用一个 `ai_job_id`，后面再扩展为关联表。

## 7. Loop 与资产状态的关系

资产和关系状态仍然由资产表自己管理：

```text
suggested -> confirmed / rejected / archived
```

Loop 只负责推动用户进入审核节点，不直接绕过审核。

## 8. 前端呈现

项目工作台顶部显示 loop 进度：

```text
创意
高概念
核心卡
开发案
资产
关系
上下文
对话
导出
```

每个节点可以点击进入对应页面。

当前节点显示主行动按钮：

- 生成高概念。
- 选择方向。
- 生成核心卡。
- 抽取资产。
- 审核资产。
- 构建上下文包。
- 开始项目对话。
- 导出设定文档。

## 9. 第一版不做

- 可视化流程编辑器。
- 多 loop 并行。
- 复杂条件分支。
- 自动重试策略。
- 多 Agent 调度。
- 企业级审批流。

这些都可以等真实使用后再决定。

## 10. 工程实施顺序

1. 增加 loop 数据表。
2. 写死 `story_setting_mvp_loop` 定义。
3. 项目创建后自动创建 LoopRun。
4. 项目工作台读取 loop 状态。
5. 把现有生成动作挂到对应 StepRun。
6. 用户确认后推进下一步。
7. 支持暂停后恢复。
8. 增加导出前完成度检查。

## 11. 验收标准

第一版 Loop Engine 合格标准：

- 用户离开项目后再回来，系统知道下一步该做什么。
- 每个生成动作都有 StepRun 和 AIJob 记录。
- 用户确认资产后，loop 能进入下一步。
- 未完成开发案时，不能进入资产抽取。
- 未确认资产时，可以构建临时 context_pack，但必须标记为 draft。

