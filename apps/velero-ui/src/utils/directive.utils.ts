import type { App } from 'vue';
import { clickOutside } from '@velero-ui-app/directives/click-outside.directive';
import { dropdown } from '@velero-ui-app/directives/dropdown.directive';

export const registerDirectives = (app: App) => {
  app.directive('clickOut', clickOutside);
  app.directive('dropdown', dropdown);
};
