import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiUtilsService } from '@utils/utils.service';

@Controller('admin/assignments')
export class AssignmentController {
  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly apiUtilsService: ApiUtilsService
  ) {}

  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto) {
    const data = await this.assignmentService.create(createAssignmentDto);
    return this.apiUtilsService.make_response(data, 'Assignment created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.assignmentService.findAll();
    return this.apiUtilsService.make_response(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.assignmentService.findOne(id);
    return this.apiUtilsService.make_response(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    const data = await this.assignmentService.update(id, updateAssignmentDto);
    return this.apiUtilsService.make_response(data, 'Assignment updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.assignmentService.remove(id);
    return this.apiUtilsService.make_response(data, 'Assignment deleted successfully');
  }
}
