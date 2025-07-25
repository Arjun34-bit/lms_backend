import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from '@modules/common/email/email.module';

@Module({
    imports: [PrismaModule],
    controllers: [CoursesController],
    providers: [CoursesService],
})
export class CoursesModule { }
