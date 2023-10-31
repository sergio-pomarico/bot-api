import { RegisterUserDTO } from '@domain/dtos';
import { AuthRepository } from '@domain/repositories/auth';
import { JWTAdapter } from '@shared/utils';
import { CustomHTTPError } from '@domain/errors/custom';

interface CreateUserResponse {
  token: string;
  userId?: string;
}

type signToken = (payload: object, duration?: string) => Promise<string | null>;

export interface CreateUserUseCase {
  run: (registerDTO: RegisterUserDTO) => Promise<CreateUserResponse>;
}

export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly signToken: signToken = JWTAdapter.generateToken,
  ) {}
  run = async (registerDTO: RegisterUserDTO): Promise<CreateUserResponse> => {
    const user = await this.repository.register(registerDTO!);
    const token = await this.signToken({ id: user?.id });
    if (!token)
      throw CustomHTTPError.internalServer('Token could not be generated');
    return {
      token: token,
      userId: user?.id,
    };
  };
}
