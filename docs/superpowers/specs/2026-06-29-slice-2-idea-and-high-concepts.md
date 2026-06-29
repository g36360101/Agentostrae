# AgentOS Slice 2 Design — 输入创意并生成高概念

- 日期：2026-06-29
- 范围：第二纵向切片
- 目标：用户在项目内输入创意，系统通过 Mock AI 生成多个高概念候选并展示。

## 用户流程

```
/projects/:id（项目详情）
  ├── 查看项目基本信息
  ├── 输入创意表单（原始创意、题材偏好、读者预期、禁忌备注、参考氛围）
  ├── 提交 → POST /projects/:id/ideas → 保存到 project_ideas
  ├── 触发生成 → POST /projects/:id/high-concepts → AI 编排
  └── 展示 3-5 个高概念候选卡片
```

## 状态映射

| 用户动作 | 前端状态 | 后端行为 | 数据保存 |
|---|---|---|---|
| 输入创意并提交 | 提交中 → 展示候选 | POST /ideas | project_ideas |
| 触发高概念生成 | 生成中 → 展示列表 | POST /high-concepts | ai_jobs + high_concept_candidates |
| 查看候选 | 只读列表 | GET /high-concepts | 读取 high_concept_candidates |

## 模块设计

### 后端

**IdeasModule**
- `IdeasController`: `POST /projects/:projectId/ideas`
- `IdeasService`: Prisma `projectIdea.create`

**HighConceptsModule**
- `HighConceptsController`: `POST /projects/:projectId/high-concepts`, `GET /projects/:projectId/high-concepts`
- `HighConceptsService`: 调用 AiOrchestratorService，保存 candidates

**AiOrchestratorService**
- `generateHighConcepts(projectId: string, idea: ProjectIdea)`:
  1. 创建 AiJob（pending）
  2. 调用 MockAiProvider.generateHighConcepts
  3. 更新 AiJob（succeeded + output）
  4. 为每个 candidate 创建 HighConceptCandidate 记录
  5. 返回 candidates

### 前端

**ProjectDetail 扩展**
- 在「初始构想」下方添加「输入创意」表单区域
- 表单字段：rawText（必填）、genrePreference、readerExpectation、tabooNotes、referenceVibe
- 提交成功后自动触发高概念生成
- 展示生成的高概念候选卡片列表（标题、一句话简介、题材、核心钩子）

### API Client 扩展

- `createProjectIdea(projectId, input)`
- `generateHighConcepts(projectId)`
- `listHighConceptCandidates(projectId)`

## 错误处理

- 创意文本太短（<10 字）：Zod 校验拦截
- AI 生成失败：AiJob 标记为 failed，前端展示错误
- 项目不存在：404 PROJECT_NOT_FOUND
- 未授权：401 UNAUTHORIZED

## 验收标准

- [ ] 在项目详情页输入创意并提交，保存成功
- [ ] 提交后自动触发 Mock AI 生成高概念
- [ ] 展示 3-5 个高概念候选卡片
- [ ] 相同样例输入得到稳定结果
- [ ] 刷新页面后创意和候选不丢失
- [ ] lint / typecheck / test / build 全部通过

## 风险

- Mock AI 输出是确定性的，真实 AI 接入后接口边界需保持不变
- HighConceptCandidate 表字段较多，需确保与 Schema 一致
