# 数据模型草案

## 核心实体

### User

用户。

关键字段：

- id
- email
- name
- password_hash
- created_at

### Project

作品项目。

关键字段：

- id
- owner_id
- title
- genre
- premise
- status
- created_at
- updated_at

### ProjectIdea

用户输入的原始创意。

关键字段：

- id
- project_id
- raw_text
- preferences
- created_at

### HighConceptCandidate

高概念候选。

关键字段：

- id
- project_id
- idea_id
- title
- logline
- genre
- core_hook
- main_conflict
- target_reader
- risk_notes
- is_selected
- ai_job_id

### ProjectCoreCard

作品核心卡。

关键字段：

- id
- project_id
- title
- logline
- worldview_summary
- protagonist_summary
- central_conflict
- long_term_mystery
- target_reader
- source_candidate_id

### DevelopmentPlan

作品开发案。

关键字段：

- id
- project_id
- content_markdown
- structured_json
- version
- ai_job_id

### StoryAsset

设定资产。

关键字段：

- id
- project_id
- type
- name
- summary
- detail
- status
- source
- source_quote
- confidence
- created_at
- updated_at

资产状态：

- suggested
- confirmed
- rejected
- archived

### StoryRelation

设定关系。

关键字段：

- id
- project_id
- source_asset_id
- target_asset_id
- relation_type
- summary
- status
- source_quote
- confidence

### ContextPack

AI 上下文包。

关键字段：

- id
- project_id
- title
- summary
- included_asset_ids
- included_relation_ids
- hidden_asset_ids
- token_estimate
- content_json
- created_at

### AIJob

AI 任务记录。

关键字段：

- id
- project_id
- task_type
- status
- input_json
- output_json
- error_message
- model
- token_usage
- created_at
- completed_at

### ExportFile

导出记录。

关键字段：

- id
- project_id
- export_type
- file_path
- created_at

## 第一版资产类型

```text
character
location
organization
item
rule
event
mystery
foreshadowing
theme
```

## 第一版关系类型

```text
belongs_to
allies_with
opposes
knows
hides_from
caused_by
depends_on
located_in
foreshadows
reveals
```

## 设计建议

第一版宁愿字段少一点，也不要把远期治理表提前塞进数据库。

如果一个表不能服务 MVP 主链路，就先不要建。

