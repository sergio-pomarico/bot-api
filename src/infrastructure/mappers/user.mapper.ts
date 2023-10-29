import UserEntity from '@domain/entities/user';

export class UserMapper {
  static userEntityFromObject(object: {
    [key in keyof UserEntity]: unknown;
  }): UserEntity {
    const {
      id,
      phone,
      email,
      password,
      active,
      lastLogin,
      createdAt,
      updatedAt,
    } = object;
    return {
      id: id as string,
      phone: phone as number,
      email: email as string,
      password: password as string,
      active: active as boolean,
      lastLogin: lastLogin as Date | undefined,
      createdAt: createdAt as Date | undefined,
      updatedAt: updatedAt as Date | undefined,
    };
  }
}
