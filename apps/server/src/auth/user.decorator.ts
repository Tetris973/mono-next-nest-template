import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the current user from the request.
 * The user object is added by the Authentication guard when
 * a user has valid authentication credentials (JWT).
 * @param ctx Execution context
 * @returns The user object from the request
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
