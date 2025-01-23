import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateHallDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  name_kannada?: string;

  @IsOptional()
  @IsString()
  description_kannada?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true }) // Validate that each value in the array is a number
  imageIds: number[];
}
