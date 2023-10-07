import { Global, Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EmailService } from './email.service';
import { emailProviders } from './providers/email.providers';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [EmailService, ...emailProviders],
  exports: [EmailService],
})
export class EmailModule {}
