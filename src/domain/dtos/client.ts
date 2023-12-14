import { ClientEntity } from '@domain/entities';
import { z } from 'zod';

const clientDTOValidator = z.object({
  phone: z.string().min(10),
  fullname: z.string(),
  address: z.string(),
  documentId: z.string(),
});

export default class ClientDTO {
  private constructor(
    public fullname: string,
    public phone: string,
    public address: string,
    public documentId: string,
  ) {}
  static create(data: { [key in keyof ClientEntity]: unknown }): [
    Error?,
    ClientDTO?,
  ] {
    const result = clientDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new ClientDTO(
        data.fullname as string,
        data.phone as string,
        data.address as string,
        data.documentId as string,
      ),
    ];
  }
}
