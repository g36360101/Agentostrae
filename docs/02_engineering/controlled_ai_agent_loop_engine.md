# 稳定 Loop Engine：受控 AI Agent 执行架构

## 1. 设计目标

本设计的目标是让 Loop Engine 控制 AI Agent 的工作方式，让用户只需要做两类事情：

1. 提供创作思路。
2. 在关键节点做确认、修改或否决。

系统负责：

- 判断当前步骤。
- 准备 AI 上下文。
- 派发 AI 任务。
- 约束 AI 输出格式。
- 校验 AI 结果。
- 把建议转成可审核资产。
- 推进下一步。
- 保存整个过程。

一句话：

> 用户提供意图，Loop Engine 编排过程，AI Agent 生成候选，用户确认正史。

## 2. 核心原则

### 2.1 Loop Engine 是指挥层

AI Agent 不直接决定下一步。

它只能执行 Loop Engine 派发的任务：

```text
step_key + task_type + context_pack + output_schema + constraints
```

AI 可以提出建议，但不能擅自推进流程。

### 2.2 AI Agent 是工人，不是产品经理

AI Agent 负责：

- 生成候选。
- 结构化整理。
- 抽取资产。
- 发现关系。
- 提醒风险。
- 提出下一步建议。

AI Agent 不负责：

- 改变流程。
- 自动确认资产。
- 跳过用户确认。
- 擅自把设定写成正史。
- 自行扩大任务范围。

### 2.3 用户是最终裁决者

用户不需要管理复杂流程，但必须拥有最终判断权。

所有关键内容进入正式资产库前，都必须经过：

```text
suggested -> confirmed / rejected / revised
```

### 2.4 每次 AI 输出都必须可检查

AI 输出不能只是一段自然语言。

必须包含：

- structured_result
- confidence
- evidence
- assumptions
- risks
- suggested_next_actions

## 3. 总体架构

```text
User
  -> Project Workbench
    -> Loop Engine
      -> Step Guard
      -> Context Builder
      -> Agent Task Planner
      -> AI Agent Runtime
      -> Output Validator
      -> Result Normalizer
      -> Review Gate
      -> Persistence Layer
      -> Transition Engine
```

## 4. 关键模块

### 4.1 Loop Engine

职责：

- 读取 LoopRun。
- 判断 current_step。
- 判断可执行动作。
- 调用 Step Guard。
- 创建 AgentTask。
- 接收 AgentResult。
- 推进或阻塞流程。

核心方法：

```text
getLoopState(projectId)
startLoop(projectId)
runStep(projectId, stepKey)
submitDecision(projectId, stepKey, decision)
transitionToNextStep(loopRunId)
reopenStep(loopRunId, stepKey)
```

### 4.2 Step Guard

每一步执行前先检查条件。

例子：

```text
development_plan_generation 需要 ProjectCoreCard 已存在
asset_extraction 需要 DevelopmentPlan 已存在
context_pack_build 需要 confirmed StoryAsset 存在
export 需要 CoreCard + DevelopmentPlan + confirmed assets
```

如果条件不满足，Loop Engine 不调用 AI，而是返回阻塞原因：

```text
blocked_reason: "请先生成并保存作品核心卡。"
```

### 4.3 Context Builder

负责给 AI Agent 准备上下文。

它不能把整个项目无脑塞给 AI，而是按当前步骤选择材料。

例如：

```text
high_concept_generation:
  - project premise
  - user preferences

development_plan_generation:
  - selected high concept
  - core card

asset_extraction:
  - development plan
  - allowed asset types

project_chat:
  - confirmed assets
  - confirmed relations
  - current context_pack
```

Context Builder 输出：

- context_pack
- included_entities
- excluded_entities
- token_estimate
- safety_notes

### 4.4 Agent Task Planner

把当前步骤翻译成 AI Agent 可以执行的任务。

AgentTask 示例：

```json
{
  "task_id": "task_123",
  "project_id": "project_001",
  "loop_run_id": "loop_001",
  "step_key": "asset_extraction",
  "task_type": "extract_story_assets",
  "objective": "从作品开发案中抽取候选设定资产",
  "context_pack_id": "ctx_001",
  "input_refs": ["development_plan:plan_001"],
  "output_schema_key": "suggested_assets_v1",
  "constraints": {
    "allowed_asset_types": ["character", "location", "organization", "item", "rule", "event", "mystery", "foreshadowing", "theme"],
    "must_include_evidence": true,
    "must_not_confirm_assets": true
  }
}
```

### 4.5 AI Agent Runtime

AI Agent Runtime 负责真正调用模型。

但它只接收 AgentTask，不直接接收页面自由文本。

它的输入固定为：

- system_instruction
- task_brief
- context_pack
- output_schema
- constraints
- examples

它的输出固定为：

- raw_output
- parsed_output
- validation_status
- model_metadata

### 4.6 Output Validator

验证 AI 输出是否合格。

检查：

- JSON 是否可解析。
- schema 是否匹配。
- 必填字段是否存在。
- 枚举值是否合法。
- 是否缺少 evidence。
- 是否违反 must_not_confirm_assets。
- 是否生成了过多无关内容。
- 是否有明显重复。

验证失败时，系统不直接展示给用户，而是进入修复策略。

### 4.7 Result Normalizer

把 AI 输出转成系统内部对象。

例如：

```text
AI suggested_assets -> StoryAsset(status=suggested)
AI suggested_relations -> StoryRelation(status=suggested)
AI risk_diagnostics -> QualityIssue(status=open)
```

### 4.8 Review Gate

Review Gate 是用户确认点。

它负责把 AI 建议变成用户可操作的审核界面。

用户动作：

- confirm
- reject
- revise
- merge
- regenerate
- ask_for_explanation

只有通过 Review Gate 的对象才能进入 confirmed 状态。

### 4.9 Transition Engine

负责推进步骤。

规则示例：

```text
asset_extraction completed -> asset_review waiting_for_user
asset_review completed -> relation_extraction ready
relation_review completed -> context_pack_build ready
```

Transition Engine 只根据规则推进，不听 AI 自己说“我觉得下一步应该是……”。

## 5. AI Agent 的“思维控制”如何实现

这里的“控制 AI 思维”不是读取或操纵模型内部过程，而是通过工程约束限制 AI 的工作空间。

控制方式包括：

### 5.1 任务边界控制

每次只给 AI 一个明确任务。

不要这样：

```text
帮我完善这个作品。
```

要这样：

```text
从这份开发案中抽取候选设定资产，只允许输出指定 JSON schema。
```

### 5.2 上下文控制

AI 只能看到当前步骤需要的材料。

例如资产抽取时，不需要看到远期商业治理文档。

### 5.3 输出结构控制

所有关键任务必须绑定 output_schema。

AI 不按 schema 输出，就不能进入下一步。

### 5.4 行为约束控制

在 constraints 中明确禁止：

- 自动确认资产。
- 编造不存在的已确认设定。
- 跳过用户确认。
- 输出流程外建议作为事实。

### 5.5 校验和修复控制

AI 输出必须经过 Validator。

失败后走：

```text
validate_failed -> repair_prompt -> validate_again -> still_failed -> blocked_for_user
```

### 5.6 状态机控制

AI 不能决定 current_step。

Loop Engine 才能改变步骤状态。

## 6. AgentTask 协议

### 6.1 AgentTask 字段

```text
id
project_id
loop_run_id
step_run_id
step_key
task_type
objective
context_pack_id
input_json
input_refs
output_schema_key
constraints_json
status
created_at
completed_at
```

### 6.2 AgentResult 字段

```text
id
agent_task_id
raw_output
parsed_output
validation_status
validation_errors
normalized_entities
confidence_summary
risk_summary
created_at
```

### 6.3 AgentTask 状态

```text
queued
running
validating
repairing
completed
failed
blocked
```

## 7. 用户最小参与模式

用户只需要在这些点参与：

### 7.1 提供思路

输入：

- 原始创意。
- 类型偏好。
- 风格偏好。
- 不想要的方向。

### 7.2 做选择

选择：

- 哪个高概念更好。
- 哪个标题更适合。
- 哪个方向继续发展。

### 7.3 做确认

确认：

- 哪些资产进入正史。
- 哪些关系成立。
- 哪些设定需要修改。

### 7.4 做少量补充

补充：

- “主角更冷一点。”
- “这个世界不要太赛博。”
- “这个伏笔留到第三卷。”

系统不应该要求用户理解：

- Prompt 怎么写。
- Context 怎么组。
- Schema 怎么设计。
- 下一步 API 是什么。

## 8. 稳定执行流程

以资产抽取为例：

```text
1. 用户完成 DevelopmentPlan
2. Loop Engine 判断 current_step = asset_extraction
3. Step Guard 检查 DevelopmentPlan 存在
4. Context Builder 生成 asset_extraction_context
5. Agent Task Planner 创建 extract_story_assets 任务
6. AI Agent Runtime 调用模型
7. Output Validator 校验 suggested_assets_v1
8. Result Normalizer 写入 StoryAsset(status=suggested)
9. Transition Engine 推进到 asset_review
10. 用户确认 / 修改 / 拒绝
11. confirmed assets 写入知识库
12. Loop Engine 推进到 relation_extraction
```

## 9. 失败处理

### 9.1 AI 输出格式错误

处理：

```text
retry_with_repair_prompt
```

最多重试 2 次。

### 9.2 AI 输出内容太空泛

处理：

- 降低 step 完成状态。
- 标记 quality_warning。
- 要求 AI 基于 evidence 重新生成。

### 9.3 AI 生成重复资产

处理：

- Result Normalizer 做候选合并。
- Review Gate 提供 merge 操作。

### 9.4 用户否决大量结果

处理：

- Loop Engine 保持在当前 review step。
- 提供 regenerate 按钮。
- 把用户否决原因加入下一次 AgentTask constraints。

### 9.5 当前步骤条件不足

处理：

```text
status = blocked
blocked_reason = "缺少作品开发案，无法抽取资产。"
```

## 10. Agent 角色拆分

第一版不需要多 Agent 辩论，但可以在任务层定义不同 Agent Persona。

### 10.1 Concept Agent

负责：

- 高概念。
- 卖点。
- 类型方向。

### 10.2 Structure Agent

负责：

- 核心卡。
- 开发案。
- 分卷草案。

### 10.3 Extraction Agent

负责：

- 资产抽取。
- 关系抽取。

### 10.4 Context Agent

负责：

- 上下文包摘要。
- 对话引用。

### 10.5 Quality Agent

负责：

- 冲突检查。
- 缺失检查。
- 风险提示。

这些不一定是多个模型，也不一定是多个进程。第一版可以只是不同 task_type 对应不同 system prompt。

## 11. 数据库增量建议

在已有 Loop 表之外，建议增加：

### agent_tasks

- id
- project_id
- loop_run_id
- step_run_id
- step_key
- task_type
- objective
- context_pack_id
- input_json
- input_refs_json
- output_schema_key
- constraints_json
- status
- created_at
- completed_at

### agent_results

- id
- agent_task_id
- raw_output
- parsed_output_json
- validation_status
- validation_errors_json
- normalized_entities_json
- confidence_summary
- risk_summary
- created_at

### review_items

把 AI 输出拆成用户可确认项。

- id
- project_id
- loop_run_id
- step_run_id
- source_agent_result_id
- item_type
- item_json
- status
- user_decision_json
- created_at
- decided_at

状态：

```text
pending
confirmed
rejected
revised
merged
```

## 12. API 增量建议

### 当前可执行动作

```text
GET /projects/:projectId/loop/actions
```

返回当前用户能做什么。

### 运行当前 Agent 步骤

```text
POST /projects/:projectId/loop/agent/run
```

Loop Engine 根据 current_step 自动派发正确 AgentTask。

### 获取审核项

```text
GET /projects/:projectId/review-items?stepKey=asset_review
```

### 提交审核决定

```text
POST /projects/:projectId/review-items/decide
```

支持批量确认、拒绝、修改。

### 重新生成当前步骤

```text
POST /projects/:projectId/loop/steps/:stepKey/regenerate
```

必须记录用户为什么重生成。

## 13. 前端体验

用户看到的不是“Agent 系统”，而是一个温和的创作向导。

### 13.1 当前步骤卡片

显示：

```text
当前步骤：审核设定资产
系统已经从开发案中找到 18 个候选资产。
请确认哪些进入作品正史。
```

### 13.2 主按钮

每一步只给一个最重要的主按钮：

```text
生成高概念
选择这个方向
生成作品核心卡
抽取设定资产
确认选中资产
构建上下文包
开始项目对话
导出设定文档
```

### 13.3 AI 解释

每个建议项提供：

- 为什么建议。
- 来源文本。
- 置信度。
- 可能风险。

## 14. 安全边界

### 14.1 不自动写正史

任何来自 AI 的新设定默认都是 suggested。

### 14.2 不隐藏失败

如果 AI 输出不合格，系统应该说：

```text
这次生成结果结构不稳定，我正在重新整理。
```

而不是把坏结果硬塞给用户。

### 14.3 不过度自主

Loop Engine 可以自动推进技术步骤，但不能自动做创作判断。

### 14.4 不无限重试

AI 失败最多重试 2 次，然后交给用户。

## 15. 第一版实现顺序

### Step 1：AgentTask 协议

先定义 task/result 类型，不急着接真实模型。

### Step 2：Loop Engine 派发 Mock AgentTask

让每个 step 可以产生 Mock 结果。

### Step 3：Validator

先实现 schema 校验。

### Step 4：Review Items

把 suggested_assets / suggested_relations 转成审核项。

### Step 5：Transition

用户确认后推进下一步。

### Step 6：真实 AI 接入

等协议稳定后再接模型。

## 16. 最小闭环验收

稳定 Loop Engine 的第一版验收：

1. 用户输入创意。
2. Loop Engine 派发 high_concept AgentTask。
3. AI 返回结构化候选。
4. Validator 通过。
5. 用户选择候选。
6. Loop Engine 自动派发 core_card AgentTask。
7. 用户保存核心卡。
8. Loop Engine 知道下一步是 development_plan_generation。

如果这条链路能稳定跑通，就说明“Loop Engine 控制 AI Agent 工作”的架构成立。

