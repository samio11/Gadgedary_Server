import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { UpdateCustomerDto } from './update-customer.dto';

@Injectable()
export class ManageCustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async viewAccount(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ email });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async updateAccount(
    email: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ email });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }
}
