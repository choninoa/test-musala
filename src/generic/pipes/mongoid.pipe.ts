import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log(metadata)
    if (!isMongoId(value))
      throw new HttpException(
        `${metadata.data} must be a valid Mongo ID`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    return value;
  }
}
