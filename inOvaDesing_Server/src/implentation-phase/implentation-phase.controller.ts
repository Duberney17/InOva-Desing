import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ImplementationPhaseService } from './implentation-phase.service';
import { CreateImplentationPhaseDto } from './dto/create-implentation-phase.dto';
import { UpdateImplentationPhaseDto } from './dto/update-implentation-phase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Implementation Phase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('implentation-phase')
export class ImplentationPhaseController {
  constructor(private readonly service: ImplementationPhaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear fase de implementación' })
  create(@Body() dto: CreateImplentationPhaseDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las fases de implementación' })
  findAll() {
    return this.service.findAll();
  }

  @Get('ova/:idOVA')
  @ApiOperation({ summary: 'Obtener fase de implementación de un OVA específico' })
  findByOva(@Param('idOVA') idOVA: string) {
    return this.service.findByOva(idOVA);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener fase de implementación por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar fase de implementación' })
  update(@Param('id') id: string, @Body() dto: UpdateImplentationPhaseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar fase de implementación' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
