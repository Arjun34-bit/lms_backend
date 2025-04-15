import { Module } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [TestResultsService],
})
export class TestResultsModule { }
