# 沉淀池：创作经验与废案归档系统

## 1. 功能定位

沉淀池是 AgentOS 的长期记忆系统。

它负责把每一次创作设定过程中的成功方案、废案、拒绝原因、修改痕迹、AI 生成结果、用户判断和最终结论，整理成可读、可检索、可复盘的 Markdown 文档。

一句话：

> 沉淀池把“每一次创作判断”变成日后可以反思、总结、复用的经验资产。

## 2. 为什么需要沉淀池

普通 AI 聊天的问题是：

- 好想法散落在对话里。
- 废案被删掉后再也看不见。
- 用户为什么否决某个设定，没有记录。
- AI 为什么生成某个方向，没有证据链。
- 下一次创作时，无法复用以前的教训。

沉淀池解决这些问题。

它不是回收站，也不是普通历史记录，而是一个有结构的创作经验库。

## 3. 沉淀池记录什么

### 3.1 成功方案

例如：

- 被选中的高概念。
- 被保存的作品核心卡。
- 被确认的设定资产。
- 被确认的关系。
- 被导出的开发案。
- 用户认为“很有感觉”的方向。

### 3.2 废案

例如：

- 未被选择的高概念。
- 用户拒绝的角色设定。
- 被判定太俗、太散、太像已有作品的方向。
- AI 生成但用户认为不符合风格的开发案片段。
- 被合并或废弃的重复资产。

### 3.3 修改过程

例如：

- AI 初稿。
- 用户修改版本。
- 修改原因。
- 修改前后差异。
- 最终采用版本。

### 3.4 判断理由

例如：

- “这个方向冲突更强。”
- “这个角色动机太弱。”
- “这个设定太像套路。”
- “这个伏笔适合保留到第三卷。”
- “这个关系会提前泄露终局真相。”

### 3.5 AI 质量信息

例如：

- AI 输出是否通过 schema 校验。
- 是否需要修复。
- 是否出现重复资产。
- 是否出现设定冲突。
- 置信度。
- 证据文本。

## 4. 沉淀池的 Markdown 形态

每条沉淀记录最终生成一份 Markdown。

推荐文件路径：

```text
projects/{project_id}/experience_pool/
  2026-06-26_high_concept_selected_废稿天道修仙录.md
  2026-06-26_rejected_high_concepts.md
  2026-06-27_asset_review_round_01.md
  2026-06-27_development_plan_revision.md
```

第一版也可以先存数据库，导出时再生成 Markdown。不要一开始就依赖文件系统作为唯一数据源。

## 5. Markdown 模板

### 5.1 通用模板

```markdown
# 沉淀记录：{title}

## 基本信息

- 项目：{project_title}
- 类型：{entry_type}
- 状态：{entry_status}
- 来源步骤：{loop_step_key}
- 来源任务：{agent_task_id}
- 创建时间：{created_at}

## 原始输入

{input_summary}

## AI 输出

{ai_output_summary}

## 用户判断

{user_decision}

## 采用内容

{accepted_content}

## 废弃内容

{rejected_content}

## 判断理由

{decision_reason}

## 可复用经验

{learning_notes}

## 标签

{tags}
```

### 5.2 高概念选择沉淀

```markdown
# 高概念选择沉淀：{project_title}

## 本轮创意

{idea}

## 候选方向

### 方案 A：{title}

- 卖点：{core_hook}
- 主冲突：{main_conflict}
- 目标读者：{target_reader}
- 风险：{risk_notes}
- 结果：selected / rejected
- 理由：{decision_reason}

## 最终选择

{selected_candidate}

## 这次学到什么

{learning_notes}
```

### 5.3 资产审核沉淀

```markdown
# 资产审核沉淀：{project_title}

## 本轮来源

- 开发案版本：{development_plan_version}
- 抽取任务：{agent_task_id}

## 确认资产

{confirmed_assets}

## 拒绝资产

{rejected_assets}

## 修改资产

{revised_assets}

## 合并资产

{merged_assets}

## 经验总结

{learning_notes}
```

## 6. 沉淀类型

第一版建议支持这些类型：

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

## 7. 沉淀状态

```text
draft
captured
reviewed
promoted_to_knowledge
archived
```

解释：

- draft：系统自动生成草稿，还没被用户看过。
- captured：已经记录下来。
- reviewed：用户确认这条沉淀有价值。
- promoted_to_knowledge：已经提炼成可复用经验。
- archived：保留但不再主动引用。

## 8. 沉淀池和设定资产库的区别

设定资产库记录“作品内部真实存在什么”。

沉淀池记录“创作过程中发生了什么判断”。

例如：

- 角色“陆玄”是 StoryAsset。
- “为什么选择失忆修仙者而不是群像天道战争”是 ExperienceEntry。

一个是作品设定，一个是创作经验。

## 9. 沉淀池和废案的关系

废案不是垃圾。

废案的价值在于：

- 说明用户不要什么。
- 说明某个方向为什么不成立。
- 后续可以重新激活。
- 可以训练 AI 更贴近用户偏好。

废案应该保留：

- 原内容。
- 废弃原因。
- 可复用部分。
- 是否允许未来重新启用。

## 10. 用户体验

沉淀池不应该打扰用户。

用户在主流程中只需要看到轻量提示：

```text
本轮已自动沉淀：
- 1 个已选高概念
- 3 个废案方向
- 12 个确认资产
- 6 个拒绝资产
```

用户可以点进“沉淀池”查看：

- 成功记录。
- 废案记录。
- 修改记录。
- 经验总结。
- 可复用偏好。

## 11. 与 AI 的合作

AI 可以帮助沉淀池做两件事：

### 11.1 自动整理记录

把本轮输入、输出、用户决定整理成 Markdown。

### 11.2 提炼经验

例如：

```text
用户多次拒绝“宏大但分散”的设定，更偏好“一个强钩子 + 清晰主角困境”的方向。
```

但经验提炼必须可编辑，不能偷偷改变用户偏好。

## 12. 第一版成功标准

完成一次高概念选择后，系统自动生成一份 Markdown 沉淀：

- 记录所有候选方向。
- 标记被选中方向。
- 标记废弃方向。
- 记录用户选择理由。
- 总结一条可复用经验。

完成一次资产审核后，系统自动生成一份 Markdown 沉淀：

- 确认了哪些资产。
- 拒绝了哪些资产。
- 修改了哪些资产。
- 合并了哪些资产。
- 总结本轮资产抽取质量。

