import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO recibido en el body multipart junto con el archivo.
 * Multer pone el archivo en `request.file`; estos campos vienen como text fields.
 */
export class CreateOvaFileDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0e' })
  @IsString()
  @IsNotEmpty()
  idEstudiante: string;

  @ApiPropertyOptional({
    example: 'analisis',
    enum: ['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['analisis', 'diseno', 'desarrollo', 'implementacion', 'evaluacion'])
  idFase?: string;
}
