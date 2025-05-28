import type { Directive, DirectiveBinding } from 'vue';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { i18n } from '@velero-ui-app/plugins/i18n.plugin';

interface CopyHTMLElement extends HTMLElement {
  _copyHandler?: () => void
}

export const copyDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const toastsStore = useToastsStore();
    el.style.cursor = 'pointer';

    const handler = () => {
      const textToCopy = binding.value;
      if (!textToCopy) {
        return;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        toastsStore.push(
          i18n.global.t('global.message.success.copied'),
          ToastType.SUCCESS,
          {
            delay: 3000,
            icon: faClipboard,
          }
        );
      });
    };

    (el as CopyHTMLElement)._copyHandler = handler;
    el.addEventListener('click', handler);
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const elTyped = el as  CopyHTMLElement;

    if (elTyped._copyHandler) {
      el.removeEventListener('click', elTyped._copyHandler);
    }

    const toastsStore = useToastsStore();

    const newHandler = () => {
      const textToCopy = binding.value;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        toastsStore.push(
          i18n.global.t('global.message.success.copied'),
          ToastType.SUCCESS,
          {
            delay: 3000,
            icon: faClipboard,
          }
        );
      });
    };

    elTyped._copyHandler = newHandler;
    el.addEventListener('click', newHandler);
  },

  unmounted(el: HTMLElement) {
    const elTyped = el as  CopyHTMLElement;

    if (elTyped._copyHandler) {
      el.removeEventListener('click', elTyped._copyHandler);
      delete elTyped._copyHandler;
    }
  },
};
