import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ManageCustomerService } from './manage-customer.service';
import { UpdateCustomerDto } from './update-customer.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('manage-customer')
// @UseGuards(AuthGuard) // Apply auth guard
export class ManageCustomerController {
  constructor(private readonly manageCustomerService: ManageCustomerService) {}

  @Get(':email')
  viewAccount(@Param('email') email: string) {
    return this.manageCustomerService.viewAccount(email);
  }

  @Put(':email')
  updateAccount(
    @Param('email') email: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.manageCustomerService.updateAccount(email, updateCustomerDto);
  }
}
