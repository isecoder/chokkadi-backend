import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+\d{1,15}$/, {
    message: 'Mobile number must be in international format starting with "+"',
  })
  mobileNumber: string;
}
