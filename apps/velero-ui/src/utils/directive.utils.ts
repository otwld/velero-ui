import type { App } from 'vue';
import { clickOutsideDirective } from '@velero-ui-app/directives/click-outside.directive';
import { dropdownDirective } from '@velero-ui-app/directives/dropdown.directive';
import { canDirective } from '@velero-ui-app/directives/can.directive';

export const registerDirectives = (app: App) => {
  app.directive('clickOut', clickOutsideDirective);
  app.directive('dropdown', dropdownDirective);
  app.directive('can', canDirective);
};
