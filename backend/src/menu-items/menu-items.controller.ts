import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemsDto } from './dto/query-items.dto';

@Controller('api/admin/menu/items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  /**
   * POST /api/admin/menu/items
   * Create a new menu item
   */
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createDto: CreateItemDto,
  ) {
    return this.menuItemsService.create(createDto);
  }

  /**
   * GET /api/admin/menu/items
   * Get all menu items with filtering, sorting, and pagination
   */
  @Get()
  async findAll(
    @Query('restaurant_id') restaurantId: string,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryItemsDto,
  ) {
    // Default restaurant ID for testing
    const effectiveRestaurantId =
      restaurantId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    return this.menuItemsService.findAll(effectiveRestaurantId, query);
  }

  /**
   * GET /api/admin/menu/items/:id
   * Get a single menu item by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(id);
  }

  /**
   * PUT /api/admin/menu/items/:id
   * Update a menu item
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateDto: UpdateItemDto,
  ) {
    return this.menuItemsService.update(id, updateDto);
  }

  /**
   * PATCH /api/admin/menu/items/:id/status
   * Update item status
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.menuItemsService.updateStatus(id, status);
  }

  /**
   * DELETE /api/admin/menu/items/:id
   * Soft delete a menu item
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.menuItemsService.remove(id);
  }
}
