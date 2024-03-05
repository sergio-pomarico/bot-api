import { ProductEntity } from '@domain/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseModel from './base.model';
import AttributeModel from './attribute.model';
import CategoryModel from './category.model';

@Entity({ name: 'product' })
export default class ProductModel extends BaseModel implements ProductEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  price?: number;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => CategoryModel, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryModel;

  @OneToMany(() => AttributeModel, (attribute) => attribute.product, {
    nullable: true,
  })
  attributes: AttributeModel[];
}
