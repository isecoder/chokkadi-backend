// src/hall-form/dto/create-hall-form.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
import { IsInternationalPhone } from '../../common/decorators/IsInternationalPhone';
import { MatchesField } from '../../common/decorators/MatchesField';
import { ValidationMessages } from '../../common/constants/validation-message';

export class CreateHallFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsInternationalPhone()
  mobileNumber: string;

  @IsNotEmpty()
  @IsInternationalPhone()
  @MatchesField('mobileNumber', {
    message: ValidationMessages.mobileNumberConfirmation,
  })
  mobileNumberConfirmation: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  hallId: number;
}
