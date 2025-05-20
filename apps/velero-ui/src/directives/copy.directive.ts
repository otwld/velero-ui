import type { Directive, DirectiveBinding } from 'vue';
import { ToastType, useToastsStore } from '@velero-ui-app/stores/toasts.store';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { i18n } from '@velero-ui-app/plugins/i18n.plugin';

export const copyDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const toastsStore = useToastsStore();
    const textToCopy = binding.value;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
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
    });
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const toastsStore = useToastsStore();

    el.onclick = () => {
      navigator.clipboard.writeText(binding.value).then(() => {
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
  },
};
