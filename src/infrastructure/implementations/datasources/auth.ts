import { UserModel } from '../../../data/models/user.model';
import { postgreSQLDatabase } from '../../../data/postgreSQL';
import { AuthDataSource } from '../../../domain/datasources/auth';
import { RegisterUserDTO } from '../../../domain/dtos/register';
import UserEntity from '../../../domain/entities/user';

export class AuthDataSourceImpl implements AuthDataSource {
  async login() {
    throw Error('not implemented');
  }
  async register(registerDTO: RegisterUserDTO): Promise<UserEntity | null> {
    try {
      const userRepository =
        postgreSQLDatabase.datasource.getRepository(UserModel);

      const newUser = new UserModel();
      newUser.email = registerDTO.email;
      newUser.password = registerDTO.password;
      newUser.phone = parseInt(registerDTO.phone);
      newUser.active = false;
      const savedUser = await userRepository.save(newUser);
      console.log('user exist', newUser, savedUser);
      const user: UserEntity = {
        id: '2',
        email: registerDTO.email,
        password: registerDTO.password,
        phone: parseInt(registerDTO.phone),
      };
      return user;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }
}
