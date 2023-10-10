import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/models/user.model';

const { DATE, NUMBER, STRING } = DataType;
@Scopes(() => ({
  withUser: {
    include: [
      {
        model: User,
        attributes: ['username', 'firstName', 'userImage', 'role'],
      },
    ],
    attributes: ['description', 'image', 'createdAt', 'updatedAt'],
  },
}))
@Table({
  underscored: true,
  paranoid: true,
  tableName: 'Posts',
})
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(NUMBER)
  id: number;

  @ForeignKey(() => User)
  @Column(NUMBER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @AllowNull(false)
  @Column(STRING)
  description: string;

  @Column(STRING)
  image: string;

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
}
