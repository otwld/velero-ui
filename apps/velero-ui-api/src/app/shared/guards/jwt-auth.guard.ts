import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@velero-ui-api/shared/decorators/public.decorator';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic || this.authService.noAuthRequired()) {
      return true;
    }
    return super.canActivate(context);
  }
}
