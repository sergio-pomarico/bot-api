import { CreateUser } from '..';
import { LoginUserDTO, RegisterUserDTO } from '../../../../domain/dtos';
import { UserEntity } from '../../../../domain/entities';
import { AuthRepository } from '../../../../domain/repositories';

class MockReposity implements AuthRepository {
  login: (loginDTO: LoginUserDTO) => Promise<UserEntity | null>;
  register = async (
    registerDTO: RegisterUserDTO,
  ): Promise<UserEntity | null> => {
    return new Promise((resolve) => {
      resolve({
        id: '40106fe2-74f6-4f2a-8e8b-3b5cd9700539',
        email: registerDTO.email,
        password: registerDTO.password,
      });
    });
  };
}

describe('test CreateUserUseCase', () => {
  test('CreateUserUseCase should be create a new UserEntity', async () => {
    const reposity = new MockReposity();
    const createUser = new CreateUser(reposity);
    const userMock = {
      email: 'test@email.com',
      password: 'password',
      phone: '3000000000',
    };
    const [error, registerDTO] = RegisterUserDTO.create(userMock);
    expect(error).toBeUndefined();

    const { token, userId } = await createUser.run(registerDTO!);
    expect(token).toBeDefined();
    expect(userId).toBeDefined();
  });
});
