import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { isObject } from 'util';

@Injectable()
export class JoiValidationPipe implements PipeTransform {

  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (isObject(value)) {
      const result = this.schema.validate(value);
      if (result.error) {
        throw new BadRequestException('Validation failed');
      }
    }
    return value;
  }
}
