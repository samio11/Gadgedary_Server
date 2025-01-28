import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard'; // Import the AuthGuard

@Controller('cart')
// @UseGuards(AuthGuard) // Apply the AuthGuard to all routes in this controller
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() cartData: any) {
    return await this.cartService.addProductToCart(cartData);
  }

  @Get('total-price/:customer_email')
  async calculateTotalPrice(@Param('customer_email') customerEmail: string) {
    return await this.cartService.calculateTotalPrice(customerEmail);
  }

  @Get('items/:customer_email')
  async getCartItemsByCustomer(@Param('customer_email') customerEmail: string) {
    return await this.cartService.getCartItemsByCustomer(customerEmail);
  }

  @Delete('remove/:customer_email')
  async removeAllItemsFromCart(@Param('customer_email') customerEmail: string) {
    return await this.cartService.removeAllItemsFromCart(customerEmail);
  }

  @Delete('remove/:customer_email/:product_id')
  async removeProductFromCart(
    @Param('customer_email') customerEmail: string,
    @Param('product_id') productId: number,
  ) {
    return await this.cartService.removeProductFromCart(
      customerEmail,
      productId,
    );
  }
}
