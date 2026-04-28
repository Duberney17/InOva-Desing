import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDesignPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'Aprendizaje basado en problemas' })
  @IsOptional()
  @IsString()
  strategies?: string;

  @ApiPropertyOptional({ example: 'El estudiante identificará las etapas de la fotosíntesis' })
  @IsOptional()
  @IsString()
  specificObjectives?: string;

  @ApiPropertyOptional({ example: 'Módulo 1: Introducción, Módulo 2: Proceso' })
  @IsOptional()
  @IsString()
  structure?: string;
}
