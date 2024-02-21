import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surnames: string;

  @IsPhoneNumber('PE')
  @IsOptional()
  @IsString()
  @MaxLength(9)
  phone?: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
