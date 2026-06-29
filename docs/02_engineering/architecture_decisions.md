# Phase 0 架构决策记录

本文件记录会影响多个应用或后续迁移成本的工程决策。局部实现细节不进入这里。

## ADR-001：Web 优先，小程序后置

- 状态：已采纳
- 决策：先在 Web 跑通完整创作闭环，小程序在 API 和共享协议稳定后开始。
- 原因：完整编辑、候选比较和批量审核更适合桌面工作台。
- 影响：Phase 0 不创建 Taro 业务工程。

## ADR-002：TypeScript Monorepo

- 状态：已采纳
- 决策：使用 pnpm workspace 和 Turborepo，应用与共享包使用 TypeScript 严格模式。
- 原因：共享类型、验证 Schema、API Client 和 AI 任务协议，减少跨端漂移。
- 影响：公共契约只能从 `packages/shared` 导出，不能在应用中复制定义。

## ADR-003：共享边界使用 Zod

- 状态：已采纳
- 决策：API 输入输出和 AI 结构化输出使用 Zod 作为运行时边界校验。
- 原因：静态类型不能验证网络和模型返回值，Zod 可以让类型与校验规则同源。
- 影响：NestJS 适配层复用共享 Schema，不另外维护一套字段定义。

## ADR-004：Phase 0 使用确定性 AI Mock

- 状态：已采纳
- 决策：真实模型 Provider 暂不接入，Mock 与未来 Provider 实现同一接口并经过同一 Schema。
- 原因：优先验证用户流程、保存逻辑和内容协议，隔离模型波动与成本。
- 影响：Mock 不得绕过 AIJob、解析或校验边界。

## ADR-005：PostgreSQL 与 Prisma

- 状态：已采纳
- 决策：PostgreSQL 是主数据库，Prisma 管理模型、迁移和类型安全访问。
- 原因：项目需要结构化实体、关系、JSON 内容和可靠迁移。
- 影响：数据库变更必须通过 Prisma Schema 和版本化迁移完成。

## ADR-006：AI 建议与正史隔离

- 状态：已采纳
- 决策：AI 只能创建候选；未经用户明确确认，不得进入 `confirmed` 正史状态。
- 原因：避免模型输出污染作品设定，并保留来源与审核过程。
- 影响：所有后续资产、关系和修复建议都必须经过审核状态机。

## ADR-007：本地认证先于第三方认证

- 状态：临时采用
- 决策：第一里程碑只预留最小本地用户边界，不接微信或其他第三方登录。
- 原因：第三方集成不应阻断创意到核心卡的首个闭环。
- 复审时机：小程序开发启动前。

## ADR-008：项目系统先使用受控 Demo Actor

- 状态：已被 ADR-009 替代；仅保留测试与显式本地调试模式
- 决策：第一个项目纵向切片通过统一 `ActorContext` 注入固定 Demo Actor，业务模块不得直接引用固定用户 ID。
- 原因：先验证项目持久化、owner 隔离和完整 Web/API 链路，同时避免认证页面阻断首个用户结果。
- 安全边界：`AUTH_MODE=demo` 时生产环境拒绝启动；Demo Actor 只能用于本地开发和自动测试。
- 替换时机：Phase 1A 退出前，用正式登录态实现替换 `ActorContext` 的身份来源。

## ADR-009：使用数据库 Session 与 HttpOnly Cookie

- 状态：已采纳
- 决策：Web 登录使用数据库 Session；浏览器只持有高熵随机令牌，数据库只保存令牌的 SHA-256，不把登录令牌写入 localStorage。
- 密码：使用 Node.js 异步 `scrypt`、16 字节随机 salt 和常量时间比较；哈希记录包含参数，便于后续升级。
- Cookie：开发环境使用 `agentos_session`，生产环境使用 `__Host-agentos_session`；设置 HttpOnly、SameSite=Lax、Path=/，生产环境强制 Secure。
- 生命周期：默认 30 天；退出会删除当前 Session，过期 Session 不再被 ActorContext 接受。
- 边界：项目模块只依赖 `ActorContext`，不直接解析 Cookie；未来小程序可以替换身份传输方式而不改项目业务逻辑。
