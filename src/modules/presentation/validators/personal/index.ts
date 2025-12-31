import { z } from "zod";

/**
 * 個人星計算リクエストのバリデーションスキーマ
 */
export const personalStarRequestSchema = z.object({
  birthYear: z.int().min(1900, "birthYear must be an integer >= 1900"),
  birthMonth: z
    .int()
    .min(1, "birthMonth must be an integer between 1 and 12")
    .max(12, "birthMonth must be an integer between 1 and 12"),
});
