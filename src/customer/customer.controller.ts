import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomerService } from './customer.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Register a new customer
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    await this.customerService.register(registerDto);
    return { message: 'Registration successful' };
  }

  // Login customer and set JWT in cookies
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const token = await this.customerService.login(loginDto);

    res.cookie('token', token, {
      // Change 'token' to 'jwt' to match AuthGuard
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    return res.json({ message: 'Login successful' });
  }

  // Logout customer by clearing the token cookie
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response): Promise<Response> {
    res.clearCookie('token'); // Clear the JWT token cookie
    return res.json({ message: 'Logged out successfully' });
  }
}
