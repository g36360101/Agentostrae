# AgentOS MVP 开发执行计划

## 1. 计划目的

本计划把已经完成的 Phase 0 工程地基连接到可交付的作品设定工具 MVP。

它回答五个问题：

1. 接下来按什么顺序开发。
2. 每一步具体修改哪些系统边界。
3. 每个阶段如何验收。
4. 哪些能力必须推迟。
5. 什么时候可以进入下一阶段。

本计划是执行层文件。产品边界以 `docs/01_product/mvp_scope.md` 为准，工程约束以根目录 `AGENTS.md` 为准。

## 2. 当前起点

截至 2026-06-29，Phase 0 已完成：

- pnpm workspace 与 Turborepo 可运行。
- Next.js Web、NestJS API、PostgreSQL / Prisma 已建立。
- 第一版迁移已在真实 PostgreSQL 上执行。
- 共享 Zod Schema、API Client、UI Tokens 已建立。
- 高概念和核心卡的确定性 AI Mock 已建立。
- 三个版本化验收样例已建立。
- lint、typecheck、test、build、生产运行态联调和安全审计已通过。
- AI 建议不得自动进入正史的规则已经固化。

下一项工作不是继续搭基础设施，而是开始第一个纵向用户闭环。

## 3. MVP 最终闭环

```text
注册 / 登录
  -> 创建作品项目
  -> 输入创意
  -> 生成高概念候选
  -> 选择高概念
  -> 生成并编辑作品核心卡
  -> 生成作品开发案
  -> 抽取资产和关系
  -> 人工确认入库
  -> 构建上下文包
  -> 项目内 AI 对话
  -> 导出 Markdown
```

## 4. 开发阶段总览

| 阶段     |  建议周期 | 用户可见结果                  | 退出条件                         |
| -------- | --------: | ----------------------------- | -------------------------------- |
| Phase 1A |      1 周 | 创建、查看并重新打开项目      | 项目数据真实持久化，权限边界成立 |
| Phase 1B |      1 周 | 从创意生成高概念并保存核心卡  | 第一里程碑完整跑通               |
| Phase 2A |      1 周 | 生成、查看和编辑作品开发案    | 开发案结构化且可版本追踪         |
| Phase 2B |      1 周 | 审核资产和关系并确认入库      | AI 候选与正史严格隔离            |
| Phase 3  | 1 至 2 周 | 基于已确认设定进行项目对话    | 回答能引用来源且不泄露隐藏内容   |
| Phase 4  |      1 周 | 导出 Markdown 并完成 MVP 验收 | 三个样例全链路通过，无阻断问题   |

总计建议 7 至 8 周。周期是单人或小团队配合 AI Coding 的参考，不作为降低验收标准的理由。

## 5. 每个功能的固定开发顺序

所有纵向切片都按以下顺序完成：

1. 写清用户动作、输入、输出、失败状态和验收标准。
2. 在 `packages/shared` 定义或更新 Zod Schema 和类型。
3. 如需持久化，更新 Prisma Schema 并创建迁移。
4. 在 API 中实现 service，再实现 controller。
5. 添加 API 集成测试，覆盖成功、校验失败、无权限和不存在。
6. 在 `packages/api-client` 增加类型安全调用方法。
7. 在 Web 中实现加载、空、成功、失败和重试状态。
8. 添加最小自动化测试和手动验收步骤。
9. 运行 lint、typecheck、test、build。
10. 完成一次真实用户动作演示后再进入下一切片。

禁止先做完所有后端再统一做前端。每个切片必须形成一个可见、可保存、可重新读取的结果。

## 6. Phase 1A：项目系统

### 6.1 目标

用户可以进入系统、创建项目、查看项目列表、打开项目工作台，并在刷新页面后继续看到项目。

### 6.2 Slice 1：开发身份与权限边界

第一轮内部开发可以使用 seed 中的 Demo User，但必须通过统一的 `ActorContext` 或等价服务注入，禁止在 controller、service 或查询中散落固定用户 ID。

在 Phase 1A 退出前完成最小认证：

- 邮箱注册。
- 密码安全哈希。
- 登录与退出。
- 受保护接口读取当前用户。
- 项目查询强制按 `owner_id` 隔离。

认证实现前先写 ADR，明确：

- Cookie Session 或 Token 的选择。
- Web 如何保存登录状态。
- API 与未来小程序如何复用认证边界。
- Session 失效和退出行为。

首版不做：

- 微信登录。
- 找回密码邮件。
- 多因素认证。
- 团队成员与项目共享。

### 6.3 Slice 2：创建并重新打开项目

用户动作：

```text
进入项目列表 -> 创建项目 -> 回到列表 -> 打开项目工作台 -> 刷新页面
```

首批接口：

```text
POST  /projects
GET   /projects
GET   /projects/:projectId
PATCH /projects/:projectId
```

共享协议：

- `CreateProjectInput`
- `UpdateProjectInput`
- `ProjectResponse`
- `ProjectListResponse`
- 稳定错误码：`VALIDATION_ERROR`、`UNAUTHORIZED`、`PROJECT_NOT_FOUND`

Web 页面：

- 登录 / 注册。
- 项目列表。
- 创建项目表单。
- 项目工作台空状态。
- 项目基础信息编辑。

验收标准：

- 用户只能读取和修改自己的项目。
- 标题为空、长度超限时前后端都拒绝。
- 创建成功后无需手动刷新即可在列表出现。
- 刷新浏览器后项目仍存在。
- API 不可用时页面显示明确失败和重试入口。
- 不存在或无权限的项目不泄露项目信息。

### 6.4 Phase 1A 测试

- Schema 单测：创建和更新字段边界。
- 数据库集成测试：创建、查询、更新、owner 隔离。
- API 集成测试：成功、401、404、非法输入。
- Web 测试：表单校验和 API 失败状态。
- 最小 E2E：注册或进入 Demo 身份、创建项目、重新打开。

### 6.5 Phase 1A 退出条件

- [ ] 用户身份边界不依赖 controller 中的硬编码 ID。
- [ ] 项目 CRUD 主路径完成。
- [ ] 跨用户访问被拒绝。
- [ ] Web 和 API 都有可理解的错误状态。
- [ ] 数据库迁移可在空库执行。
- [ ] 自动测试和生产构建通过。
- [ ] 演示“创建并重新打开项目”成功。

## 7. Phase 1B：创意、高概念与核心卡

### 7.1 目标

用户输入一个创意，获得至少三个高概念方向，选择一个方向并生成、编辑、保存作品核心卡。

### 7.2 Slice 3：保存创意

接口：

```text
POST /projects/:projectId/ideas
GET  /projects/:projectId/ideas/latest
```

Web：

- 创意输入区。
- 可选题材、读者期待、禁忌和参考氛围。
- 自动保存或明确的保存动作。
- 字数提示和错误反馈。

验收：

- 保存原始输入，不覆盖历史来源。
- 所有输入归属当前项目和用户。
- 创意文本最短、最长限制与共享 Schema 一致。

### 7.3 Slice 4：生成高概念候选

接口：

```text
POST /projects/:projectId/high-concepts/generate
GET  /projects/:projectId/high-concepts
```

执行流程：

```text
Idea
  -> 创建 AIJob
  -> AIOrchestrator 调用 Mock Provider
  -> Zod 校验输出
  -> 保存候选和来源
  -> AIJob 标记 succeeded / failed
```

必须保存：

- 原始 AI 输入。
- Provider 和模型标识。
- 结构化输出。
- 任务状态和失败原因。
- 每个候选对应的 `idea_id` 和 `ai_job_id`。

Web：

- 生成中状态。
- 三到五张候选卡。
- 卖点、冲突、主角驱动力、情绪承诺和风险对比。
- 失败重试，但不得重复提交多个并行任务。

验收：

- 三个样例都返回至少三个合法候选。
- 非法 Mock 会被 Schema 拒绝且 AIJob 记录失败。
- 刷新后候选仍存在。
- 当前阶段只使用 Mock，不接真实模型。

### 7.4 Slice 5：选择高概念

接口：

```text
POST /projects/:projectId/high-concepts/:candidateId/select
```

规则：

- 一个项目同一时刻只能有一个被选候选。
- 选择操作必须在数据库事务中完成。
- 候选必须属于当前项目。
- 重新选择必须保留历史，不物理删除旧候选。

验收：

- 并发或重复点击不会产生多个 `is_selected = true`。
- 选择其他项目候选会被拒绝。
- 页面清楚显示当前主方向。

### 7.5 Slice 6：生成并保存核心卡

接口：

```text
POST /projects/:projectId/core-card/generate
GET  /projects/:projectId/core-card
PUT  /projects/:projectId/core-card
```

规则：

- 只能从当前被选高概念生成。
- AI 输出必须先通过 `CoreCardContent` Schema。
- 用户可编辑 AI 结果后保存。
- 每次重要保存产生递增版本，不覆盖来源。
- 核心卡必须保存 `source_candidate_id`。

Web：

- 核心卡生成状态。
- 分区编辑表单。
- 未保存变更提示。
- 不可破坏设定的独立编辑区。
- 保存成功、失败和版本信息。

验收：

- 核心卡包含 MVP 全部必填字段。
- 用户修改后刷新仍能读取修改结果。
- 没有选中高概念时不能生成。
- AI 不能绕过用户保存动作修改正史内容。

### 7.6 Phase 1B 退出条件

- [ ] 创意、高概念、核心卡拥有完整来源链。
- [ ] AIJob 成功和失败状态都可追踪。
- [ ] 选择候选的唯一性在事务和测试中成立。
- [ ] 核心卡可以编辑、保存和重新读取。
- [ ] 三个验收样例都通过第一里程碑。
- [ ] 演示完整链路不需要直接操作数据库。

第一里程碑完成标志：

```text
创建项目 -> 输入创意 -> 生成高概念 -> 选择方向 -> 生成核心卡 -> 编辑保存 -> 重新打开
```

## 8. Phase 2A：作品开发案

### 8.1 目标

从核心卡生成一份可读、可编辑、可版本追踪，并能支持后续资产抽取的作品开发案。

### 8.2 数据与协议

完善 `DevelopmentPlan`：

- `content_markdown`
- `structured_json`
- `version`
- `source_core_card_version`
- `ai_job_id`
- `created_at`

AI 输出必须同时提供：

- 可读 Markdown。
- 结构化章节数据。
- 待确认项。
- 风险提示。

### 8.3 接口

```text
POST /projects/:projectId/development-plan/generate
GET  /projects/:projectId/development-plan
PUT  /projects/:projectId/development-plan
GET  /projects/:projectId/development-plan/versions
```

### 8.4 验收标准

- 开发案能抽取至少十个有效资产。
- 角色有欲望、阻碍和变化方向。
- 世界规则能制造剧情冲突。
- 至少有三个阶段性冲突。
- 谜团与伏笔包含预期回收方向。
- 用户编辑不会破坏结构化字段。
- 核心卡版本变化不会静默覆盖旧开发案。

## 9. Phase 2B：资产、关系与人工审核

### 9.1 目标

AI 从开发案提出资产和关系候选，用户确认后才进入项目正史。

### 9.2 开发顺序

1. 增加 StoryAsset、StoryRelation 和 ReviewItem 数据模型。
2. 固化资产类型、关系类型、状态和剧透级别枚举。
3. 实现资产抽取 Mock 与 Schema 校验。
4. 实现关系抽取 Mock 与 Schema 校验。
5. 保存 `suggested` 候选及来源证据。
6. 实现审核列表、详情、编辑、确认和拒绝。
7. 只有确认操作可以产生 `confirmed` 正史。

接口：

```text
POST /projects/:projectId/assets/extract
GET  /projects/:projectId/assets?status=suggested
PATCH /projects/:projectId/assets/:assetId
POST /projects/:projectId/assets/:assetId/confirm
POST /projects/:projectId/assets/:assetId/reject

POST /projects/:projectId/relations/extract
GET  /projects/:projectId/relations?status=suggested
POST /projects/:projectId/relations/:relationId/confirm
POST /projects/:projectId/relations/:relationId/reject
```

### 9.3 强制规则

- AI 只能创建 `suggested`。
- 确认和拒绝必须记录用户、时间和原始候选。
- 每个资产必须有叙事功能和来源证据。
- 每条关系必须有 source、target、证据文本和剧透标记。
- 关系两端必须属于同一项目。
- 拒绝不等于删除，审核历史必须保留。
- 隐藏真相不能进入普通摘要和普通导出。

### 9.4 Phase 2 退出条件

- [ ] 一个开发案能抽取至少十个有效资产。
- [ ] 至少五条基础关系可被审核。
- [ ] 用户可以编辑、确认和拒绝候选。
- [ ] suggested 内容不会被普通正史查询返回。
- [ ] 来源证据、审核记录和剧透级别可追踪。
- [ ] 三个样例均通过资产审核流程。

## 10. Phase 3：上下文包与项目内 AI 对话

### 10.1 目标

AI 回答基于已确认项目设定，而不是仅依赖当前问题或未经确认的候选。

### 10.2 开发顺序

1. 实现 ContextPack Schema 和持久化。
2. 按任务目标选择已确认资产和关系。
3. 实现 must-follow facts、隐藏内容和禁止泄露规则。
4. 记录 token 估算和裁剪结果。
5. 实现项目内对话和回答引用。
6. 对新资产建议重新进入 `suggested` 审核流程。
7. 在 Mock 全链路稳定后，才评估真实模型 Provider。

接口：

```text
POST /projects/:projectId/context-packs
GET  /projects/:projectId/context-packs/:contextPackId
POST /projects/:projectId/chat
GET  /projects/:projectId/chat/messages
```

### 10.3 真实模型接入 Gate

接入真实模型前必须具备：

- Provider 接口和 Mock 测试稳定。
- Prompt、输出 Schema 和版本号可追踪。
- 超时、重试次数和 token 上限。
- 单任务成本记录。
- 敏感日志脱敏。
- 结构化输出解析失败处理。
- 人工确认 Gate 不可绕过。
- 明确的模型和预算决策记录。

### 10.4 验收标准

- 回答列出引用的资产或关系。
- 只使用 `confirmed` 正史作为事实。
- suggested 内容最多作为明确标注的建议，不能当作事实。
- 普通对话不会泄露隐藏真相。
- 设定冲突会被标记，不会被 AI 静默修正。
- Provider 失败时不产生半保存的正史数据。

## 11. Phase 4：Markdown 导出与 MVP 验收

### 11.1 导出范围

- 项目简介。
- 作品核心卡。
- 作品开发案。
- 已确认资产。
- 已确认关系。
- 伏笔和揭示计划。
- 当前待确认项。
- AI 上下文摘要。

### 11.2 强制规则

- 默认导出不包含隐藏真相。
- suggested 和 rejected 内容不得混入正史导出。
- 导出内容必须标明版本和生成时间。
- Markdown 模板必须有快照测试。
- 导出失败不能产生虚假成功记录。

### 11.3 三个项目验收

完整跑通：

1. 玄幻升级流。
2. 都市悬疑。
3. 科幻群像。

每个项目必须完成：

- 创建项目。
- 保存创意。
- 生成并选择高概念。
- 保存核心卡。
- 生成开发案。
- 抽取并确认至少十个资产。
- 确认至少五条关系。
- 构建上下文包。
- 完成至少三轮项目对话。
- 导出可读 Markdown。

### 11.4 MVP 退出条件

- [ ] 三个样例全链路通过。
- [ ] 无 P0 阻断问题。
- [ ] AI 候选、正史和隐藏内容边界通过测试。
- [ ] 新开发者能在 30 分钟内启动项目。
- [ ] 数据库迁移可从空库完整执行。
- [ ] CI 全部通过。
- [ ] Markdown 导出可直接被作者使用。
- [ ] 所有已知限制已记录。

## 12. 每周执行节奏

### 周初：冻结本周纵向切片

- 只选择一个主要用户结果。
- 写清验收和失败状态。
- 确认依赖和数据迁移风险。
- 把非必要需求移回后续列表。

### 周中：主路径演示

- 演示真实页面到真实数据库的主路径。
- 检查前后端是否仍使用同一共享 Schema。
- 检查错误状态和权限边界。
- 若主路径未通，不增加新功能。

### 周末：验收与复盘

- 跑完整质量命令。
- 用至少一个固定样例演示。
- 记录未解决风险和下周依赖。
- 只在验收通过后关闭本周切片。

## 13. 质量 Gate

每个合并候选必须通过：

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --prod
```

涉及数据库时额外通过：

- Prisma Schema 校验。
- 空数据库迁移。
- seed 幂等性。
- 迁移前后数据保留检查。

涉及 UI 时额外检查：

- 加载、空、失败、成功状态。
- 键盘操作和可见焦点。
- 表单标签和错误提示。
- 1440px 工作台与窄屏基本可用性。

涉及 AI 时额外检查：

- 合法结构化输出。
- 非法输出拒绝。
- Provider 超时或失败。
- 来源和 AIJob 可追踪。
- suggested 不会自动变为 confirmed。
- 隐藏内容不会误泄露。

## 14. 完成定义

一个功能只有同时满足以下条件才算完成：

- 用户动作可以从界面完整执行。
- 数据真实保存并可以重新读取。
- 生产者和消费者共享同一协议。
- 成功和关键失败路径有测试。
- 权限、来源和状态流转可追踪。
- 没有引入未批准的新依赖或远期架构。
- 质量 Gate 实际运行通过。
- 文档只更新受到影响的运行方式或公共契约。

“代码写完”“页面能看”或“Mock 返回成功”都不能单独作为完成标准。

## 15. 风险控制

| 风险               | 约束                                                    |
| ------------------ | ------------------------------------------------------- |
| 功能膨胀           | 每周只冻结一个主要用户结果，远期需求不进入当前切片      |
| 前后端字段漂移     | 共享 Zod Schema 先于 API 和页面实现                     |
| 数据不可追踪       | 所有 AI 产物保存来源、任务和版本                        |
| AI 污染正史        | suggested 与 confirmed 强制分离，确认必须由用户动作触发 |
| 隐藏内容泄露       | context_pack、对话和导出都执行隐藏内容规则              |
| 基础设施过早复杂化 | 真实需要前不引入 Redis、BullMQ、事件总线或微服务        |
| 测试滞后           | 每个切片随实现增加测试，不在 Phase 4 集中补测试         |
| 认证阻断主链路     | 先建立统一 Actor 边界，再逐步替换 Demo 身份             |
| 设计稿与实现分离   | UI Tokens 和实际组件为实现源，设计稿提供视觉依据        |

## 16. 明确推迟的工作

以下内容不进入 MVP 开发排期：

- 微信小程序业务开发。
- Redis 与 BullMQ，除非真实 AI 延迟证明同步流程不可接受。
- 复杂关系图谱编辑器。
- DOCX / PDF 导出。
- 自动长篇正文生成。
- 多 Agent 会议、投票和信誉分。
- 企业级权限与协作。
- 读者模拟、A/B 测试和连载数据分析。
- 正式生产部署和商业计费。

## 17. 下一步任务

立即开始 Phase 1A Slice 1：

1. 为身份与认证方案写一份简短 ADR。
2. 定义 `ActorContext` 边界，接入 Demo User。
3. 补齐项目创建、更新和列表 Schema。
4. 实现 Projects service 和 owner 隔离查询。
5. 实现项目 API 集成测试。
6. 扩展 API Client。
7. 实现项目列表、创建表单和工作台空状态。
8. 演示“创建项目并重新打开”。

此切片通过后，再进入创意输入，不并行开发高概念页面。
