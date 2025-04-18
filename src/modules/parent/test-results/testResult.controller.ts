import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { JwtParentAuthGuard } from '../auth/guards/jwt-parent.guard';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('parent/test-results')
@UseGuards(JwtParentAuthGuard)
export class TestResultController {
    constructor(private readonly testResultsService: TestResultsService) { }

    @Get(':studentId')
    getResults(
        @GetUser('id') parentId: string,
        @Param('studentId') studentId: string
    ) {
        return this.testResultsService.getResults(parentId, studentId);
    }

    @Get(':studentId/progress')
    getProgress(
        @GetUser('id') parentId: string,
        @Param('studentId') studentId: string
    ) {
        return this.testResultsService.getProgress(parentId, studentId);
    }
}
