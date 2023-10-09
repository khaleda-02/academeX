import { Role, UserStatus } from '../enums';

export interface IEmailOptions {
  subject: string;
  from: string;
  to: string;
  text: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: UserStatus;
  roles: Role;
}
