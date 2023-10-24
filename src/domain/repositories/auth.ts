import { RegisterUserDTO } from '../dtos/register';
import UserEntity from '../entities/user';

export interface AuthRepository {
  login: () => void;
  register: (registerDTO: RegisterUserDTO) => Promise<UserEntity | null>;
}
