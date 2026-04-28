import { IsEmail, IsString, MinLength, IsIn, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Carlos Pérez' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'carlos@correo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'clave1234', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'estudiante', enum: ['docente', 'estudiante'] })
  @IsString()
  @IsIn(['docente', 'estudiante'])
  rol: string;

  @ApiPropertyOptional({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsOptional()
  @IsString()
  idDocente?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  state?: boolean;
}
