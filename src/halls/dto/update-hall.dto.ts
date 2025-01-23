import {
  IsOptional,
  IsBoolean,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdateHallDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name_kannada?: string;

  @IsOptional()
  @IsString()
  description_kannada?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Validate that each value in the array is a number
  imageIds?: number[];
}
