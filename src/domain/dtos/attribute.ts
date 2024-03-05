import { z } from 'zod';

import { ProductAttributeEntity, Size } from '../entities';

const attributeDTOValidator = z.object({
  title: z.string().min(3),
  description: z.string().min(3).optional(),
  price: z.number().min(0),
  productId: z.string().min(3),
  size: z.nativeEnum(Size).optional(),
});

export default class ProductAttributeDTO {
  private constructor(
    public title: string,
    public price: number,
    public productId: string,
    public size: Size,
    public description?: string,
  ) {}

  static create(data: { [key in keyof ProductAttributeEntity]: unknown }): [
    Error?,
    ProductAttributeDTO?,
  ] {
    const result = attributeDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new ProductAttributeDTO(
        (data.title as string)!,
        (data.price as number)!,
        (data.product as string)!,
        (data.size as Size)!,
        data.description as string,
      ),
    ];
  }
}
