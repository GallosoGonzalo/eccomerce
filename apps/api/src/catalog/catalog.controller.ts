import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpsertProductDto } from './dto/product.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  categories() {
    return this.catalogService.listCategories();
  }

  @Get('products')
  products(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.catalogService.listProducts({
      search,
      category,
      sort,
      order,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined
    });
  }

  @Get('products/:id')
  product(@Param('id') id: string) {
    return this.catalogService.getProduct(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('products')
  create(@Body() dto: UpsertProductDto) {
    return this.catalogService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('products/:id')
  update(@Param('id') id: string, @Body() dto: UpsertProductDto) {
    return this.catalogService.updateProduct(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('products/:id')
  remove(@Param('id') id: string) {
    return this.catalogService.deleteProduct(id);
  }
}
