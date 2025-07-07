import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isObjectIdOrHexString } from 'mongoose';

@Injectable()
export class ParseObjectPipe implements PipeTransform<any, string> {
  transform(value: any, metadata: ArgumentMetadata): string {
    if (!isObjectIdOrHexString(value)) {
      throw new BadRequestException('Validation failed (ObjectId is expected)');
    }
    return value;
  }
}
