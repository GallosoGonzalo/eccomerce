import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  get(@CurrentUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  add(@CurrentUser() user: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.id, dto);
  }

  @Patch('items/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(id, dto.quantity);
  }

  @Delete('items/:id')
  remove(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  clear(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.id);
  }
}
