import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { SetMetadata } from '@nestjs/common';
import { PluralsNames } from '@velero-ui/velero';

interface IPolicyHandler {
  handle(ability: AppAbility, resource?: PluralsNames): boolean;
}

type PolicyHandlerCallback = (
  ability: AppAbility,
  resource?: PluralsNames
) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
