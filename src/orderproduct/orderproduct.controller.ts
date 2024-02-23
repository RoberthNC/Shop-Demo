import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderProductService } from './orderproduct.service';
import { CreateOrderProductDto, UpdateOrderProductDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('orderproduct')
export class OrderProductController {
  constructor(private readonly orderproductService: OrderProductService) {}

  @Post()
  create(@Body() createOrderproductDto: CreateOrderProductDto) {
    return this.orderproductService.create(createOrderproductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.orderproductService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderproductService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderproductDto: UpdateOrderProductDto,
  ) {
    return this.orderproductService.update(id, updateOrderproductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderproductService.remove(id);
  }
}
