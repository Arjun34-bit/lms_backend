import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { categorySeedData } from './data/category.seed';

@Injectable()
export class CategorySeederService {
  private readonly logger = new Logger(CategorySeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async categorySeed() {
    // Fetch existing categories from the database
    const existingCategories = await this.prisma.category.findMany({
      select: { name: true },
    });

    // Extract existing category names
    const existingCategoryNames = existingCategories.map(
      (category) => category.name,
    );

    // Filter out categories that already exist
    const categoriesToInsert = categorySeedData.filter(
      (category) => !existingCategoryNames.includes(category.name),
    );

    // Insert new categories
    if (categoriesToInsert.length > 0) {
      await this.prisma.category.createMany({
        data: categoriesToInsert,
      });
      this.logger.log('Category seed data inserted');
    }
  }
}
