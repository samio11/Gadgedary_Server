import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Add product to cart
  async addProductToCart(cartData: any): Promise<Cart> {
    const product = await this.productRepository.findOneBy({
      id: cartData.product_id,
    });

    if (!product) throw new NotFoundException('Product not found');

    // Check if product already exists in cart for the given customer
    let cartItem = await this.cartRepository.findOne({
      where: {
        customer_email: cartData.customer_email,
        product_id: cartData.product_id,
      },
    });

    if (cartItem) {
      cartItem.quantity += cartData.quantity;
    } else {
      cartItem = this.cartRepository.create({
        customer_email: cartData.customer_email,
        product_id: cartData.product_id,
        name: cartData.name,
        category: cartData.category,
        brand: cartData.brand,
        price: cartData.price,
        rating: cartData.rating,
        product_image: cartData.product_image,
        warranty: cartData.warranty,
        product_added_date: cartData.product_added_date,
        offer_available: cartData.offer_available,
        quantity: cartData.quantity,
        payment_status: 'Pending',
      });
    }

    // Update product stock (decrease by quantity)
    if (product.stock < cartData.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    product.stock -= cartData.quantity;
    await this.productRepository.save(product);

    return await this.cartRepository.save(cartItem);
  }

  // Calculate total price for a customer
  async calculateTotalPrice(customerEmail: string): Promise<number> {
    const cartItems = await this.cartRepository.find({
      where: { customer_email: customerEmail },
    });

    let totalPrice = 0;
    for (let item of cartItems) {
      totalPrice += item.quantity * item.price;
    }

    return totalPrice;
  }

  // Get cart items for a specific customer
  async getCartItemsByCustomer(customerEmail: string): Promise<Cart[]> {
    const cartItems = await this.cartRepository.find({
      where: { customer_email: customerEmail },
    });

    if (!cartItems.length) {
      throw new NotFoundException(
        'No items found in the cart for this customer',
      );
    }

    return cartItems;
  }

  // Remove all items from cart for a specific customer
  async removeAllItemsFromCart(customerEmail: string): Promise<string> {
    const cartItems = await this.cartRepository.find({
      where: { customer_email: customerEmail },
    });

    if (!cartItems.length) {
      throw new NotFoundException('No items found in the cart');
    }

    // Update product stock when removing products from the cart
    for (const cartItem of cartItems) {
      const product = await this.productRepository.findOneBy({
        id: cartItem.product_id,
      });

      if (product) {
        product.stock += cartItem.quantity;
        await this.productRepository.save(product);
      }
    }

    await this.cartRepository.remove(cartItems);
    return 'All items removed from cart';
  }

  // Remove specific product from cart for a specific customer
  async removeProductFromCart(
    customerEmail: string,
    productId: number,
  ): Promise<string> {
    const cartItem = await this.cartRepository.findOne({
      where: { customer_email: customerEmail, product_id: productId },
    });

    if (!cartItem) throw new NotFoundException('Product not in cart');

    // Update product stock when removing a specific product
    const product = await this.productRepository.findOneBy({ id: productId });

    if (product) {
      product.stock += cartItem.quantity;
      await this.productRepository.save(product);
    }

    await this.cartRepository.remove(cartItem);
    return 'Product removed from cart';
  }
}
