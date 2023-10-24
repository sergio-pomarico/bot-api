import { AuthDataSource } from '../../../domain/datasources/auth';
import { RegisterUserDTO } from '../../../domain/dtos/register';
import UserEntity from '../../../domain/entities/user';

export class AuthDataSourceImpl implements AuthDataSource {
  async login() {
    throw Error('not implemented');
  }
  async register(registerDTO: RegisterUserDTO): Promise<UserEntity | null> {
    try {
      const user: UserEntity = {
        id: '2',
        email: registerDTO.email,
        password: registerDTO.password,
        phone: parseInt(registerDTO.phone),
      };
      return user;
    } catch (error) {
      console.log('error');
      return null;
    }
  }
}
