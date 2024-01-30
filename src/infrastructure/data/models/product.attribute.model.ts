import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { ProductAttributeEntity, Size } from '@domain/entities';

import BaseModel from './base.model';
import ProductModel from './product.model';

@Entity({ name: 'attribute' })
export default class ProductAttributeModel
  extends BaseModel
  implements ProductAttributeEntity
{
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: Size,
  })
  size: Size;

  @Column({ name: 'product_id' })
  productId: string;

  @OneToMany(() => ProductModel, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: ProductModel[];
}
