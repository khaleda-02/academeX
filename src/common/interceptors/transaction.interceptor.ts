import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { SEQUELIZE } from '../constants';
import { Transaction, Sequelize } from 'sequelize';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private logger = new Logger(TransactionInterceptor.name);

  constructor(@Inject(SEQUELIZE) private sequelize: Sequelize) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const transaction: Transaction = await this.sequelize.transaction();
    req.transaction = transaction;

    // TODO: Check if transaction is already committed, then do nothing

    return next.handle().pipe(
      tap(() => {
        transaction.commit();
        this.logger.debug('Commit Transaction');
      }),
      catchError((err) => {
        this.logger.debug('Rollback transaction');
        transaction.rollback();
        throw err;
      }),
    );
  }
}
