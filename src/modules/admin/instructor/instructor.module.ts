import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminInstructorController } from './controllers/instructor.controller';
import { AdminInstructorService } from './services/instructor.service';

@Module({
    imports: [PrismaModule],
    controllers: [AdminInstructorController],
    providers: [AdminInstructorService],
})
export class AdminInstructorModule { }
