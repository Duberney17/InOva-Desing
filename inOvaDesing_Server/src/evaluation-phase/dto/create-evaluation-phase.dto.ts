import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluationPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'Rúbrica de evaluación, quiz de 10 preguntas' })
  @IsOptional()
  @IsString()
  instruments?: string;

  @ApiPropertyOptional({ example: 'El 80% de los estudiantes aprueba con nota > 3.5' })
  @IsOptional()
  @IsString()
  expectedResults?: string;
}
