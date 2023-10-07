import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [forwardRef(() => EmailModule)],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
