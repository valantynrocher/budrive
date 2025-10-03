import { z, ZodSchema, ZodError } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (value: unknown): ValidationResult<T> => {
    const result = schema.safeParse(value);

    if (!result.success) {
      return {
        success: false,
        errors: formatZodErrors(result.error),
      };
    }

    return { success: true, data: result.data };
  };

export function formatZodErrors(error: ZodError): string[] {
  return error.errors.map((e) => e.message);
}
