import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EvaluationPhaseService } from './evaluation-phase.service';
import { CreateEvaluationPhaseDto } from './dto/create-evaluation-phase.dto';
import { UpdateEvaluationPhaseDto } from './dto/update-evaluation-phase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Evaluation Phase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluation-phase')
export class EvaluationPhaseController {
  constructor(private readonly service: EvaluationPhaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear fase de evaluación' })
  create(@Body() dto: CreateEvaluationPhaseDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las fases de evaluación' })
  findAll() {
    return this.service.findAll();
  }

  @Get('ova/:idOVA')
  @ApiOperation({ summary: 'Obtener fase de evaluación de un OVA específico' })
  findByOva(@Param('idOVA') idOVA: string) {
    return this.service.findByOva(idOVA);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener fase de evaluación por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar fase de evaluación' })
  update(@Param('id') id: string, @Body() dto: UpdateEvaluationPhaseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar fase de evaluación' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
