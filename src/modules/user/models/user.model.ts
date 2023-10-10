import { ENUM } from 'sequelize';
import {
  Column,
  DataType,
  PrimaryKey,
  Table,
  Unique,
  Model,
  AutoIncrement,
  Scopes,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';
import { Role, UserStatus } from 'src/common/enums';
import { Post } from 'src/modules/post/models/post.model';

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
      exclude: [...excludedDates, 'otp', 'otpExpiry'],
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
  @AllowNull(false)
  @Column(NUMBER)
  id: number;

  @Unique
  @AllowNull(false)
  @Column(STRING)
  username: string;

  @Unique
  @AllowNull(false)
  @Column(STRING)
  email: string;

  @AllowNull(false)
  @Column(STRING)
  firstName: string;

  @Column(STRING)
  lastName: string;

  @AllowNull(false)
  @Column(NUMBER)
  phoneNumber: string;

  @AllowNull(false)
  @Column(STRING)
  password: string;

  @Column(ENUM(UserStatus.ACTIVE, UserStatus.DES_ACTIVE, UserStatus.PENDING))
  status: UserStatus;

  @Column(STRING)
  userImage: string;

  @Column(STRING)
  profileImage: string;

  @Column(STRING)
  bio: string;

  @Column(STRING)
  otp: string;

  @Column(DATE)
  otpExpiry: Date;

  @Column(ENUM(Role.ADMIN, Role.USER, Role.SUPER_ADMIN))
  role: Role;

  @AllowNull(false)
  @Column(DATE)
  createdAt: Date;

  @AllowNull(false)
  @Column(DATE)
  updatedAt: Date;

  @Column(NUMBER)
  updatedBy: number;

  @Column(DATE)
  deletedAt: Date;

  @Column(NUMBER)
  deletedBy: number;

  @HasMany(() => Post)
  posts: Post[];
}
