import { ProductEntity } from '@domain/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from './base.model';
import AttributeModel from './product.attribute.model';
import CategoryModel from './category.model';

@Entity({ name: 'product' })
export default class ProductModel extends BaseModel implements ProductEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  price?: number;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'attribute_id', nullable: true })
  attributeId?: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => CategoryModel, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryModel;

  @ManyToOne(() => AttributeModel, (attribute) => attribute.productId)
  @JoinColumn({ name: 'attribute_id' })
  attribute: CategoryModel;
}
