import { Injectable } from '@nestjs/common';
import { CreateOrderProductDto, UpdateOrderProductDto } from './dto';

@Injectable()
export class OrderProductService {
  create(createOrderproductDto: CreateOrderProductDto) {
    return 'This action adds a new orderproduct';
  }

  findAll() {
    return `This action returns all orderproduct`;
  }

  findOne(id: string) {
    return `This action returns a #${id} orderproduct`;
  }

  update(id: string, updateOrderproductDto: UpdateOrderProductDto) {
    return `This action updates a #${id} orderproduct`;
  }

  remove(id: string) {
    return `This action removes a #${id} orderproduct`;
  }
}
