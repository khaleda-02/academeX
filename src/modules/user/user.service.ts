import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { User } from './models/user.model';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { EmailService } from '../email/email.service';
import { hash, compare } from 'bcrypt';
import { OTPCodeGenerator } from 'src/util';
import { Role, UserStatus } from 'src/common/enums';
import { Op } from 'sequelize';
import { IUser } from 'src/common/interfaces';
import * as moment from 'moment';
import { USER_REPOSITORY } from 'src/common/constants';

interface IUserInfo {
  roles?: Role;
  status?: UserStatus;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: typeof User,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
  ) {}

  //! Base Methods
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        [Op.or]: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });
    if (user) throw new BadRequestException('User already exists');

    const otp = OTPCodeGenerator();
    const hashedOtp: string = await hash(`${otp}`, 10);
    createUserDto.password = await hash(createUserDto.password, 10);
    const otpExpiry = moment().utc().add(1, 'hour').toDate();

    const newUser = await this.userRepository.create({
      ...createUserDto,
      otp: hashedOtp,
      otpExpiry,
    });

    // await this.emailService.sendOtp(newUser.id, otp);

    return newUser.get({ plain: true });
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository
      .scope('login')
      .findOne({ where: { username } });
    if (!user) throw new NotFoundException('user not found');
    return user.get({ plain: true });
  }

  //! Helper Functions
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  // func => change the user's status and rolse .
  async verifyAndUpdateUser(
    id: number,
    otp: string,
    data: IUserInfo,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found ');
    const isVerified = await compare(otp, user.otp);
    if (!isVerified || user.otpExpiry < moment().utc().toDate())
      throw new BadRequestException('otp not valid');
    await user.update({ ...data });
    return user;
  }

  // func => make an otp for a user : verify him && invite & accept staffs
  async createAndSendOtp(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    const otp = OTPCodeGenerator();
    const hashedOtp = await hash(`${otp}`, 10);
    const otpExpiry = moment().utc().add(1, 'hour').toDate();
    await user.update({
      otp: hashedOtp,
      otpExpiry,
    });
    await this.emailService.sendOtp(user.id, otp);

    return user;
  }
}
