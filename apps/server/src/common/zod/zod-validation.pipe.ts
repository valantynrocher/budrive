import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const formated = this.formatErrors(result.error);
      throw new BadRequestException(formated);
    }
    return result.data;
  }

  private formatErrors(error: ZodError) {
    // retourne un tableau de messages customisés
    return error.errors.map((e) => e.message);
  }
}
