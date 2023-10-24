import { RegisterUserDTO } from '../dtos/register';
import UserEntity from '../entities/user';

export interface AuthDataSource {
  login: () => void;
  register: (registerDTO: RegisterUserDTO) => Promise<UserEntity | null>;
}
