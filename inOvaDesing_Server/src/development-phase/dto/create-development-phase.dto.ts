import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDevelopmentPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: ['Video', 'Ejercicios interactivos'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tiposContenido?: string[];

  @ApiPropertyOptional({ example: 'Módulo 1: introducción visual. Módulo 2: práctica guiada.' })
  @IsOptional()
  @IsString()
  descripcionContenido?: string;

  @ApiPropertyOptional({ example: 'Licencia Canva Pro, imágenes CC, grabador de pantalla' })
  @IsOptional()
  @IsString()
  recursosNecesarios?: string;

  @ApiPropertyOptional({ example: 'H5P' })
  @IsOptional()
  @IsString()
  herramientaDesarrollo?: string;

  @ApiPropertyOptional({ example: 'proceso', enum: ['inicio', 'proceso', 'completado'] })
  @IsOptional()
  @IsString()
  estadoAvance?: string;
}
