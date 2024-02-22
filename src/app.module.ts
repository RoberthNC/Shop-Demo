import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { OrderProductModule } from './orderproduct/orderproduct.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //* Configuración de variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get('DB_NAME'),
        host: configService.get('DB_HOST'),
        password: configService.get('DB_PASSWORD'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CategoryModule,
    CommonModule,
    ProductModule,
    AuthModule,
    OrderModule,
    OrderProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
