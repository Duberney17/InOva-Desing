import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDevelopmentPhaseDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsString()
  @IsNotEmpty()
  idOVA: string;

  @ApiPropertyOptional({ example: 'Videos explicativos, infografías, cuestionarios' })
  @IsOptional()
  @IsString()
  createdResources?: string;

  @ApiPropertyOptional({ example: 'Actividad de identificación de cloroplastos' })
  @IsOptional()
  @IsString()
  activities?: string;
}
