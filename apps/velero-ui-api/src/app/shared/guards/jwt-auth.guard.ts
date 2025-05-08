import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@velero-ui-api/shared/decorators/public.decorator';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '@velero-ui-api/shared/decorators/check-policies.decorator';
import {
  AppAbility,
  CaslAbilityFactory,
} from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { SUBJECT_KEY } from '@velero-ui-api/shared/decorators/subject.decorator';
import { ResourcesNames } from '@velero-ui/velero';
import { JwtPayload } from '@velero-ui/shared-types';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (isPublic || this.authService.noAuthRequired()) {
      return true;
    }

    if (!(await super.canActivate(context))) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    const ability: AppAbility = this.caslAbilityFactory.createForUser(user);
    request.ability = ability;

    const subject: ResourcesNames =
      this.reflector.getAllAndOverride<ResourcesNames>(SUBJECT_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    const policyHandlers: PolicyHandler[] =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      ) || [];

    const allAllowed: boolean = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, subject)
    );

    if (!allAllowed) {
      throw new ForbiddenException('Access denied by policy');
    }

    return true;
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    subject?: ResourcesNames
  ) {
    if (typeof handler === 'function') {
      if (handler.length === 2) {
        return handler(ability, subject);
      }
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
