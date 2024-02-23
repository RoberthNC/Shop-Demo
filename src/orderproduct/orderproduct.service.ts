import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderProductDto, UpdateOrderProductDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    private readonly logger: CommonService,
  ) {}

  async create(
    createOrderproductDto: CreateOrderProductDto,
  ): Promise<OrderProduct> {
    try {
      const orderProduct = this.orderProductRepository.create(
        createOrderproductDto,
      );
      return await this.orderProductRepository.save(orderProduct);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<OrderProduct[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.orderProductRepository.find({
      skip: offset,
      take: limit,
      relations: ['order', 'product'],
    });
  }

  async findOne(id: string): Promise<OrderProduct> {
    const orderProduct = await this.orderProductRepository.findOneBy({ id });
    if (!orderProduct)
      throw new NotFoundException(
        `No existe la orden-producto con el id: ${id}`,
      );
    return orderProduct;
  }

  async update(id: string, updateOrderproductDto: UpdateOrderProductDto) {
    try {
      const orderProduct = await this.orderProductRepository.preload({
        id,
        ...updateOrderproductDto,
      });
      if (!orderProduct)
        throw new BadRequestException(
          `La orden-producto con el id: ${id} no se puede actualizar`,
        );
      return await this.orderProductRepository.save(orderProduct);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    const orderProduct = await this.findOne(id);
    await this.orderProductRepository.remove(orderProduct);
    return 'La orden-producto ha sido eliminado exitosamente';
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      this.logger.error(error.detail);
      throw new InternalServerErrorException(
        'Error al crear la orden-producto, revise la consola por favor.',
      );
    }
  }
}
