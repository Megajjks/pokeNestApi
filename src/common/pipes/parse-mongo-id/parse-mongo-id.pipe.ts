import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    /* Validar si es un MongoId */
    if(!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoId`);
    }
    return value;
  }
}
