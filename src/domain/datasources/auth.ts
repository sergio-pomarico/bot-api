import { LoginUserDTO, RegisterUserDTO } from '../dtos';
import { UserEntity } from '../entities';

export default interface AuthDataSource {
  login: (loginUserDTO: LoginUserDTO) => Promise<UserEntity | null>;
  register: (registerDTO: RegisterUserDTO) => Promise<UserEntity | null>;
}
