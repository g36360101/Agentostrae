# Loop MVP 执行计划

## 1. 本计划的目的

这份计划把「创作执行循环」落到第一版开发任务中。

目标不是一次性实现完整工作流系统，而是在 MVP 中加入最小 Loop 能力：

```text
知道当前做到哪一步
知道下一步该做什么
保存每一步的输入和输出
用户确认后推进流程
用户回来后可以继续
```

## 2. Sprint 拆分

### Sprint A：Loop 数据地基

交付：

- `creative_loops` 表。
- `loop_runs` 表。
- `loop_step_runs` 表。
- 内置 `story_setting_mvp_loop` 定义。
- 项目创建后自动创建 LoopRun。

验收：

- 创建项目后，能看到 loop 状态。
- 当前步骤默认为 `idea_input`。

### Sprint B：项目工作台 Loop 进度

交付：

- 项目工作台顶部进度条。
- 当前步骤卡片。
- 下一步行动按钮。
- 每个步骤状态显示。

验收：

- 用户能一眼看出自己处在哪一步。
- 页面能提示下一步是“输入创意”还是“生成高概念”。

### Sprint C：高概念与核心卡接入 Loop

交付：

- idea_input 完成后推进到 high_concept_generation。
- 生成高概念后推进到 high_concept_selection。
- 用户选择高概念后推进到 core_card_generation。
- 核心卡保存后推进到 development_plan_generation。

验收：

- 用户完成高概念选择后，刷新页面仍然停留在正确下一步。

### Sprint D：开发案与资产审核接入 Loop

交付：

- 开发案生成后推进到 asset_extraction。
- 资产抽取后推进到 asset_review。
- 用户确认资产后推进到 relation_extraction。
- 关系抽取后推进到 relation_review。
- 用户确认关系后推进到 context_pack_build。

验收：

- 未确认资产前，系统不会把 suggested_assets 当成 confirmed assets 使用。

### Sprint E：上下文包、对话和导出接入 Loop

交付：

- context_pack 构建后推进到 project_chat。
- 项目对话可持续使用。
- 导出入口检查必要步骤是否完成。
- 导出后 loop 可标记为 completed。

验收：

- 用户可以从头跑到导出。
- 完成后项目显示“设定初版已完成”。

## 3. MVP Loop 任务清单

### 后端

- 定义 LoopDefinition 常量。
- 创建 LoopService。
- 创建 LoopController。
- 创建 Step transition 方法。
- 创建 step guard。
- 在 ProjectsService 创建项目后初始化 LoopRun。
- 在 AI 生成任务完成后更新 StepRun。
- 在用户确认动作后推进 StepRun。

### 前端

- ProjectWorkbench 读取 loop 状态。
- LoopProgress 组件。
- CurrentStepPanel 组件。
- StepActionButton 组件。
- Step status badge。
- 每个业务页面完成动作后刷新 loop 状态。

### AI Core

- AI task 增加 `loop_step_key`。
- AIJob 输出回写 StepRun。
- Mock 输出按 step 分类保存。

### 数据

- 增加 migration。
- seed 内置 loop definition。
- 为样例项目创建 loop run。

## 4. Step Guard 规则

第一版只需要简单规则：

| 步骤 | 进入条件 |
|---|---|
| high_concept_generation | ProjectIdea 已存在 |
| high_concept_selection | 至少 1 个 HighConceptCandidate |
| core_card_generation | 已选择 HighConceptCandidate |
| development_plan_generation | ProjectCoreCard 已保存 |
| asset_extraction | DevelopmentPlan 已保存 |
| asset_review | 存在 suggested StoryAsset |
| relation_extraction | 存在 confirmed StoryAsset |
| relation_review | 存在 suggested StoryRelation |
| context_pack_build | 存在 confirmed StoryAsset |
| project_chat | ContextPack 已存在 |
| export | CoreCard、DevelopmentPlan、confirmed assets 存在 |

## 5. 用户体验原则

### 不让用户猜

每一步都告诉用户：

- 当前完成了什么。
- 下一步是什么。
- 为什么下一步还不能做。

### 不强迫线性

第一版主流程线性，但允许用户回看和编辑已完成内容。

### 不隐藏 AI 的不确定性

资产和关系建议必须展示置信度、证据文本和可编辑入口。

## 6. 风险和取舍

### 风险：Loop Engine 做得太复杂

应对：

- 第一版写死一个 loop。
- 不做流程编辑器。
- 不做复杂分支。

### 风险：业务功能和 loop 状态不同步

应对：

- 所有关键业务动作完成后都调用 LoopService。
- 每个 Step 有 guard 校验。

### 风险：用户觉得流程束缚

应对：

- 进度条是引导，不是监狱。
- 允许用户回看、编辑、重生成。

## 7. 第一版完成定义

Loop MVP 完成时，用户应该看到：

```text
你的作品设定初版已完成。
你已经生成了核心卡、开发案、12 个设定资产、8 条关系和 1 个上下文包。
你可以继续与 AI 对话，或导出作品设定文档。
```

这句话能出现，就说明这个方向真的落地了。

