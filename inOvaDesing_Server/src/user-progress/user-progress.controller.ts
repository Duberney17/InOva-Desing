import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserProgressService } from './user-progress.service';
import { CreateUserProgressDto } from './dto/create-user-progress.dto';
import { UpdateUserProgressDto } from './dto/update-user-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly service: UserProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de progreso para un OVA' })
  create(@Body() dto: CreateUserProgressDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los progresos' })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Progreso de un estudiante en un OVA (CU-8 — indicador visual de fases)
   */
  @Get('ova/:idOVA/student/:idEstudiante')
  @ApiOperation({ summary: 'Ver progreso de un estudiante en un OVA específico' })
  findByOvaAndStudent(
    @Param('idOVA') idOVA: string,
    @Param('idEstudiante') idEstudiante: string,
  ) {
    return this.service.findByOvaAndStudent(idOVA, idEstudiante);
  }

  /**
   * Marcar una fase como completada / guardar avance (CU-7)
   * Body: { fase: 'analisis' | 'diseno' | 'desarrollo' | 'implementacion' | 'evaluacion' }
   */
  @Patch('ova/:idOVA/student/:idEstudiante/completar')
  @ApiOperation({ summary: 'Marcar una fase como completada (guardar avance)' })
  completarFase(
    @Param('idOVA') idOVA: string,
    @Param('idEstudiante') idEstudiante: string,
    @Body('fase') fase: string,
  ) {
    return this.service.completarFase(idOVA, idEstudiante, fase);
  }

  /**
   * Reiniciar progreso desde cero (CU-10)
   */
  @Patch('ova/:idOVA/student/:idEstudiante/reset')
  @ApiOperation({ summary: 'Reiniciar progreso del OVA desde cero (CU-10)' })
  resetProgress(
    @Param('idOVA') idOVA: string,
    @Param('idEstudiante') idEstudiante: string,
  ) {
    return this.service.resetProgress(idOVA, idEstudiante);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener progreso por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar progreso' })
  update(@Param('id') id: string, @Body() dto: UpdateUserProgressDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro de progreso' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
