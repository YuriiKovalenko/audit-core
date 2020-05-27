import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string) {
    return new Date(value);
  }
}
