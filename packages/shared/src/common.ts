import { z } from "zod";

export const idSchema = z.string().uuid();
export const isoDateTimeSchema = z.string().datetime({ offset: true });

export const entityTimestampsSchema = z.object({
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const apiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.unknown().optional(),
  requestId: z.string().min(1).optional(),
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: apiErrorSchema,
});

export const apiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const healthDataSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("agentos-api"),
  timestamp: isoDateTimeSchema,
});

export const healthResponseSchema = apiSuccessSchema(healthDataSchema);

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type HealthData = z.infer<typeof healthDataSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
