import { z } from "zod";
import { apiSuccessSchema, idSchema } from "./common";

export const chatMessageSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(10000),
  citedAssetIds: z.array(idSchema),
  citedRelationIds: z.array(idSchema),
  contextSnapshot: z.any(),
  createdAt: z.string().datetime(),
});

export const sendChatMessageInputSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const chatMessageListResponseSchema = apiSuccessSchema(
  z.array(chatMessageSchema),
);

export const chatMessageResponseSchema = apiSuccessSchema(chatMessageSchema);

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type SendChatMessageInput = z.infer<typeof sendChatMessageInputSchema>;
export type ChatMessageListResponse = z.infer<typeof chatMessageListResponseSchema>;
export type ChatMessageResponse = z.infer<typeof chatMessageResponseSchema>;
