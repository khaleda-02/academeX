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
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/models/user.model';

const { DATE, NUMBER, STRING } = DataType;

@Table({ underscored: true, paranoid: true, tableName: 'Emails' })
export class Email extends Model<Email> {
  @PrimaryKey
  @AutoIncrement
  @Column(NUMBER)
  id: number;

  @Column(STRING)
  subject: string;

  @Column(STRING)
  message: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column(NUMBER)
  userId: number;

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
