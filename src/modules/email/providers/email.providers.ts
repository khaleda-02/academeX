import { EMAIL_REPOSITORY } from 'src/common/constants';
import { Email } from '../models/email.model';

export const emailProviders = [
  {
    provide: EMAIL_REPOSITORY,
    useValue: Email,
  },
];
