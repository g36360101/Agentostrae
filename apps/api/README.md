# API App

这里放作品设定工具的后端 API。

初期模块建议：

- Auth
- Projects
- Ideas
- HighConcepts
- CoreCards
- DevelopmentPlans
- Assets
- Relations
- ContextPacks
- AIOrchestrator
- Exports

建议技术：

- NestJS。
- TypeScript。
- Prisma。
- PostgreSQL。
- JWT。

## 当前 Phase 0 状态

- 已建立 NestJS 应用和 `/health` 健康检查。
- 已建立统一环境读取、CORS 和错误响应入口。
- 已建立 Projects、Ideas、HighConcepts、CoreCards、AIOrchestrator 模块边界。
- AIOrchestrator 当前只使用确定性 Mock。
- 业务接口和认证将在第一个纵向开发切片中实现。
