import { UserModel } from '../../../data/models/user.model';
import { postgreSQLDatabase } from '../../../data/postgreSQL';
import { AuthDataSource } from '@domain/datasources/auth';
import { LoginUserDTO, RegisterUserDTO } from '@domain/dtos';
import UserEntity from '@domain/entities/user';
import { CustomHTTPError } from '@domain/errors/custom';
import { EncryptAdapter } from '../../../utils';
import { UserMapper } from '../../mappers/user.mapper';

type hashFunction = (password: string) => string;
type compareFunction = (password: string, hash: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {
  constructor(
    private hashPassword: hashFunction = EncryptAdapter.hash,
    private comparePassword: compareFunction = EncryptAdapter.compare,
  ) {}

  async login(loginDTO: LoginUserDTO): Promise<UserEntity | null> {
    try {
      const userRepository =
        postgreSQLDatabase.datasource.getRepository(UserModel);
      const findUser = await userRepository.findOneBy({
        email: loginDTO.email,
      });
      if (findUser == null) throw CustomHTTPError.notFound("Can't find user");
      const validatedPassword = this.comparePassword(
        loginDTO.password,
        findUser.password,
      );
      if (!validatedPassword)
        throw CustomHTTPError.unauthorize('incorrect credentials');

      let loginUser = new UserModel();
      loginUser = findUser;
      loginUser.lastLogin = new Date();

      await userRepository.save(loginUser);
      const user = UserMapper.userEntityFromObject(findUser);

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
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
