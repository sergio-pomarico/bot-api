import { LoginUserDTO, RegisterUserDTO } from '../dtos';
import UserEntity from '../entities/user';

export interface AuthRepository {
  login: (loginDTO: LoginUserDTO) => Promise<UserEntity | null>;
  register: (registerDTO: RegisterUserDTO) => Promise<UserEntity | null>;
}
