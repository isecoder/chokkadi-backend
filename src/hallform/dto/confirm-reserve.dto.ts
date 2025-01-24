import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class ConfirmReserveDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // Ensures transformation to a Date object
  date: Date;
}
