import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SeedCommand } from './seed.command';

@Module({
  imports: [PrismaModule],
  providers: [SeedCommand],
})
export class SeedModule {}