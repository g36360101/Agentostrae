import { BadRequestException, type PipeTransform } from "@nestjs/common";
import { ZodError, type ZodType } from "zod";

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value);
    } catch (error: unknown) {
      if (!(error instanceof ZodError)) {
        throw error;
      }

      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: error.issues
          .map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`)
          .join("; "),
      });
    }
  }
}
