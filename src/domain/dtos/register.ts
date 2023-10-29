import { z } from 'zod';

import UserEntity from '../entities/user';

const registerUserDTOValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(10),
});

export class RegisterUserDTO {
  private constructor(
    public email: string,
    public password: string,
    public phone: string,
  ) {}

  static create(data: { [key in keyof UserEntity]: unknown }): [
    Error?,
    RegisterUserDTO?,
  ] {
    const result = registerUserDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new RegisterUserDTO(
        data.email as string,
        data.password as string,
        data.phone as string,
      ),
    ];
  }
}
