export interface ProductEntity {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
