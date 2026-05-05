import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImplentationPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'Moodle' })
  @IsOptional()
  @IsString()
  plataformaPublicacion?: string;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsString()
  fechaImplementacion?: string;

  @ApiPropertyOptional({ example: 'Grado 5° — Grupo A — IE San José' })
  @IsOptional()
  @IsString()
  grupoObjetivo?: string;

  @ApiPropertyOptional({ example: 'Navegador Chrome actualizado, conexión a internet de mínimo 5 Mbps' })
  @IsOptional()
  @IsString()
  requisitosTecnicos?: string;

  @ApiPropertyOptional({ example: 'Circular informativa enviada a padres y mensaje en classroom' })
  @IsOptional()
  @IsString()
  planComunicacion?: string;
}
