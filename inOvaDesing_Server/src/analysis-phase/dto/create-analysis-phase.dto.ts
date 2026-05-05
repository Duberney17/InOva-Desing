import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalysisPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'Institución pública urbana, grado 5°, área de tecnología' })
  @IsOptional()
  @IsString()
  contextoEducativo?: string;

  @ApiPropertyOptional({ example: 'Los estudiantes no comprenden el pensamiento algorítmico' })
  @IsOptional()
  @IsString()
  necesidadAprendizaje?: string;

  @ApiPropertyOptional({ example: 'Estudiantes de grado 5°, entre 10 y 12 años' })
  @IsOptional()
  @IsString()
  publicoObjetivo?: string;

  @ApiPropertyOptional({ example: 'Manejo básico de computador y navegador web' })
  @IsOptional()
  @IsString()
  conocimientosPrevios?: string;

  @ApiPropertyOptional({ example: ['PC / Laptop', 'Tablet'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  herramientas?: string[];
}
