import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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
  price: number;

  @Column({
    type: 'enum',
    enum: Size,
    nullable: true,
  })
  size?: Size;

  @ManyToOne(() => ProductModel, (product) => product.attributes)
  @JoinColumn({ name: 'product_id' })
  product: ProductModel;
}
