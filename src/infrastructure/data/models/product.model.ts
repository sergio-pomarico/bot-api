import { ProductEntity } from '@domain/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import CategoryModel from './category.model';
import BaseModel from './base.model';

@Entity({ name: 'product' })
export default class ProductModel extends BaseModel implements ProductEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @Column({ name: 'category_id' })
  categoryId?: string;

  @ManyToOne(() => CategoryModel, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryModel;
}
