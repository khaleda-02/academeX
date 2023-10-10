import { POST_REPOSITORY } from 'src/common/constants';
import { Post } from './models/post.model';

export const postProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
];
