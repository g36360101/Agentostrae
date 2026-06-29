import { z } from "zod";
import { apiSuccessSchema, entityTimestampsSchema, idSchema } from "./common";

export const highConceptCandidateContentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  logline: z.string().trim().min(10).max(500),
  genre: z.string().trim().min(1).max(80),
  coreHook: z.string().trim().min(10).max(500),
  mainConflict: z.string().trim().min(10).max(1000),
  protagonistDrive: z.string().trim().min(10).max(500),
  worldDifference: z.string().trim().min(10).max(500),
  emotionalPromise: z.string().trim().min(10).max(500),
  targetReader: z.string().trim().min(2).max(300),
  serializationPotential: z.string().trim().min(10).max(500),
  expansionDirection: z.string().trim().min(10).max(500),
  riskNotes: z.array(z.string().trim().min(2).max(300)).min(1),
});

export const highConceptCandidateSchema = highConceptCandidateContentSchema
  .extend({
    id: idSchema,
    projectId: idSchema,
    ideaId: idSchema,
    aiJobId: idSchema,
    isSelected: z.boolean(),
  })
  .merge(entityTimestampsSchema);

export const generateHighConceptsOutputSchema = z.object({
  candidates: z.array(highConceptCandidateContentSchema).min(3).max(5),
});

export const highConceptCandidateListResponseSchema = apiSuccessSchema(
  z.array(highConceptCandidateSchema),
);

export const coreCardContentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  genre: z.string().trim().min(1).max(80),
  logline: z.string().trim().min(10).max(500),
  readerPromise: z.string().trim().min(10).max(500),
  worldviewSummary: z.string().trim().min(10).max(2000),
  protagonistSummary: z.string().trim().min(10).max(1000),
  protagonistGap: z.string().trim().min(10).max(500),
  centralConflict: z.string().trim().min(10).max(1000),
  antagonistForce: z.string().trim().min(10).max(1000),
  longTermMystery: z.string().trim().min(10).max(1000),
  themeStatement: z.string().trim().min(10).max(500),
  targetReader: z.string().trim().min(2).max(300),
  canonConstraints: z.array(z.string().trim().min(2).max(300)).min(1),
});

export const projectCoreCardSchema = coreCardContentSchema
  .extend({
    id: idSchema,
    projectId: idSchema,
    sourceCandidateId: idSchema,
    version: z.number().int().positive(),
  })
  .merge(entityTimestampsSchema);

export type HighConceptCandidateContent = z.infer<typeof highConceptCandidateContentSchema>;
export type HighConceptCandidate = z.infer<typeof highConceptCandidateSchema>;
export type GenerateHighConceptsOutput = z.infer<typeof generateHighConceptsOutputSchema>;
export type HighConceptCandidateListResponse = z.infer<
  typeof highConceptCandidateListResponseSchema
>;
export type CoreCardContent = z.infer<typeof coreCardContentSchema>;
export type ProjectCoreCard = z.infer<typeof projectCoreCardSchema>;
