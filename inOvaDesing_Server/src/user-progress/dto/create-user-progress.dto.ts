import { IsString, IsNotEmpty, IsOptional, IsArray, IsIn, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserProgressDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0e' })
  @IsString()
  @IsNotEmpty()
  idEstudiante: string;

  @ApiPropertyOptional({ example: ['analisis', 'diseno'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fasesCompletadas?: string[];

  @ApiPropertyOptional({
    example: 'desarrollo',
    enum: ['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion'])
  faseActual?: string;
}
