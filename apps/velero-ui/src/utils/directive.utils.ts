import type { App } from 'vue';
import { clickOutsideDirective } from '@velero-ui-app/directives/click-outside.directive';
import { dropdownDirective } from '@velero-ui-app/directives/dropdown.directive';
import { canDirective } from '@velero-ui-app/directives/can.directive';
import { copyDirective } from '@velero-ui-app/directives/copy.directive';
import { downloadDirective } from '@velero-ui-app/directives/download.directive';

export const registerDirectives = (app: App) => {
  app.directive('clickOut', clickOutsideDirective);
  app.directive('dropdown', dropdownDirective);
  app.directive('can', canDirective);
  app.directive('copyToClipboard', copyDirective);
  app.directive('download', downloadDirective);
};
