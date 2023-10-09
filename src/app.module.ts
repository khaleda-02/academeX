import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { EmailModule } from "./modules/email/email.module";
import { ConfigModule } from "@nestjs/config";
import config from "config";
import { Module } from "@nestjs/common";
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: config }),
    DatabaseModule,
    AuthModule,
    UserModule,
    EmailModule,
    PostModule,
  ],
})
export class AppModule {}
