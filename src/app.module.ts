import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApiUtilsModule } from '@utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '@utils/functions';
import { BullModule } from '@nestjs/bull';
import { envConstant } from './constants';
import { InstructorModule } from '@modules/instructor/instructor.module';
import { StudentModule } from '@modules/student/student.module';
import { DepartmentSeederService } from './seeders/department.seeder';
import { SubjectSeederService } from './seeders/subject.seeder';
import { CategorySeederService } from './seeders/category.seeder';
import { LanguageSeederService } from './seeders/language.seeder';
import { CommonModule } from '@modules/common/common.module';
import { EmailModule } from '@modules/common/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    ApiUtilsModule,
    CommonModule,
    EmailModule,
    CacheModule.registerAsync(RedisOptions),
    BullModule.forRoot({
      redis: {
        host: envConstant.REDIS_HOST,
        port: envConstant.PORT,
        db: envConstant.REDIS_DB,
      },
    }),
    InstructorModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    DepartmentSeederService,
    SubjectSeederService,
    CategorySeederService,
    LanguageSeederService,
  ],
  exports: [PrismaService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly departmentSeederService: DepartmentSeederService,
    private readonly subjectSeederService: SubjectSeederService,
    private readonly categorySeederService: CategorySeederService,
    private readonly languageSeederService: LanguageSeederService,
  ) {}

  async onModuleInit() {
    await this.departmentSeederService.departmentSeed();
    await this.subjectSeederService.subjectSeed();
    await this.categorySeederService.categorySeed();
    await this.languageSeederService.languageSeed();
  }
}
