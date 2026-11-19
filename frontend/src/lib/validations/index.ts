import { z } from "zod";

/**
 * Base Zod validation schemas
 */
export const basePaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type BasePaginationQuery = z.infer<typeof basePaginationSchema>;
