import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { ApiUtilsService } from '@utils/utils.service';

@Controller('admin/tests')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly apiUtilsService: ApiUtilsService
  ) {}

  @Post()
  async create(@Body() createTestDto: CreateTestDto) {
    const data = await this.testService.create(createTestDto);
    return this.apiUtilsService.make_response(data, 'Test created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.testService.findAll();
    return this.apiUtilsService.make_response(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.testService.findOne(id);
    return this.apiUtilsService.make_response(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    const data = await this.testService.update(id, updateTestDto);
    return this.apiUtilsService.make_response(data, 'Test updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.testService.remove(id);
    return this.apiUtilsService.make_response(data, 'Test deleted successfully');
  }
}
