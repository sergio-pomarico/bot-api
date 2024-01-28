import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

import BaseModel from './base.model';
import ProductModel from './product.model';

enum Size {
  Small = 'small',
  Personal = 'personal',
  Medium = 'medium',
  large = 'large',
}

@Entity({ name: 'attribute' })
export default class AttributeModel extends BaseModel {
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
