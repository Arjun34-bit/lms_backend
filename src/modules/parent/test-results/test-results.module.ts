import { Module } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TestResultController } from './testResult.controller';

@Module({
    imports: [PrismaModule],
    controllers: [TestResultController],
    providers: [TestResultsService],
})
export class TestResultsModule { }
