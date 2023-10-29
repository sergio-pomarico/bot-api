import { RegisterUserDTO } from '../dtos';
import UserEntity from '../entities/user';

export interface AuthDataSource {
  login: () => void;
  register: (registerDTO: RegisterUserDTO) => Promise<UserEntity | null>;
}
