import { USER_REPOSITORY } from 'src/common/constants';
import { User } from './models/user.model';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
