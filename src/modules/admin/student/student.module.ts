import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminStudentController } from './controllers/student.controller';
import { AdminStudentService } from './services/student.service';

@Module({
    imports: [PrismaModule],
    controllers: [AdminStudentController],
    providers: [AdminStudentService],
})
export class AdminStudentModule { }
