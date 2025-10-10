import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ZodSchema } from "zod";
import { validate } from "@budrive/validation";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<unknown>) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = validate(this.schema)(value);

    if (!result.success) {
      throw new BadRequestException(result.errors);
    }

    return result.data;
  }
}
