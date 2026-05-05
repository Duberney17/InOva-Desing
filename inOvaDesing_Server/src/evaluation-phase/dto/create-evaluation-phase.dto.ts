import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluationPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: ['Formativa', 'Sumativa'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tiposEvaluacion?: string[];

  @ApiPropertyOptional({ example: 'El estudiante identifica correctamente los pasos de un algoritmo con al menos 70% de acierto' })
  @IsOptional()
  @IsString()
  criteriosEvaluacion?: string;

  @ApiPropertyOptional({ example: ['Rúbrica', 'Quiz / Cuestionario'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instrumentos?: string[];

  @ApiPropertyOptional({ example: 'El 80% de los estudiantes supera la prueba final' })
  @IsOptional()
  @IsString()
  resultadosEsperados?: string;

  @ApiPropertyOptional({ example: 'Reforzar módulo 2 con ejercicios adicionales si el promedio es menor a 3.5' })
  @IsOptional()
  @IsString()
  planMejora?: string;
}
