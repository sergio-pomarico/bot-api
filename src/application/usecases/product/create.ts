import ProductDTO from '@domain/dtos/product';
import { CategoryEntity } from '@domain/entities';
import { ProductRepository } from '@domain/repositories';

export interface CreateProductUseCase {
  run: (productDTO: ProductDTO) => Promise<CategoryEntity>;
}
export class CreateProduct implements CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}
  run = async (productDTO: ProductDTO): Promise<CategoryEntity> => {
    const product = await this.repository.create(productDTO!);
    return { ...product };
  };
}
