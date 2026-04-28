import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OvasService } from './ovas.service';
import { OvasController } from './ovas.controller';
import { Ova, OvaSchema } from './schemas/ova.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ova.name, schema: OvaSchema }])],
  controllers: [OvasController],
  providers: [OvasService],
  exports: [OvasService],
})
export class OvasModule {}
