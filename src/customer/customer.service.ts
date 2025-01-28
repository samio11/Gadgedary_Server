import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './customer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly jwtService: JwtService, // JWT Service to sign tokens
  ) {}

  // Register a new customer
  async register(registerDto: RegisterDto): Promise<void> {
    const { name, email, password, image } = registerDto;

    // Check if email already exists
    const existingCustomer = await this.customerRepository.findOne({
      where: { email },
    });
    if (existingCustomer) {
      throw new BadRequestException('Email already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save customer
    const customer = this.customerRepository.create({
      name,
      email,
      password: hashedPassword,
      image,
    });
    await this.customerRepository.save(customer);
  }

  // Login customer and return token
  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    // Find customer by email
    const customer = await this.customerRepository.findOne({
      where: { email },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    // Generate and return JWT token
    const payload = { email: customer.email }; // Payload structure
    const token = this.jwtService.sign(payload);
    return token;
  }
}
