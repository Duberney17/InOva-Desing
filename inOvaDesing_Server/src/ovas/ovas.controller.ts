import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OvasService } from './ovas.service';
import { CreateOvaDto } from './dto/create-ova.dto';
import { UpdateOvaDto } from './dto/update-ova.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('OVAs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ovas')
export class OvasController {
  constructor(private readonly ovasService: OvasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo OVA (el estudiante crea su OVA)' })
  create(@Body() dto: CreateOvaDto) {
    return this.ovasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los OVAs' })
  findAll() {
    return this.ovasService.findAll();
  }

  /**
   * OVAs de un estudiante — usada en el dashboard del estudiante (CU-3, CU-9)
   */
  @Get('student/:idEstudiante')
  @ApiOperation({ summary: 'Listar OVAs de un estudiante específico' })
  findByStudent(@Param('idEstudiante') idEstudiante: string) {
    return this.ovasService.findByStudent(idEstudiante);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener OVA por ID' })
  findOne(@Param('id') id: string) {
    return this.ovasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar OVA' })
  update(@Param('id') id: string, @Body() dto: UpdateOvaDto) {
    return this.ovasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar OVA' })
  remove(@Param('id') id: string) {
    return this.ovasService.remove(id);
  }
}
