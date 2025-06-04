import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { DepartmentService } from '../services/department.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { JwtAdminAuthGuard } from '@modules/admin/auth/guards/jwt-admin.guard';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin/departments')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly apiUtilsService: ApiUtilsService
  ) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      const data = await this.departmentService.create(createDepartmentDto);
      return this.apiUtilsService.make_response(data, 'Department created successfully');
    } catch (error) {
      if (error.message === 'DEPARTMENT_EXISTS') {
        return this.apiUtilsService.make_response(null, 'Department already exists');
      }
      // fallback for any other server error
      return this.apiUtilsService.make_response(null, 'Something went wrong');
    }
  }
  

  @Get()
  async findAll() {
    const data = await this.departmentService.findAll();
    return this.apiUtilsService.make_response(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.departmentService.findOne(id);
    return this.apiUtilsService.make_response(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    try{
      const data = await this.departmentService.update(id, updateDepartmentDto);
    return this.apiUtilsService.make_response(data, 'Department updated successfully');
  }
  catch (error) {
    if (error.message === 'DEPARTMENT_EXISTS') {
      return this.apiUtilsService.make_response(null, 'Department already exists');
    }
    // fallback for any other server error
    return this.apiUtilsService.make_response(null, 'Something went wrong');
  }}

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.departmentService.remove(id);
    return this.apiUtilsService.make_response(data, 'Department deleted successfully');
  }
}
