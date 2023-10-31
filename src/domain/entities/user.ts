export default interface UserEntity {
  id?: string;
  email: string;
  password: string;
  phone?: number;
  active?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
