import { config } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";

config({ path: resolve(process.cwd(), "../../.env"), quiet: true });

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    API_PORT: z.coerce.number().int().positive().max(65535).default(4000),
    API_HOST: z.string().min(1).default("0.0.0.0"),
    CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
    AUTH_MODE: z.enum(["demo", "session"]).default("session"),
    DEMO_ACTOR_ID: z.string().uuid().default("00000000-0000-4000-8000-000000000000"),
    SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(30),
    AI_PROVIDER: z.literal("mock").default("mock"),
  })
  .superRefine((environment, context) => {
    if (environment.NODE_ENV === "production" && environment.AUTH_MODE === "demo") {
      context.addIssue({
        code: "custom",
        path: ["AUTH_MODE"],
        message: "Demo authentication is forbidden in production",
      });
    }
  });

export type ApiEnvironment = z.infer<typeof envSchema>;

export const readEnvironment = (): ApiEnvironment => envSchema.parse(process.env);
