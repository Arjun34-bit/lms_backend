import { Module } from '@nestjs/common';
import { AdminSupportController } from './controllers/support.controller';
import { AdminSupportService } from './services/support.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminSupportController],
    providers: [AdminSupportService],
    exports: [AdminSupportService]
})
export class AdminSupportModule {}