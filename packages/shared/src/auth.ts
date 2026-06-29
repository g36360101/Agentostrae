import { z } from "zod";
import { apiSuccessSchema, entityTimestampsSchema, idSchema } from "./common";

export const emailSchema = z.string().trim().toLowerCase().email().max(320);
export const passwordSchema = z.string().min(10).max(128);

export const registerInputSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1).max(120),
  password: passwordSchema,
});

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const currentUserSchema = z
  .object({
    id: idSchema,
    email: emailSchema,
    name: z.string().min(1).max(120),
  })
  .merge(entityTimestampsSchema);

export const authResponseSchema = apiSuccessSchema(
  z.object({
    user: currentUserSchema,
  }),
);

export const logoutResponseSchema = apiSuccessSchema(
  z.object({
    authenticated: z.literal(false),
  }),
);

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type CurrentUser = z.infer<typeof currentUserSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
