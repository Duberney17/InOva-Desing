import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalysisPhaseService } from './analysis-phase.service';
import { CreateAnalysisPhaseDto } from './dto/create-analysis-phase.dto';
import { UpdateAnalysisPhaseDto } from './dto/update-analysis-phase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analysis Phase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analysis-phase')
export class AnalysisPhaseController {
  constructor(private readonly service: AnalysisPhaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear fase de análisis' })
  create(@Body() dto: CreateAnalysisPhaseDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las fases de análisis' })
  findAll() {
    return this.service.findAll();
  }

  @Get('ova/:idOVA')
  @ApiOperation({ summary: 'Obtener fase de análisis de un OVA específico' })
  findByOva(@Param('idOVA') idOVA: string) {
    return this.service.findByOva(idOVA);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener fase de análisis por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar fase de análisis' })
  update(@Param('id') id: string, @Body() dto: UpdateAnalysisPhaseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar fase de análisis' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
