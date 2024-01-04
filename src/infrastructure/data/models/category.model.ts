import { CategoryEntity } from '@domain/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductModel } from './product.model';
import { BaseModel } from './base.model';

@Entity({ name: 'category' })
export class CategoryModel extends BaseModel implements CategoryEntity {
  @Column()
  title: string;

  @OneToMany(() => ProductModel, (product) => product.category)
  products: ProductModel[];
}
