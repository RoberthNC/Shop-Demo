import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'text',
    unique: true,
  })
  name_category: string;

  @OneToMany(
    () => Product, //* Tabla dependiente a la que apunta
    (product) => product.category, //* Atributo de la tabla dependiente que vincula ambas tablas
  )
  product: Product;
}
