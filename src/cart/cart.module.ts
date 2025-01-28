import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Product } from '../products/product.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product]),
    JwtModule.register({
      secret: 'samio_123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
