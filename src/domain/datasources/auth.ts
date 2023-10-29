import { LoginUserDTO, RegisterUserDTO } from '../dtos';
import UserEntity from '../entities/user';

export interface AuthDataSource {
  login: (loginUserDTO: LoginUserDTO) => Promise<UserEntity | null>;
  register: (registerDTO: RegisterUserDTO) => Promise<UserEntity | null>;
}
