import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.categoryRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(`No existe la categoría con el id: ${id}`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.preload({
        id,
        ...updateCategoryDto,
      });
      if (!category)
        throw new NotFoundException(
          `No existe el producto con el id: ${id} para actualizarlo`,
        );
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return 'Categoría eliminada correctamente';
  }

  private handleErrors(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(
        'Ya existe un registro en la Base de Datos',
      );
  }
}
