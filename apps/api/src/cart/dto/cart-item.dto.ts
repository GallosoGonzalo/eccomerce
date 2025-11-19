import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}
