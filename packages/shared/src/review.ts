import { z } from "zod";
import { apiSuccessSchema, idSchema } from "./common";

export const assetTypeSchema = z.enum([
  "character",
  "location",
  "item",
  "faction",
  "concept",
  "event",
]);

export const relationTypeSchema = z.enum([
  "ally",
  "enemy",
  "family",
  "mentor",
  "location_of",
  "owns",
  "member_of",
  "related_to",
]);

export const reviewStatusSchema = z.enum([
  "suggested",
  "confirmed",
  "rejected",
]);

export const spoilerLevelSchema = z.enum([
  "none",
  "minor",
  "major",
  "twist",
]);

export const extractedAssetSchema = z.object({
  name: z.string().min(1).max(120),
  assetType: assetTypeSchema,
  description: z.string().min(1).max(5000),
  narrativeFunction: z.string().min(1).max(2000),
  evidenceText: z.string().min(1).max(5000),
  spoilerLevel: spoilerLevelSchema,
});

export const extractedRelationSchema = z.object({
  sourceName: z.string().min(1).max(120),
  targetName: z.string().min(1).max(120),
  relationType: relationTypeSchema,
  evidenceText: z.string().min(1).max(5000),
  spoilerLevel: spoilerLevelSchema,
});

export const storyAssetSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  name: z.string().min(1).max(120),
  assetType: assetTypeSchema,
  description: z.string().min(1).max(5000),
  narrativeFunction: z.string().min(1).max(2000),
  evidenceText: z.string().min(1).max(5000),
  spoilerLevel: spoilerLevelSchema,
  status: reviewStatusSchema,
  sourcePlanId: idSchema,
  confirmedBy: idSchema.nullable(),
  confirmedAt: z.string().datetime().nullable(),
  rejectedBy: idSchema.nullable(),
  rejectedAt: z.string().datetime().nullable(),
});

export const storyRelationSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  sourceAssetId: idSchema,
  targetAssetId: idSchema,
  relationType: relationTypeSchema,
  evidenceText: z.string().min(1).max(5000),
  spoilerLevel: spoilerLevelSchema,
  status: reviewStatusSchema,
  sourcePlanId: idSchema,
  confirmedBy: idSchema.nullable(),
  confirmedAt: z.string().datetime().nullable(),
  rejectedBy: idSchema.nullable(),
  rejectedAt: z.string().datetime().nullable(),
});

export const updateAssetInputSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  assetType: assetTypeSchema.optional(),
  description: z.string().min(1).max(5000).optional(),
  narrativeFunction: z.string().min(1).max(2000).optional(),
  evidenceText: z.string().min(1).max(5000).optional(),
  spoilerLevel: spoilerLevelSchema.optional(),
});

export const updateRelationInputSchema = z.object({
  relationType: relationTypeSchema.optional(),
  evidenceText: z.string().min(1).max(5000).optional(),
  spoilerLevel: spoilerLevelSchema.optional(),
});

export const storyAssetListResponseSchema = apiSuccessSchema(
  z.array(storyAssetSchema),
);

export const storyAssetResponseSchema = apiSuccessSchema(storyAssetSchema);

export const storyRelationListResponseSchema = apiSuccessSchema(
  z.array(storyRelationSchema),
);

export const storyRelationResponseSchema = apiSuccessSchema(storyRelationSchema);

export type AssetType = z.infer<typeof assetTypeSchema>;
export type RelationType = z.infer<typeof relationTypeSchema>;
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type SpoilerLevel = z.infer<typeof spoilerLevelSchema>;
export type ExtractedAsset = z.infer<typeof extractedAssetSchema>;
export type ExtractedRelation = z.infer<typeof extractedRelationSchema>;
export type StoryAsset = z.infer<typeof storyAssetSchema>;
export type StoryRelation = z.infer<typeof storyRelationSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetInputSchema>;
export type UpdateRelationInput = z.infer<typeof updateRelationInputSchema>;
export type StoryAssetListResponse = z.infer<typeof storyAssetListResponseSchema>;
export type StoryAssetResponse = z.infer<typeof storyAssetResponseSchema>;
export type StoryRelationListResponse = z.infer<typeof storyRelationListResponseSchema>;
export type StoryRelationResponse = z.infer<typeof storyRelationResponseSchema>;
