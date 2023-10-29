import { UserModel } from '../../../data/models/user.model';
import { postgreSQLDatabase } from '../../../data/postgreSQL';
import { AuthDataSource } from '../../../domain/datasources/auth';
import { RegisterUserDTO } from '../../../domain/dtos/register';
import UserEntity from '../../../domain/entities/user';
import { CustomHTTPError } from '../../../domain/errors/custom';
import { EncryptAdapter } from '../../../utils/encrypt';
import { UserMapper } from '../../mappers/user.mapper';

type hashFunction = (password: string) => string;
type compareFunction = (password: string, hash: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {
  constructor(
    private hashPassword: hashFunction = EncryptAdapter.hash,
    private comparePassword: compareFunction = EncryptAdapter.compare,
  ) {}

  async login() {
    throw Error('not implemented');
  }

  async register(registerDTO: RegisterUserDTO): Promise<UserEntity | null> {
    try {
      const userRepository =
        postgreSQLDatabase.datasource.getRepository(UserModel);

      const findUser = await userRepository.findOneBy({
        email: registerDTO.email,
      });

      if (findUser != null)
        throw CustomHTTPError.badRequest('Cannot register user');

      const newUser = new UserModel();
      newUser.email = registerDTO.email;
      newUser.password = this.hashPassword(registerDTO.password);
      newUser.phone = parseInt(registerDTO.phone);
      newUser.active = false;

      const savedUser = await userRepository.save(newUser);
      const user = UserMapper.userEntityFromObject(savedUser);

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
    return null;
  }
}
