import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OvaFile, OvaFileSchema } from './schemas/ova-file.schema';
import { OvaFilesService } from './ova-files.service';
import { OvaFilesController } from './ova-files.controller';
import { R2Service } from './r2.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: OvaFile.name, schema: OvaFileSchema }]),
  ],
  controllers: [OvaFilesController],
  providers: [OvaFilesService, R2Service],
  exports: [OvaFilesService],
})
export class OvaFilesModule {}
