import { Category } from 'src/category/entities/category.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  name_product: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ManyToOne(
    () => Category, //* Tabla independiente por la cual es apuntada
    (category) => category.product, //* Atributo de la tabla independiente que la vincula
    { eager: true }, //* Trae las relaciones con las otras tablas para optimizar la consulta de la BD
  )
  category: string;

  @BeforeInsert()
  checkBeforeInsertProduct() {
    if (!this.slug) {
      this.slug = this.name_product.toLowerCase().replaceAll(' ', '-');
    } else {
      this.slug = this.slug.toLowerCase().replaceAll(' ', '-');
    }
  }

  @BeforeUpdate()
  checkBeforeUpdateProduct() {
    if (!this.slug) {
      this.slug = this.name_product.toLowerCase().replaceAll(' ', '-');
    } else {
      this.slug = this.slug.toLowerCase().replaceAll(' ', '-');
    }
  }
}
