import { RegisterUserDTO } from '../';

describe('test RegisterUserDTO', () => {
  test('RegisterUserDTO should be validate a register payload', () => {
    const user = {
      email: 'test@email.com',
      password: 'password',
      phone: '3002334456',
    };
    const [error, registerDTO] = RegisterUserDTO.create(user);
    expect(error).toBeUndefined();
    expect(registerDTO).toBeDefined();
  });

  test('RegisterUserDTO should be return a error with invalid register payload', () => {
    const user = {
      email: '',
      password: 'password',
    };
    const [error, registerDTO] = RegisterUserDTO.create(user);
    expect(error).toBeDefined();
    expect(registerDTO).toBeUndefined();
  });
});
