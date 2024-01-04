export interface ProductEntity {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
