import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImplentationPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'Publicar en plataforma Moodle en semana 5' })
  @IsOptional()
  @IsString()
  applicationPlan?: string;

  @ApiPropertyOptional({ example: 'Tutoriales de acceso y soporte técnico disponible' })
  @IsOptional()
  @IsString()
  support?: string;
}
