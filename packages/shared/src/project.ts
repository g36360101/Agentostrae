import { z } from "zod";
import { apiSuccessSchema, entityTimestampsSchema, idSchema } from "./common";

export const projectStatusSchema = z.enum(["draft", "active", "archived"]);

export const projectSchema = z
  .object({
    id: idSchema,
    ownerId: idSchema,
    title: z.string().trim().min(1).max(120),
    genre: z.string().trim().min(1).max(80).nullable(),
    premise: z.string().trim().max(2000).nullable(),
    status: projectStatusSchema,
  })
  .merge(entityTimestampsSchema);

export const createProjectInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  genre: z.string().trim().min(1).max(80).optional(),
  premise: z.string().trim().max(2000).optional(),
});

export const updateProjectInputSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    genre: z.string().trim().min(1).max(80).nullable().optional(),
    premise: z.string().trim().max(2000).nullable().optional(),
    status: projectStatusSchema.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one project field must be provided",
  });

export const projectResponseSchema = apiSuccessSchema(projectSchema);
export const projectListResponseSchema = apiSuccessSchema(z.array(projectSchema));

export const projectIdeaSchema = z
  .object({
    id: idSchema,
    projectId: idSchema,
    rawText: z.string().trim().min(10).max(10000),
    genrePreference: z.string().trim().max(80).nullable(),
    readerExpectation: z.string().trim().max(1000).nullable(),
    tabooNotes: z.string().trim().max(1000).nullable(),
    referenceVibe: z.string().trim().max(1000).nullable(),
    aiCreativityLevel: z.number().min(0).max(1),
  })
  .merge(entityTimestampsSchema);

export const createProjectIdeaInputSchema = z.object({
  rawText: z.string().trim().min(10).max(10000),
  genrePreference: z.string().trim().min(1).max(80).optional(),
  readerExpectation: z.string().trim().max(1000).optional(),
  tabooNotes: z.string().trim().max(1000).optional(),
  referenceVibe: z.string().trim().max(1000).optional(),
  aiCreativityLevel: z.number().min(0).max(1).default(0.7),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
export type ProjectIdea = z.infer<typeof projectIdeaSchema>;
export type CreateProjectIdeaInput = z.infer<typeof createProjectIdeaInputSchema>;
