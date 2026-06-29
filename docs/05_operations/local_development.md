# 本地开发与 Gate B 验收

## 1. 环境要求

- Node.js 22
- pnpm 11.7.0
- Docker Compose

项目固定使用根目录 `package.json` 中声明的 pnpm 版本，不要使用 npm 或 yarn 生成额外锁文件。

Docker 中的 PostgreSQL 使用主机端口 `5433`，避免与 Homebrew 等本地 PostgreSQL 常用的 `5432` 冲突；容器内部仍使用 `5432`。

## 2. 首次启动

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

启动后验证：

- 打开 `http://localhost:3000`，应看到作品设定工作台。
- 打开 `http://localhost:4000/health`，应返回 `success: true`。
- Web 顶部状态应从“正在检查 API”变为“API 已就绪”。

## 3. 环境变量

复制 `.env.example` 为 `.env` 后再填写本地值。

- 不提交 `.env`。
- 不把真实密钥写入日志、测试或截图。
- Phase 0 的 `AI_PROVIDER` 必须保持为 `mock`。
- `NEXT_PUBLIC_` 开头的变量会暴露给浏览器，禁止放置秘密。
- `AUTH_MODE=session` 是当前默认值；`demo` 只能用于显式本地调试和测试，生产环境会拒绝 Demo 模式。
- Session Cookie 为 HttpOnly，不应通过前端脚本读取或复制到 localStorage。

## 4. 常用命令

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

数据库停止命令：

```bash
docker compose down
```

不要使用 `docker compose down -v`，除非明确要删除全部本地开发数据。

## 5. Gate B 检查表

- [ ] 依赖可从锁文件安装。
- [ ] Prisma Client 可以生成。
- [ ] Prisma Schema 和迁移一致。
- [ ] API 健康检查自动测试通过。
- [ ] 共享 Schema 测试通过。
- [ ] 三组 AI Mock 样例和非法样例校验通过。
- [ ] API Client 正常与失败路径测试通过。
- [ ] lint 通过。
- [ ] typecheck 通过。
- [ ] test 通过。
- [ ] build 通过。
- [ ] Web 可以连接 API，也能清楚展示 API 不可用状态。

## 6. 当前限制

- 当前环境若没有 Docker，只能完成 Prisma 的生成、格式和静态校验，不能声称迁移已经在真实 PostgreSQL 上执行。
- Phase 0 不包含真实 AI 调用。
- Web 中“创建项目”按钮是第一开发切片的入口占位，不代表业务功能已经完成。
