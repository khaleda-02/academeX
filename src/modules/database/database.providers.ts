import { ConfigService } from '@nestjs/config';
import { User } from '../user/models/user.model';
import { Email } from '../email/models/email.model';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/common/constants';
import { Post } from '../post/models/post.model';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const config = configService.get('database');
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Post, Email]);
      return sequelize;
    },

    inject: [ConfigService],
  },
];
