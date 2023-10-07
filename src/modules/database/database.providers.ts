import { ConfigService } from "@nestjs/config";
import { User } from "../user/models/user.model";
import { Email } from "../email/models/email.model";
import { Sequelize } from "sequelize-typescript";
import { SEQUELIZE } from "src/common/constants";

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const config = configService.get('database');
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Email,
      ]);
      return sequelize;
    },

    inject: [ConfigService],
  },
];
