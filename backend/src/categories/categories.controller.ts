import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('api/admin/menu/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.categoriesService.findAll({ status, sortBy });
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateDto);
  }
}
