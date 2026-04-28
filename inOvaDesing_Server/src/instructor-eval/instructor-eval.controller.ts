import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InstructorEvaluationService } from './instructor-eval.service';
import { CreateInstructorEvalDto } from './dto/create-instructor-eval.dto';
import { UpdateInstructorEvalDto } from './dto/update-instructor-eval.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Instructor Evaluation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('instructor-eval')
export class InstructorEvalController {
  constructor(private readonly service: InstructorEvaluationService) {}

  /**
   * El docente crea/envía retroalimentación sobre una fase de un OVA (CU-5)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('docente')
  @ApiOperation({ summary: 'Docente evalúa una fase ADDIE de un OVA' })
  create(@Body() dto: CreateInstructorEvalDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las evaluaciones' })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Todas las evaluaciones de un OVA (el estudiante ve retroalimentación de todas sus fases)
   */
  @Get('ova/:idOVA')
  @ApiOperation({ summary: 'Ver todas las evaluaciones de un OVA' })
  findByOva(@Param('idOVA') idOVA: string) {
    return this.service.findByOva(idOVA);
  }

  /**
   * Evaluación de una fase específica de un OVA
   */
  @Get('ova/:idOVA/fase/:fase')
  @ApiOperation({ summary: 'Ver evaluación de una fase específica de un OVA' })
  findByOvaAndFase(@Param('idOVA') idOVA: string, @Param('fase') fase: string) {
    return this.service.findByOvaAndFase(idOVA, fase);
  }

  /**
   * Evaluaciones hechas por un docente (dashboard docente)
   */
  @Get('docente/:idDocente')
  @UseGuards(RolesGuard)
  @Roles('docente')
  @ApiOperation({ summary: 'Ver todas las evaluaciones hechas por un docente' })
  findByDocente(@Param('idDocente') idDocente: string) {
    return this.service.findByDocente(idDocente);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evaluación por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('docente')
  @ApiOperation({ summary: 'Actualizar evaluación (el docente corrige su retroalimentación)' })
  update(@Param('id') id: string, @Body() dto: UpdateInstructorEvalDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('docente')
  @ApiOperation({ summary: 'Eliminar evaluación' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
