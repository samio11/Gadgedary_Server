import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module'; // Import CustomerModule
import { JwtStrategy } from './jwt.strategy'; // JWT Strategy for validation

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Secret for signing the JWT token
      signOptions: { expiresIn: '1h' }, // Expiry time of the JWT token
    }),
    CustomerModule, // To access CustomerService (you can use this if needed)
  ],
  providers: [JwtStrategy], // Strategy to validate JWT token
  exports: [JwtModule], // Export JwtModule for use in other modules
})
export class AuthModule {}
