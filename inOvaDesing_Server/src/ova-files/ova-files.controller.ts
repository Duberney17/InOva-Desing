import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OvaFilesService } from './ova-files.service';
import { CreateOvaFileDto } from './dto/create-ova-file.dto';

@ApiTags('OVA Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ova-files')
export class OvaFilesController {
  constructor(private readonly service: OvaFilesService) {}

  /**
   * Sube UN archivo a un OVA.
   * Multipart: el archivo va como `file`, el resto del DTO como text fields.
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        idOVA: { type: 'string' },
        idEstudiante: { type: 'string' },
        idFase: {
          type: 'string',
          enum: [
            'analisis',
            'diseno',
            'desarrollo',
            'implementacion',
            'evaluacion',
          ],
        },
      },
      required: ['file', 'idOVA', 'idEstudiante'],
    },
  })
  @ApiOperation({ summary: 'Subir un archivo (PDF, imagen, doc) a un OVA' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateOvaFileDto,
  ) {
    return this.service.upload(file, dto);
  }

  @Get('ova/:idOVA')
  @ApiOperation({ summary: 'Listar archivos de un OVA' })
  findByOva(@Param('idOVA') idOVA: string) {
    return this.service.findByOva(idOVA);
  }

  @Get('ova/:idOVA/fase/:idFase')
  @ApiOperation({ summary: 'Listar archivos de una fase de un OVA' })
  findByOvaAndFase(
    @Param('idOVA') idOVA: string,
    @Param('idFase') idFase: string,
  ) {
    return this.service.findByOvaAndFase(idOVA, idFase);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un archivo (R2 + Mongo)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
