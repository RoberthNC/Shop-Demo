import { Module } from '@nestjs/common';
import { OrderProductService } from './orderproduct.service';
import { OrderProductController } from './orderproduct.controller';

@Module({
  controllers: [OrderProductController],
  providers: [OrderProductService],
})
export class OrderProductModule {}
