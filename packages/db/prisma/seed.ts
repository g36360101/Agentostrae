import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEMO_ACTOR_ID = "00000000-0000-4000-8000-000000000000";

const seed = async () => {
  const user = await prisma.user.upsert({
    where: { email: "demo@agentos.local" },
    update: { id: DEMO_ACTOR_ID },
    create: {
      id: DEMO_ACTOR_ID,
      email: "demo@agentos.local",
      name: "AgentOS Demo",
      passwordHash: "DEVELOPMENT_ONLY_NOT_A_REAL_PASSWORD_HASH",
    },
  });

  await prisma.project.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      ownerId: user.id,
      title: "天道草稿",
      genre: "玄幻悬疑升级流",
      premise: "一个失忆的修仙者发现自己其实是天道写废的草稿。",
      status: "active",
    },
  });
};

seed()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error("Database seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
