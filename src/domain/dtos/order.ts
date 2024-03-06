import { OrderType, PaymentMethod } from '@domain/entities';
import { z } from 'zod';

const OrderDTOValidator = z.object({
  clientId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  type: z.nativeEnum(OrderType),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export type OrderValidator = z.infer<typeof OrderDTOValidator>;

export default class OrderDTO {
  private constructor(
    public clientId: string,
    public restaurantId: string,
    public type: OrderType,
    public paymentMethod: PaymentMethod,
  ) {}
  static create(data: { [key in keyof OrderValidator]: unknown }): [
    Error?,
    OrderDTO?,
  ] {
    const result = OrderDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new OrderDTO(
        data.clientId as string,
        data.restaurantId as string,
        data.type as OrderType,
        data.paymentMethod as PaymentMethod,
      ),
    ];
  }
}
