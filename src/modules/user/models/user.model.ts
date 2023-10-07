import { ENUM } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  Table,
  Unique,
  Model,
  AutoIncrement,
  Scopes,
} from 'sequelize-typescript';
import { Role, UserStatus } from 'src/common/enums';
import { Email } from 'src/modules/email/models/email.model';

const { DATE, NUMBER, STRING } = DataType;
const excludedDates = [
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
  'deletedAt',
  'deletedBy',
];

@Scopes(() => ({
  login: {
    attributes: {
      exclude: [...excludedDates , 'otp', 'otpExpiry'], // get all attributes for admins
    },
  },
}))
@Table({
  underscored: true,
  paranoid: true,
  tableName: 'Users',
  defaultScope: {
    attributes: {
      exclude: [...excludedDates, 'password'],
    },
  },
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @Unique
  @Column(STRING)
  username: string;

  @Unique
  @Column(STRING)
  email: string;

  @Column(STRING)
  firstname: string;

  @Column(STRING)
  lastname: string;

  @Column(NUMBER)
  phoneNumber: string;

  @Column(STRING)
  password: string;

  @Column(ENUM(UserStatus.ACTIVE, UserStatus.DES_ACTIVE, UserStatus.PENDING))
  status: UserStatus;

  @Column(STRING)
  otp: string;

  @Column(DATE)
  otpExpiry: Date;

  @Column(ENUM(Role.ADMIN, Role.USER, Role.SUPER_ADMIN))
  roles: Role;

  @HasMany(() => Email)
  emails: Email[];

  @Column(DATE)
  createdAt: Date;

  @Column(DATE)
  updatedAt: Date;

  @Column(STRING)
  updatedBy: string;

  @Column(DATE)
  deletedAt: Date;

  @Column(STRING)
  deletedBy: string;
}
