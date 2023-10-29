import { ZodError, z } from 'zod';

import UserEntity from '../entities/user';

const loginUserDTOValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export class LoginUserDTO {
  private constructor(public email: string, public password: string) {}

  static create(data: { [key in keyof UserEntity]: unknown }): [
    ZodError?,
    LoginUserDTO?,
  ] {
    const result = loginUserDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new LoginUserDTO(data.email as string, data.password as string),
    ];
  }
}
