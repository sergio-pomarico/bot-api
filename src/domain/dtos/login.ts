import { z } from 'zod';

import { UserEntity } from '../entities';

const loginUserDTOValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default class LoginUserDTO {
  private constructor(public email: string, public password: string) {}

  static create(data: { [key in keyof UserEntity]: unknown }): [
    Error?,
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
