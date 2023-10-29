import { AuthDataSource } from '@domain/datasources/auth';
import { LoginUserDTO, RegisterUserDTO } from '@domain/dtos';
import UserEntity from '@domain/entities/user';
import { AuthRepository } from '@domain/repositories/auth';

export class AuthDataRepositoryImpl implements AuthRepository {
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
