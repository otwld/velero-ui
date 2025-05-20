import {
  type JwtPayload,
  type UserPermission,
} from '@velero-ui/shared-types';
import { getUser } from '@velero-ui-app/utils/jwt.utils';
import { canAbility } from "@velero-ui-app/utils/policy.utils";
import type { Directive } from "vue";

export const canDirective: Directive = {
  mounted(el, binding, vnode) {
    const required: UserPermission = binding.value;
    const accessToken: string = localStorage.getItem('access_token');
    let can = false;

    const user: JwtPayload = getUser(accessToken);

    if (user && user.permissions) {
      can = canAbility(user.permissions, required.action, required.subject)
    }

    if (!can) {
      el.parentNode?.removeChild(el);
    }
  },
};
