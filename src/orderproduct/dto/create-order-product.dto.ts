import { IsString, IsUUID } from 'class-validator';

export class CreateOrderProductDto {
  @IsUUID()
  @IsString()
  order: string;

  @IsUUID()
  @IsString()
  product: string;
}
