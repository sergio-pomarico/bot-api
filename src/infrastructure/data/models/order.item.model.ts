import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from './base.model';
import ProductModel from './product.model';
import OrderModel from './order.model';

@Entity({ name: 'items' })
export default class OrderItemModel extends BaseModel {
  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  price: number;

  @ManyToOne(() => ProductModel)
  @JoinColumn({ name: 'product_id' })
  product: ProductModel;

  @ManyToOne(() => OrderModel, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: OrderModel;
}
