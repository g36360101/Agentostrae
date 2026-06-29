# Web App

这里放作品设定工具的前端应用。

初期页面建议：

1. 登录 / 注册。
2. 项目列表。
3. 创建项目。
4. 项目工作台。
5. 创意输入。
6. 高概念候选。
7. 作品核心卡。
8. 作品开发案。
9. 设定资产库。
10. 项目 AI 对话。
11. 导出页。

建议技术：

- Next.js + React + TypeScript。
- TanStack Query。
- Tailwind CSS + shadcn/ui。
- 表单校验用 Zod。

Web 端是完整创作工作台。微信小程序放在 `apps/miniapp`，使用 Taro React，承担轻量入口和移动端审核。
