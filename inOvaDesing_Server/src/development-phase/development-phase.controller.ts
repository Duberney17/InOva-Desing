import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DevelopmentPhaseService } from './development-phase.service';
import { CreateDevelopmentPhaseDto } from './dto/create-development-phase.dto';
import { UpdateDevelopmentPhaseDto } from './dto/update-development-phase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Development Phase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('development-phase')
export class DevelopmentPhaseController {
  constructor(private readonly service: DevelopmentPhaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear fase de desarrollo' })
  create(@Body() dto: CreateDevelopmentPhaseDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las fases de desarrollo' })
  findAll() {
    return this.service.findAll();
  }

  @Get('ova/:idOVA')
  @ApiOperation({ summary: 'Obtener fase de desarrollo de un OVA específico' })
  findByOva(@Param('idOVA') idOVA: string) {
    return this.service.findByOva(idOVA);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener fase de desarrollo por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar fase de desarrollo' })
  update(@Param('id') id: string, @Body() dto: UpdateDevelopmentPhaseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar fase de desarrollo' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
