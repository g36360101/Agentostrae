import { z } from "zod";
import { apiSuccessSchema, entityTimestampsSchema, idSchema } from "./common";

export const developmentPlanContentSchema = z.object({
  contentMarkdown: z.string().min(10).max(50000),
  structuredJson: z.any(),
});

export const developmentPlanSchema = developmentPlanContentSchema
  .extend({
    id: idSchema,
    projectId: idSchema,
    sourceCoreCardId: idSchema,
    aiJobId: idSchema,
    version: z.number().int().positive(),
  })
  .merge(entityTimestampsSchema);

export const updateDevelopmentPlanInputSchema = z.object({
  contentMarkdown: z.string().min(10).max(50000).optional(),
  structuredJson: z.any().optional(),
});

export const developmentPlanResponseSchema =
  apiSuccessSchema(developmentPlanSchema);

export const developmentPlanListResponseSchema = apiSuccessSchema(
  z.array(developmentPlanSchema),
);

export type DevelopmentPlanContent = z.infer<
  typeof developmentPlanContentSchema
>;
export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;
export type UpdateDevelopmentPlanInput = z.infer<
  typeof updateDevelopmentPlanInputSchema
>;
export type DevelopmentPlanResponse = z.infer<
  typeof developmentPlanResponseSchema
>;
export type DevelopmentPlanListResponse = z.infer<
  typeof developmentPlanListResponseSchema
>;
