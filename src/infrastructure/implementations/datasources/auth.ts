import { UserModel } from '../../data/models/user.model';
import { postgreSQLDatabase } from '../../data/postgreSQL';
import { AuthDataSource } from '@domain/datasources';
import { LoginUserDTO, RegisterUserDTO } from '@domain/dtos';
import { UserEntity } from '@domain/entities';
import { CustomHTTPError } from '@domain/errors/custom';
import { EncryptAdapter } from '@shared/utils';

type hashFunction = (password: string) => string;
type compareFunction = (password: string, hash: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {
  constructor(
    private hashPassword: hashFunction = EncryptAdapter.hash,
    private comparePassword: compareFunction = EncryptAdapter.compare,
  ) {}

  async login(loginDTO: LoginUserDTO): Promise<UserEntity | null> {
    try {
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(UserModel);
      const userFound = await databaseRepository.findOneBy({
        email: loginDTO.email,
      });
      if (userFound == null)
        throw CustomHTTPError.unauthorize('Wrong username or password');
      const validatedPassword = this.comparePassword(
        loginDTO.password,
        userFound.password,
      );
      if (!validatedPassword)
        throw CustomHTTPError.unauthorize('Wrong username or password');

      let user = new UserModel();
      user = { ...userFound, lastLogin: new Date() };

      await databaseRepository.save(user);

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
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(UserModel);

      const userFound = await databaseRepository.findOneBy({
        email: registerDTO.email,
      });

      if (userFound != null)
        throw CustomHTTPError.badRequest('Cannot register user');

      const newUser = new UserModel();
      newUser.email = registerDTO.email;
      newUser.password = this.hashPassword(registerDTO.password);
      newUser.phone = parseInt(registerDTO.phone);
      newUser.active = false;

      const user = await databaseRepository.save(newUser);

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  }
}
