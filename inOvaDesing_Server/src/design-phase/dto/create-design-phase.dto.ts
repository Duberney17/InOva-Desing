import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDesignPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'El estudiante será capaz de identificar las etapas de un algoritmo' })
  @IsOptional()
  @IsString()
  objetivoAprendizaje?: string;

  @ApiPropertyOptional({ example: 'lineal', enum: ['lineal', 'ramificada', 'mixta'] })
  @IsOptional()
  @IsString()
  estructuraOva?: string;

  @ApiPropertyOptional({ example: 'Aprendizaje basado en problemas (ABP)' })
  @IsOptional()
  @IsString()
  estrategiaPedagogica?: string;

  @ApiPropertyOptional({ example: 'El estudiante resuelve correctamente al menos 3 de 5 ejercicios' })
  @IsOptional()
  @IsString()
  indicadoresEvaluacion?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(480)
  tiempoEstimado?: number;
}
