import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateProductDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @MinLength(3)
  name_product: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsUUID()
  category: string; //! id de la tabla de categoría
}
