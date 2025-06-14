import { Module } from '@nestjs/common';
import { SubjectController } from './controllers/subject.controller';
import { SubjectService } from './services/subject.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SubjectController],
    providers: [SubjectService],
})
export class SubjectModule {}