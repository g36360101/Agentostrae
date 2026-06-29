# AI 策略

## AI 在产品中的角色

AI 不是作者，也不是数据库管理员。AI 在第一版中承担四个角色：

1. 创意扩展器：把模糊创意变成多个可选方向。
2. 结构化整理器：把方向整理成作品核心卡和开发案。
3. 资产抽取器：从文本中提取人物、地点、组织、规则、伏笔等资产。
4. 上下文助手：基于已确认资产参与项目内对话。

## 第一批 AI 任务

### generate_high_concepts

输入：

- 用户创意。
- 目标题材。
- 可选风格。

输出：

- 3 到 5 个高概念候选。
- 每个候选包含标题、卖点、类型定位、核心冲突、主角驱动力、世界差异点、情绪承诺、目标读者、连载潜力、风险。

### generate_core_card

输入：

- 被选中的高概念。

输出：

- 作品名建议。
- 一句话卖点。
- 读者承诺。
- 世界观摘要。
- 主角设定。
- 主角缺口。
- 核心矛盾。
- 对立力量。
- 长线悬念。
- 主题表达。
- 不可破坏设定。

### generate_development_plan

输入：

- 作品核心卡。
- 用户补充偏好。

输出：

- 开发案章节。
- 角色组。
- 阵营组。
- 世界规则。
- 冲突推进。
- 谜团与伏笔。
- 分卷草案。
- 爽点与情绪曲线。
- 风险与待确认项。

### extract_story_assets

输入：

- 作品开发案。

输出：

- suggested_assets。
- 每个资产带类型、名称、摘要、详细描述、叙事功能、出场阶段、公开状态、剧透等级、证据文本、置信度、待补问题。

### extract_story_relations

输入：

- 作品开发案。
- 已抽取资产。

输出：

- suggested_relations。
- 每条关系带 source、target、relation_type、关系摘要、关系强度、是否隐藏、剧透等级、证据文本、置信度、可能引发的冲突或伏笔。

### project_chat

输入：

- 用户问题。
- context_pack。

输出：

- 回答。
- 使用了哪些资产。
- 是否提出新资产建议。
- 是否发现设定冲突。
- 是否触及隐藏真相。
- 是否建议更新关系。

## 输出原则

1. 关键字段必须稳定。
2. 每个建议必须有来源或理由。
3. 不确定时标记 uncertainty。
4. 不允许把隐藏真相随意写入普通摘要。
5. 不允许自动确认资产。
6. 不允许把候选内容当成已确认正史。
7. 涉及隐藏真相、终局谜底和高剧透关系时必须标记 spoiler_level。

## 内容质量标尺

AI 输出进入用户审核前，至少按这些维度自检：

### 高概念

- 是否能在 30 秒内说清卖点。
- 是否有明确主角困境。
- 是否有持续制造冲突的机制。
- 是否能看出类型读者为什么会感兴趣。
- 是否有差异化设定。
- 是否指出主要风险。

### 核心卡

- 主角、世界、冲突是否互相绑定。
- 长线悬念是否保留足够未知。
- 读者承诺是否具体。
- 不可破坏设定是否清楚。

### 开发案

- 是否能抽取至少 10 个有效资产。
- 主要角色是否有欲望、阻碍和变化方向。
- 世界规则是否能制造剧情。
- 是否至少包含 3 个阶段性冲突。
- 伏笔和谜团是否有回收方向。
- 是否列出待确认项。

### 资产与关系

- 资产是否有叙事功能。
- 资产是否有来源证据。
- 关系的 source 和 target 是否明确。
- 关系是否解释了剧情意义。
- 剧透关系是否标记。

## 受控 Agent 执行原则

AI Agent 不直接决定产品流程，只执行 Loop Engine 派发的 AgentTask。

每个 AgentTask 必须包含：

- step_key
- task_type
- objective
- context_pack
- output_schema
- constraints

AI Agent 的输出必须经过 Validator 和 Review Gate：

```text
AgentTask -> AgentResult -> Validator -> ReviewItem -> UserDecision -> Confirmed Asset
```

这意味着 AI 可以提出候选，但不能自动推进正史。

## Prompt 管理

Prompt 不应该散落在业务代码里。建议放在：

```text
packages/ai-core/prompts/
```

每个任务至少包含：

- system prompt
- user prompt template
- output schema
- validation rules
- example input
- example output

## 质量检查

AI 输出入库前要检查：

- JSON 是否可解析。
- 必填字段是否存在。
- asset type 是否合法。
- relation type 是否合法。
- 是否出现明显重复资产。
- 是否出现自相矛盾关系。
- 叙事功能是否为空。
- source_quote 是否能支撑该资产或关系。
- spoiler_level 是否缺失。
- hidden_truth 是否误写入普通摘要。
