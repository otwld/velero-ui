import type { Directive, DirectiveBinding } from 'vue'
import { ToastType, useToastsStore } from "@velero-ui-app/stores/toasts.store";
import { i18n } from "@velero-ui-app/plugins/i18n.plugin";

interface DownloadBindingValue {
  content: string | Blob
  filename: string
  type?: string
}

interface DownloadHTMLElement extends HTMLElement {
  _downloadHandler?: () => void
}

export const downloadDirective: Directive<HTMLElement, DownloadBindingValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<DownloadBindingValue>) {
    const toastsStore = useToastsStore();
    el.style.cursor = 'pointer';

    const handler = () => {
      const { content, filename, type } = binding.value;

      const blob = content instanceof Blob
        ? content
        : new Blob([content], { type: type || 'text/plain' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      toastsStore.push(
        i18n.global.t('global.message.success.downloadStarted'),
        ToastType.SUCCESS
      );
      URL.revokeObjectURL(url);
      a.remove(); // correction ici : il faut retirer <a>, pas document.removeChild(a)
    };

    (el as DownloadHTMLElement)._downloadHandler = handler;
    el.addEventListener('click', handler);
  },

  updated(el: HTMLElement, binding: DirectiveBinding<DownloadBindingValue>) {
    const elTyped = el as DownloadHTMLElement;

    if (elTyped._downloadHandler) {
      el.removeEventListener('click', elTyped._downloadHandler);
    }

    const toastsStore = useToastsStore();

    const handler = () => {
      const { content, filename, type } = binding.value;

      const blob = content instanceof Blob
        ? content
        : new Blob([content], { type: type || 'text/plain' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      toastsStore.push(
        i18n.global.t('global.message.success.downloadStarted'),
        ToastType.SUCCESS
      );
      URL.revokeObjectURL(url);
      a.remove();
    };

    elTyped._downloadHandler = handler;
    el.addEventListener('click', handler);
  },

  unmounted(el: HTMLElement) {
    const elTyped = el as DownloadHTMLElement;

    if (elTyped._downloadHandler) {
      el.removeEventListener('click', elTyped._downloadHandler);
      delete elTyped._downloadHandler;
    }
  },
};
