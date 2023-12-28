import { AuthDataSource } from '@domain/datasources';
import { LoginUserDTO, RegisterUserDTO } from '@domain/dtos';
import { UserEntity } from '@domain/entities';
import { AuthRepository } from '@domain/repositories/auth';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthDataSource) {}
  login = async (loginDTO: LoginUserDTO): Promise<UserEntity | null> => {
    return this.dataSource.login(loginDTO);
  };
  register = async (
    registerDTO: RegisterUserDTO,
  ): Promise<UserEntity | null> => {
    return this.dataSource.register(registerDTO);
  };
}
