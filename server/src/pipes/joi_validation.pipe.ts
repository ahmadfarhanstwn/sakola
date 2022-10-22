import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
  HttpException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error)
      throw new HttpException('Validation Failed', HttpStatus.BAD_REQUEST);
    return value;
  }
}
