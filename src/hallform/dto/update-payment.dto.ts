import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentDetails: string;
}
