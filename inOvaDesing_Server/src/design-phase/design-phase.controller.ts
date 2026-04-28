import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DesignPhaseService } from './design-phase.service';
import { CreateDesignPhaseDto } from './dto/create-design-phase.dto';
import { UpdateDesignPhaseDto } from './dto/update-design-phase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Design Phase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('design-phase')
export class DesignPhaseController {
  constructor(private readonly service: DesignPhaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear fase de diseño' })
  create(@Body() dto: CreateDesignPhaseDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las fases de diseño' })
  findAll() {
    return this.service.findAll();
  }

  @Get('ova/:idOVA')
  @ApiOperation({ summary: 'Obtener fase de diseño de un OVA específico' })
  findByOva(@Param('idOVA') idOVA: string) {
    return this.service.findByOva(idOVA);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener fase de diseño por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar fase de diseño' })
  update(@Param('id') id: string, @Body() dto: UpdateDesignPhaseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar fase de diseño' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
