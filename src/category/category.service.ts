import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly logger: CommonService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  findAll(paginationDto: PaginationDto): Promise<Category[]> {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.categoryRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(`No existe la categoría con el id: ${id}`);
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
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

  async remove(id: string): Promise<string> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return 'Categoría eliminada correctamente';
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      this.logger.error(error.detail);
      throw new InternalServerErrorException(
        'Error al crear la categoría, revise la consola por favor.',
      );
    }
  }
}
