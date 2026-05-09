import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OvasModule } from './ovas/ovas.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dns from 'node:dns';
import { AnalysisPhaseModule } from './analysis-phase/analysis-phase.module';
import { DesignPhaseModule } from './design-phase/design-phase.module';
import { DevelopmentPhaseModule } from './development-phase/development-phase.module';
import { EvaluationPhaseModule } from './evaluation-phase/evaluation-phase.module';
import { FormModule } from './form/form.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { ResourceOvaModule } from './resource-ova/resource-ova.module';
import { InstructorEvalModule } from './instructor-eval/instructor-eval.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { ScormPackageModule } from './scorm-package/scorm-package.module';
import { ScormManifestModule } from './scorm-manifest/scorm-manifest.module';
import { ScormOrganizationModule } from './scorm-organization/scorm-organization.module';
import { ScoModule } from './sco/sco.module';
import { ScormResourceModule } from './scorm-resource/scorm-resource.module';
import { LomMetadataModule } from './lom-metadata/lom-metadata.module';
import { ImplentationPhaseModule } from './implentation-phase/implentation-phase.module';
import { OvaFilesModule } from './ova-files/ova-files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dnsServersRaw = config.get<string>('DNS_SERVERS');
        if (dnsServersRaw) {
          const dnsServers = dnsServersRaw
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);
          if (dnsServers.length > 0) {
            dns.setServers(dnsServers);
          }
        }

        return {
          uri: config.get<string>('MONGODB_URI'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    OvasModule,
    UsersModule,
    AnalysisPhaseModule,
    DesignPhaseModule,
    DevelopmentPhaseModule,
    EvaluationPhaseModule,
    FormModule,
    QuestionModule,
    AnswerModule,
    ResourceOvaModule,
    InstructorEvalModule,
    UserProgressModule,
    ScormPackageModule,
    ScormManifestModule,
    ScormOrganizationModule,
    ScoModule,
    ScormResourceModule,
    LomMetadataModule,
    ImplentationPhaseModule,
    OvaFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
