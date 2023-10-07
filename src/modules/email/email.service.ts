import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { sendEmail, OTPCodeGenerator } from 'src/util/';
import { UserService } from '../user/user.service';
import { Email } from './models/email.model';
import { EMAIL_REPOSITORY } from 'src/common/constants';

//! instead of one function that take the options as a parameter [for all eamil cases],
//! I made it separated , because the above approach is hard to update and not open for extensions and closed for modifaction
//!  => easy to update , rather than go to each file and update ,
@Injectable()
export class EmailService {
  private logger = new Logger();
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(EMAIL_REPOSITORY)
    private emailRepository: typeof Email,
  ) {}

  async send(userId: number, subject: string, text: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    const to = user.email;
    await sendEmail({ subject, from: 'khaleda.02f@gmail.com', to, text });

    await this.emailRepository.create({
      userId: user.id,
      subject,
      message: text,
    });
    this.logger.log(`Email Sent to ${to}`);
  }

  // user verification & confirmation, statff creation
  async sendOtp(userId: number, otp: number) {
    await this.send(
      userId,
      'One Time Password',
      `Hey ,your code ${otp} , valid in an hour `,
    );
  }
  async newTicketEmail(userId: number, ticketTitle: string) {
    await this.send(
      userId,
      'New Ticket Created',
      `Hey , we just want you to know that you have created a new ticket , with titile ${ticketTitle} `,
    );
  }

  async ticketUpdated(userId: number, ticketTitle: string) {
    await this.send(
      userId,
      'Your Ticket Has Updated ',
      `Hey , we just want you to know that tickets '${ticketTitle}' has updated `,
    );
  }

  async assignTicket(userId: number) {
    await this.send(
      userId,
      'New Ticket Assignment',
      `Hey ,our admins assigned a new ticket to you , 
      pelase check your assigned tickets `,
    );
  }
  async delayTicket(userId: number, ticketTitle: string) {
    await this.send(
      userId,
      'please do what you assigned to ',
      `Hey ,our admins ask you to resolce your assinged tickets , your delayed ticket ${ticketTitle}`,
    );
  }
}
