import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'María López' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'maria@correo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'clave1234', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'docente', enum: ['docente', 'estudiante'] })
  @IsString()
  @IsIn(['docente', 'estudiante'])
  rol: string;

  /**
   * Solo para estudiantes: ID del docente que los registra.
   */
  @ApiPropertyOptional({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsOptional()
  @IsString()
  idDocente?: string;
}
