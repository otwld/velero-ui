import type { Directive, DirectiveBinding } from 'vue'
import { ToastType, useToastsStore } from "@velero-ui-app/stores/toasts.store";
import { i18n } from "@velero-ui-app/plugins/i18n.plugin";

interface DownloadBindingValue {
  content: string | Blob
  filename: string
  type?: string
}

export const downloadDirective: Directive<HTMLElement, DownloadBindingValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<DownloadBindingValue>) {
    const toastsStore = useToastsStore();

    el.style.cursor = 'pointer'

    el.addEventListener('click', () => {
      const { content, filename, type } = binding.value

      const blob: Blob = content instanceof Blob
        ? content
        : new Blob([content], { type: type || 'text/plain' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      toastsStore.push(
        i18n.global.t('global.message.success.downloadStarted'),
        ToastType.SUCCESS
      );
      URL.revokeObjectURL(url)
      document.removeChild(a);
    })
  },

  updated(el: HTMLElement, binding: DirectiveBinding<DownloadBindingValue>) {
    const toastsStore = useToastsStore();

    el.onclick = () => {
      const { content, filename, type } = binding.value

      const blob = content instanceof Blob
        ? content
        : new Blob([content], { type: type || 'text/plain' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      toastsStore.push(
        i18n.global.t('global.message.success.downloadStarted'),
        ToastType.SUCCESS
      );
      URL.revokeObjectURL(url)
      document.removeChild(a);
    }
  },
}
