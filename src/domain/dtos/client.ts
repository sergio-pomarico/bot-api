import { ClientEntity } from '@domain/entities';
import { z } from 'zod';

const clientDTOValidator = z.object({
  email: z.string().email(),
  fullname: z.string(),
  address: z.string(),
});

export default class ClientDTO {
  private constructor(
    public fullname: string,
    public phone: string,
    public address: string,
    public documentId: string,
  ) {}
  static create(data: { [key in keyof ClientEntity]: string }): [
    Error?,
    ClientDTO?,
  ] {
    const result = clientDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new ClientDTO(data.fullname, data.phone, data.address, data.documentId),
    ];
  }
}
