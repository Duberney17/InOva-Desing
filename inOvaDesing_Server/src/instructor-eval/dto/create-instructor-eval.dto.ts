import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInstructorEvalDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0e' })
  @IsString()
  @IsNotEmpty()
  idEstudiante: string;

  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0f' })
  @IsString()
  @IsNotEmpty()
  idDocente: string;

  @ApiProperty({
    example: 'analisis',
    enum: ['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion'],
    description: 'Fase ADDIE que se está evaluando',
  })
  @IsString()
  @IsIn(['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion'])
  fase: string;

  @ApiPropertyOptional({
    example: 'aprobado',
    enum: ['pendiente', 'aprobado', 'rechazado'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'aprobado', 'rechazado'])
  estado?: string;

  @ApiPropertyOptional({ example: 'Excelente identificación del problema, profundizar en objetivos' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
