# 沉淀池 MVP 执行计划

## 1. 第一版目标

第一版沉淀池不要试图记录一切。

先记录两个最关键的创作判断：

1. 高概念选择：为什么选这个方向，为什么废弃其他方向。
2. 资产审核：哪些设定进入正史，哪些设定被拒绝、修改或合并。

这两个节点最能体现作者偏好，也最适合日后反思。

## 2. Sprint 1：数据和服务

### 任务

- 增加 ExperienceEntry 数据模型。
- 创建 ExperiencePoolService。
- 定义 Markdown 模板。
- 支持根据 step_key 生成沉淀记录。

### 验收

- 可以手动调用服务创建一条沉淀。
- 沉淀包含 title、summary、content_markdown、tags。

## 3. Sprint 2：高概念沉淀

### 触发点

```text
high_concept_selection completed
```

### 记录内容

- 原始创意。
- 所有候选高概念。
- 被选中方案。
- 被拒绝方案。
- 用户选择理由。
- AI 生成风险提示。
- 本轮偏好总结。

### 验收

用户选择高概念后，沉淀池自动出现一条 Markdown：

```text
高概念选择沉淀：{project_title}
```

里面必须能看出：

- 什么被选中。
- 什么被废弃。
- 为什么。

## 4. Sprint 3：资产审核沉淀

### 触发点

```text
asset_review completed
```

### 记录内容

- 本轮开发案来源。
- 确认资产。
- 拒绝资产。
- 修改资产。
- 合并资产。
- 用户拒绝或修改原因。
- AI 抽取质量总结。

### 验收

用户完成资产审核后，沉淀池自动出现一条 Markdown：

```text
资产审核沉淀：{project_title}
```

里面必须能看出：

- 哪些设定成为正史。
- 哪些设定是废案。
- 哪些设定被改过。

## 5. Sprint 4：沉淀池页面

### 页面

- 沉淀池列表。
- 沉淀详情。
- Markdown 预览。
- 编辑按钮。
- 导出按钮。

### 筛选

- 成功方案。
- 废案。
- 修改记录。
- 质量问题。
- 可复用经验。

## 6. Sprint 5：导出

### 功能

- 导出单条 Markdown。
- 导出项目沉淀池合集。

### 推荐导出结构

```text
experience_pool/
  successes/
  rejected/
  revisions/
  quality/
```

第一版如果来不及，可以只支持单条 Markdown 导出。

## 7. 与 Loop Engine 的接入点

在这些地方调用：

```text
LoopService.submitDecision(...)
  -> TransitionEngine.transitionToNextStep(...)
  -> ExperiencePoolService.captureFromStep(...)
```

不要让前端自己拼沉淀内容。

## 8. 与 AI Agent 的接入点

AI 可以生成 learning_notes，但必须基于事实。

输入必须来自：

- AI 候选。
- 用户决定。
- 最终状态。

禁止：

- 编造用户没说过的理由。
- 把废案写成正史。
- 把未确认内容写成 confirmed。

## 9. 第一版完成定义

沉淀池 MVP 完成时，用户应该能看到：

```text
本项目已沉淀 2 条经验：
1. 高概念选择沉淀
2. 资产审核沉淀

其中包含 1 个成功方向、3 个废案方向、12 个确认资产、6 个拒绝资产。
```

这就是沉淀池的第一颗种子。

