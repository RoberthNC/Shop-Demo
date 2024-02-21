import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.productRepository.find({
      skip: offset,
      take: limit,
      relations: ['category'], //* Trae la relación con la tabla de categorías
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`No existe el producto con el id: ${id}`);
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
      });
      if (!product)
        throw new BadRequestException(
          `El producto con el id: ${id} no se puede actualizar`,
        );
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: string): Promise<string> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return 'El producto ha sido eliminado exitosamente';
  }

  private handleErrors(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(
        'Ya existe un producto igual en la Base de Datos',
      );
  }
}
