import { z } from 'zod';

import { ProductCategoryEntity } from '../entities';

const categoryDTOValidator = z.object({
  title: z.string().min(3),
});

export default class ProductCategoryDTO {
  private constructor(public title: string) {}

  static create(data: { [key in keyof ProductCategoryEntity]: string }): [
    Error?,
    ProductCategoryDTO?,
  ] {
    const result = categoryDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [undefined, new ProductCategoryDTO(data.title!)];
  }
}
