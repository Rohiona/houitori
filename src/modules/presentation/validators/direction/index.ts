import { z } from "zod";

/**
 * 個人の生年月スキーマ
 */
export const personSchema = z.object({
  birthYear: z.int().min(1900, "birthYear must be an integer >= 1900"),
  birthMonth: z
    .int()
    .min(1, "birthMonth must be an integer between 1 and 12")
    .max(12, "birthMonth must be an integer between 1 and 12"),
});

/**
 * 方位計算リクエストのバリデーションスキーマ
 */
export const directionRequestSchema = z.object({
  targetYear: z.int().min(2020, "targetYear must be an integer >= 2020"),
  persons: z
    .array(personSchema)
    .min(1, "At least 1 person is required")
    .max(5, "Maximum 5 persons allowed"),
});

export type DirectionRequest = z.infer<typeof directionRequestSchema>;
