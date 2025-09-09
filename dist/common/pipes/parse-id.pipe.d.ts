import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
