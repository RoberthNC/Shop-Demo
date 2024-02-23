import { Module } from '@nestjs/common';
import { OrderProductService } from './orderproduct.service';
import { OrderProductController } from './orderproduct.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [OrderProductController],
  providers: [OrderProductService],
  imports: [
    TypeOrmModule.forFeature([OrderProduct]),
    ProductModule,
    OrderModule,
    CommonModule,
  ],
})
export class OrderProductModule {}
