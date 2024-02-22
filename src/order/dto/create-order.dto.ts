import { IsString, IsUUID, Matches } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)
  date: string;

  @IsString()
  @IsUUID()
  user: string;
}
