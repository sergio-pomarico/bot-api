import { LoginUserDTO } from '../';

describe('test LoginUserDTO', () => {
  test('LoginUserDTO should be validate a login payload', () => {
    const user = {
      email: 'test@email.com',
      password: 'password',
    };
    const [error, loginDTO] = LoginUserDTO.create(user);
    expect(error).toBeUndefined();
    expect(loginDTO).toBeInstanceOf(LoginUserDTO);
  });

  test('LoginUserDTO should be return a error with invalid login payload', () => {
    const user = {
      email: '',
      password: 'password',
    };
    const [error, loginDTO] = LoginUserDTO.create(user);
    expect(error).toBeDefined();
    expect(loginDTO).toBeUndefined();
  });
});
