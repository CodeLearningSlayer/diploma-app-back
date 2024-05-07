import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);
    console.log(errors);
    if (errors.length > 0) {
      const messages = errors.reduce((acc, cur) => {
        const newConstraint = JSON.parse(
          `{"${cur.property}": "${Object.values(cur.constraints).join(', ')}"}`,
        );
        console.log(newConstraint);
        return Object.assign({}, acc, newConstraint);
      }, {});
      console.log(messages, 'MESSAGES');
      throw new ValidationException(messages);
    }
    return value;
  }
}
