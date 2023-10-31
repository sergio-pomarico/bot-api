import { LoginUserDTO } from '@domain/dtos';
import { CustomHTTPError } from '@domain/errors/custom';
import { AuthRepository } from '@domain/repositories/auth';
import { JWTAdapter } from '@shared/utils';

interface LoginUserResponse {
  token: string;
  userId?: string;
  lastLogin?: string;
}

type signToken = (payload: object, duration?: string) => Promise<string | null>;

export interface LoginUserUseCase {
  run: (loginDTO: LoginUserDTO) => Promise<LoginUserResponse>;
}

export class LoginUser {
  constructor(
    private readonly repository: AuthRepository,
    private readonly signToken: signToken = JWTAdapter.generateToken,
  ) {}

  async run(loginDTO: LoginUserDTO): Promise<LoginUserResponse> {
    const user = await this.repository.login(loginDTO!);
    const token = await this.signToken({ id: user?.id });
    if (!token)
      throw CustomHTTPError.internalServer('Token could not be generated');
    return {
      token: token,
      userId: user?.id,
      lastLogin: user?.lastLogin?.toISOString(),
    };
  }
}
