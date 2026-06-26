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
- 每个候选包含标题、卖点、核心冲突、目标读者、风险。

### generate_core_card

输入：

- 被选中的高概念。

输出：

- 作品名建议。
- 一句话卖点。
- 世界观摘要。
- 主角设定。
- 核心矛盾。
- 长线悬念。

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
- 分卷草案。

### extract_story_assets

输入：

- 作品开发案。

输出：

- suggested_assets。
- 每个资产带类型、名称、描述、证据文本、置信度。

### extract_story_relations

输入：

- 作品开发案。
- 已抽取资产。

输出：

- suggested_relations。
- 每条关系带 source、target、relation_type、证据文本、置信度。

### project_chat

输入：

- 用户问题。
- context_pack。

输出：

- 回答。
- 使用了哪些资产。
- 是否提出新资产建议。
- 是否发现设定冲突。

## 输出原则

1. 关键字段必须稳定。
2. 每个建议必须有来源或理由。
3. 不确定时标记 uncertainty。
4. 不允许把隐藏真相随意写入普通摘要。
5. 不允许自动确认资产。

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

