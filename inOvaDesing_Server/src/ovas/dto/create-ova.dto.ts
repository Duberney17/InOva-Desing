import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOvaDto {
  @ApiProperty({ example: 'Introducción a la Fotosíntesis' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'OVA sobre el proceso de fotosíntesis en plantas' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d', description: 'ID del estudiante creador' })
  @IsString()
  @IsNotEmpty()
  idEstudiante: string;

  @ApiPropertyOptional({ example: 'en_progreso', enum: ['en_progreso', 'completado', 'revisado'] })
  @IsOptional()
  @IsString()
  @IsIn(['en_progreso', 'completado', 'revisado'])
  state?: string;
}
