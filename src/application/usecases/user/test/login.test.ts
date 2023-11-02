import { LoginUser } from '..';
import { LoginUserDTO, RegisterUserDTO } from '../../../../domain/dtos';
import { UserEntity } from '../../../../domain/entities';
import { AuthRepository } from '../../../../domain/repositories';

class MockReposity implements AuthRepository {
  register: (registerDTO: RegisterUserDTO) => Promise<UserEntity | null>;
  login = (loginDTO: LoginUserDTO): Promise<UserEntity | null> => {
    return new Promise((resolve) => {
      resolve({
        id: 'b11254af-8695-4121-8fa6-f3d2bf9f7ebe',
        email: loginDTO.email,
        password: loginDTO.password,
        lastLogin: new Date(),
      });
    });
  };
}

describe('test LoginUser', () => {
  test('LoginUser should be return a new token', async () => {
    const reposity = new MockReposity();
    const createUser = new LoginUser(reposity);
    const userMock = {
      email: 'test@email.com',
      password: 'password',
    };
    const [error, loginDTO] = LoginUserDTO.create(userMock);
    expect(error).toBeUndefined();

    const { token, userId, lastLogin } = await createUser.run(loginDTO!);
    expect(token).toBeDefined();
    expect(userId).toBeDefined();
    expect(lastLogin).toBeDefined();
  });
});
