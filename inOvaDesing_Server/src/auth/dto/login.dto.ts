import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'maria@correo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'clave1234' })
  @IsString()
  @MinLength(6)
  password: string;
}
