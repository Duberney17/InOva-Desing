import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalysisPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'El problema es la falta de recursos educativos digitales' })
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional({ example: 'Desarrollar habilidades en fotosíntesis' })
  @IsOptional()
  @IsString()
  objectives?: string;

  @ApiPropertyOptional({ example: 'Estudiantes de secundaria, edades 12-15' })
  @IsOptional()
  @IsString()
  context?: string;
}
