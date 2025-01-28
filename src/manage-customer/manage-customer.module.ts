import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/customer.entity';
import { ManageCustomerController } from './manage-customer.controller';
import { ManageCustomerService } from './manage-customer.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret: 'samio_123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ManageCustomerController],
  providers: [ManageCustomerService],
})
export class ManageCustomerModule {}
