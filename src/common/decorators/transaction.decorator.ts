import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const TransactionDecorator = createParamDecorator(
  (data, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().transaction
);
