import { z } from 'zod';

import { ProductEntity } from '../entities';

const productDTOValidator = z.object({
  name: z.string().min(3),
  price: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().optional(),
});

export default class ProductDTO {
  private constructor(
    public name: string,
    public price: number,
    public description?: string,
    public categoryId?: string,
  ) {}

  static create(data: { [key in keyof ProductEntity]: string }): [
    Error?,
    ProductDTO?,
  ] {
    const result = productDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new ProductDTO(
        data.name,
        Number(data.price),
        data.description,
        data.categoryId,
      ),
    ];
  }
}
