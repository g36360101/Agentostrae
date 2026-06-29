import { z } from "zod";
import { entityTimestampsSchema, idSchema, isoDateTimeSchema } from "./common";

export const aiTaskTypeSchema = z.enum(["generate_high_concepts", "generate_core_card"]);
export const aiJobStatusSchema = z.enum(["pending", "running", "succeeded", "failed"]);

export const aiJobSchema = z
  .object({
    id: idSchema,
    projectId: idSchema,
    taskType: aiTaskTypeSchema,
    status: aiJobStatusSchema,
    provider: z.string().min(1),
    model: z.string().min(1),
    input: z.unknown(),
    output: z.unknown().nullable(),
    errorMessage: z.string().nullable(),
    tokenUsage: z.number().int().nonnegative().nullable(),
    completedAt: isoDateTimeSchema.nullable(),
  })
  .merge(entityTimestampsSchema);

export type AiTaskType = z.infer<typeof aiTaskTypeSchema>;
export type AiJobStatus = z.infer<typeof aiJobStatusSchema>;
export type AiJob = z.infer<typeof aiJobSchema>;
