import { AuthDataSource } from '@domain/datasources/auth';
import { RegisterUserDTO } from '@domain/dtos';
import UserEntity from '@domain/entities/user';
import { AuthRepository } from '@domain/repositories/auth';

export class AuthDataRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthDataSource) {}
  login = async () => {
    throw Error('not implemented');
  };
  register = async (
    registerDTO: RegisterUserDTO,
  ): Promise<UserEntity | null> => {
    return this.dataSource.register(registerDTO);
  };
}
