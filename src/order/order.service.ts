import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly logger: CommonService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = this.orderRepository.create(createOrderDto);
      return await this.orderRepository.save(order);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.orderRepository.find({
      skip: offset,
      take: limit,
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order)
      throw new NotFoundException(`Pedido con id: ${id} no fue encontrado`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.preload({
        id,
        ...updateOrderDto,
      });
      if (!order)
        throw new NotFoundException(
          `No existe el pedido con el id: ${id} para actualizarlo`,
        );
      return await this.orderRepository.save(order);
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return 'Pedido eliminado correctamente';
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al crear el pedido, revise la consola por favor.',
      );
    }
  }
}
