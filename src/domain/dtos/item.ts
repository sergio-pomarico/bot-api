import { z } from 'zod';

const OrderItemDTOValidator = z.object({
  productId: z.string().uuid(),
  attributeId: z.string().uuid().optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  orderId: z.string().uuid(),
});

export type OrderItemValidator = z.infer<typeof OrderItemDTOValidator>;

export default class OrderItemDTO {
  private constructor(
    public productId: string,
    public quantity: number,
    public price: number,
    public orderId: string,
    public attributeId?: string,
  ) {}
  static create(data: { [key in keyof OrderItemValidator]: unknown }): [
    Error?,
    OrderItemDTO?,
  ] {
    const result = OrderItemDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new OrderItemDTO(
        data.productId as string,
        data.quantity as number,
        data.price as number,
        data.orderId as string,
        data.attributeId as string,
      ),
    ];
  }
}
