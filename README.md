# AgentOS 作品设定工具

AgentOS 的第一个可落地方向是「作品设定工具」：帮助作者把一个创意发展成可保存、可追踪、可导出、可继续与 AI 协作的作品设定资产库。

这个项目不从“大而全的 StoryOS”开始，而从一个清晰的创作闭环开始：

```text
创意输入 -> 高概念生成 -> 作品核心卡 -> 作品开发案 -> 设定资产 -> 关系草图 -> AI 上下文包 -> 项目内对话 -> 导出
```

## 当前目标

第一阶段目标不是做完整写作平台，也不是自动生成长篇小说，而是做出一个能稳定使用的 MVP：

- 用户可以创建作品项目。
- 用户可以输入创意并获得多个高概念方向。
- 用户可以选择一个方向，生成作品核心卡和开发案。
- 系统可以从开发案中抽取人物、地点、组织、物品、规则、冲突、伏笔等设定资产。
- 用户确认后，资产进入项目设定库。
- 系统可以根据项目设定生成 AI 上下文包。
- 用户可以在项目内继续和 AI 对话。
- 用户可以导出作品资料。

## 不做什么

这些能力有价值，但不放进开发初期：

- 自动长篇正文连载生成。
- 多 Agent 辩论会议。
- Agent 信誉分和元学习。
- 企业级联邦治理。
- 商业模型信任治理。
- 审计门户、董事会模拟、运行时干预路由。

一句话：先做作者真的能用的作品设定工具，再谈 StoryOS 帝国。

## 目录结构

```text
agentOS/
  apps/
    web/                  # 前端应用，未来放作品设定工具界面
    api/                  # 后端 API，未来放项目、资产、AI 编排服务
  packages/
    shared/               # 前后端共享类型、常量、校验规则
    ai-core/              # AI 任务、Prompt 模板、结构化输出解析
    db/                   # 数据模型、迁移、种子数据
  docs/
    00_overview/          # 项目总览与判断
    01_product/           # 产品范围、路线图、用户故事
    02_engineering/       # 工程架构、开发步骤、接口计划
    03_ai/                # AI 编排、上下文包、Prompt 策略
    04_data/              # 数据模型与资产类型
    05_operations/        # 工作规则、验收、联调、发布节奏
    99_reference/         # 从原始 172 份文档中提炼出的参考
  assets/                 # 设计素材、截图、示例导出
  infra/                  # Docker、部署、环境配置
  scripts/                # 辅助脚本
  tests/                  # 跨模块测试与验收用例
  notes/                  # 临时笔记和未整理想法
```

## 推荐阅读顺序

1. `docs/00_overview/project_brief.md`
2. `docs/01_product/mvp_scope.md`
3. `docs/01_product/roadmap.md`
4. `docs/02_engineering/development_steps.md`
5. `docs/02_engineering/engineering_structure.md`
6. `docs/03_ai/ai_strategy.md`
7. `docs/04_data/data_model_draft.md`
8. `docs/05_operations/working_rules.md`

## 当前建议技术路线

先用成熟、容易推进的组合：

- 前端：Next.js 或 Vite + React + TypeScript。
- 后端：NestJS + TypeScript。
- 数据库：PostgreSQL。
- ORM：Prisma。
- AI 层：独立 `AIOrchestratorService`，所有模型调用通过统一任务接口进入。
- 状态与缓存：React Query。
- 导出：先 Markdown，后 DOCX / PDF。

这个选择不是为了炫技，而是为了让项目从第一周就能形成可运行闭环。

## 当前状态

当前仓库是项目初始骨架，尚未写入真实业务代码。接下来最适合做的事情是：

1. 创建前后端基础工程。
2. 建立 Project / Asset / Relation / ContextPack 的最小数据模型。
3. 实现“创建项目 -> 生成高概念 -> 保存作品核心卡”的第一条链路。
4. 再补资产抽取、上下文包和导出。

