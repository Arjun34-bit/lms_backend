import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { categorySeedData } from './data/category.seed';
import { languageSeedData } from './data/language.seed';

@Injectable()
export class LanguageSeederService {
  private readonly logger = new Logger(LanguageSeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async languageSeed() {
    // Fetch existing languages from the database
    const existingLanguages = await this.prisma.language.findMany({
      select: { name: true },
    });

    // Extract existing language names
    const existingLanguageNames = existingLanguages.map(
      (language) => language.name,
    );

    // Filter out languages that already exist
    const languagesToInsert = languageSeedData.filter(
      (language) => !existingLanguageNames.includes(language.name),
    );

    // Insert new languages
    if (languagesToInsert.length > 0) {
      await this.prisma.language.createMany({
        data: languagesToInsert,
      });
      this.logger.log('Language seed data inserted');
    }
  }
}
