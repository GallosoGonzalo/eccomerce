import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

export class UpsertProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  @ArrayNotEmpty()
  images: string[];

  @IsOptional()
  @IsString()
  slug?: string;
}
