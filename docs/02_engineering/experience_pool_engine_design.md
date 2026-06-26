# Experience Pool Engine 工程设计

## 1. 设计目标

Experience Pool Engine 负责把 Loop Engine 中的关键事件转成沉淀记录，并生成 Markdown。

它不取代 StoryAsset，也不取代 ExportFile。它记录的是创作过程中的判断、废案、修订和经验。

## 2. 系统位置

```text
Loop Engine
  -> AgentTask
  -> AgentResult
  -> ReviewItem
  -> UserDecision
  -> Experience Pool Engine
    -> ExperienceEntry
    -> Markdown Renderer
    -> Reflection Summary
```

## 3. 触发时机

第一版建议在这些事件后自动创建沉淀：

### 3.1 高概念选择后

触发：

```text
high_concept_selection completed
```

沉淀：

- 所有候选方向。
- 被选中方向。
- 被拒绝方向。
- 用户选择理由。
- 本轮偏好总结。

### 3.2 核心卡保存后

触发：

```text
core_card_generation completed
```

沉淀：

- 核心卡初稿。
- 用户修改项。
- 最终版本。
- 关键设定判断。

### 3.3 开发案修订后

触发：

```text
development_plan_generation completed
```

沉淀：

- 开发案版本。
- 用户修改说明。
- 采纳内容。
- 保留疑问。

### 3.4 资产审核后

触发：

```text
asset_review completed
```

沉淀：

- confirmed assets。
- rejected assets。
- revised assets。
- merged assets。
- 拒绝原因。
- 抽取质量总结。

### 3.5 关系审核后

触发：

```text
relation_review completed
```

沉淀：

- confirmed relations。
- rejected relations。
- 关系判断理由。
- 潜在冲突。

### 3.6 导出时

触发：

```text
export completed
```

沉淀：

- 本次项目快照。
- 已确认资产数量。
- 已确认关系数量。
- 未解决问题。
- 下一轮建议。

## 4. 数据模型

### ExperienceEntry

沉淀池的核心记录。

字段：

- id
- project_id
- loop_run_id
- step_run_id
- source_type
- source_id
- entry_type
- title
- status
- summary
- content_markdown
- structured_json
- tags
- created_at
- updated_at

entry_type：

```text
high_concept_selection
core_card_revision
development_plan_revision
asset_review
relation_review
context_pack_build
project_chat_insight
export_snapshot
rejected_idea
quality_issue
repair_attempt
```

status：

```text
draft
captured
reviewed
promoted_to_knowledge
archived
```

### ExperienceArtifact

如果以后要把 Markdown 导出成文件，可以加 artifact 表。

字段：

- id
- experience_entry_id
- artifact_type
- file_path
- content_hash
- created_at

artifact_type：

```text
markdown
docx
pdf
```

第一版可以不做文件物理导出，只保存 `content_markdown`。

## 5. API 设计

### 获取项目沉淀池

```text
GET /projects/:projectId/experience-pool
```

支持筛选：

- entry_type
- status
- tag
- keyword

### 获取单条沉淀

```text
GET /projects/:projectId/experience-pool/:entryId
```

### 手动创建沉淀

```text
POST /projects/:projectId/experience-pool
```

用于用户手动写复盘。

### 更新沉淀

```text
PATCH /projects/:projectId/experience-pool/:entryId
```

用于用户编辑 Markdown。

### 标记为经验

```text
POST /projects/:projectId/experience-pool/:entryId/promote
```

把某条沉淀标记为可复用知识。

### 导出沉淀 Markdown

```text
POST /projects/:projectId/experience-pool/:entryId/export
```

第一版可以返回 Markdown 文本或生成文件。

## 6. Markdown Renderer

Markdown Renderer 根据 entry_type 选择模板。

输入：

- Project
- LoopStepRun
- AgentTask
- AgentResult
- ReviewItem
- UserDecision
- confirmed / rejected entities

输出：

- title
- summary
- content_markdown
- tags

## 7. 与 ReviewItem 的关系

ReviewItem 记录用户对单个 AI 建议项的判断。

ExperienceEntry 记录一批判断的复盘。

例如：

- 18 个 ReviewItem：每个候选资产确认或拒绝。
- 1 个 ExperienceEntry：本轮资产审核沉淀。

## 8. 与 Loop Engine 的关系

Loop Engine 在关键 step 完成后调用：

```text
ExperiencePoolService.captureFromStep(loopRunId, stepKey)
```

不要让前端自己拼 Markdown。

## 9. 与 AI Agent 的关系

AI 可以参与总结，但不能篡改事实。

AI 总结输入必须来自已保存事实：

- 原始输入。
- AI 输出。
- 用户决定。
- 最终状态。

AI 可以生成：

- summary。
- learning_notes。
- tags。

AI 不可以生成：

- 不存在的用户理由。
- 未发生的流程。
- 未确认的正史内容。

## 10. 文件管理建议

第一版：

- 数据库存 `content_markdown`。
- 用户点击导出时生成 `.md`。

第二版：

- 每个项目可以导出完整沉淀池目录。

导出结构：

```text
experience_pool/
  successes/
  rejected/
  revisions/
  quality/
  exports/
```

## 11. 第一版实施顺序

1. 增加 ExperienceEntry 数据模型。
2. 实现 ExperiencePoolService。
3. 实现 high_concept_selection 捕获。
4. 实现 asset_review 捕获。
5. 做沉淀池列表页。
6. 做沉淀详情 Markdown 预览。
7. 支持用户编辑沉淀 Markdown。
8. 支持导出单条 Markdown。

## 12. 验收标准

第一版合格标准：

- 用户选择高概念后，自动生成一条沉淀记录。
- 用户审核资产后，自动生成一条沉淀记录。
- 沉淀记录可编辑。
- 沉淀记录可导出 Markdown。
- 废案不会丢失。
- 用户能看到“为什么这个方案被废弃”。

