import { ProductEntity } from '@domain/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CategoryModel } from './category.model';
import { BaseModel } from './base.model';

@Entity({ name: 'product' })
export class ProductModel extends BaseModel implements ProductEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  price: number;

  @ManyToOne(() => CategoryModel, (category) => category.id)
  category: CategoryModel['id'];
}
