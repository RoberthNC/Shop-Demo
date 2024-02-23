import { User } from 'src/auth/entities/user.entity';
import { OrderProduct } from 'src/orderproduct/entities/order-product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: string;

  @ManyToOne(() => User, (user) => user.order)
  user: string;

  @OneToMany(() => OrderProduct, (orderproduct) => orderproduct.order)
  orderproduct: string;
}
