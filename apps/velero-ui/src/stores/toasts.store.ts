import { defineStore } from 'pinia';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const enum ToastType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export interface ToastOptions {
  icon?: IconDefinition;
  delay?: number;
}

export interface Toast {
  message: string;
  type: ToastType;
  icon?: IconDefinition;
  delay?: number;
}

export interface ToastsStore {
  toasts: Toast[];
}

export const useToastsStore = defineStore('toasts', {
  state: () =>
    ({
      toasts: [],
    } as ToastsStore),
  actions: {
    clear(): void {
      this.toasts = [];
    },
    push(message: string, type: ToastType, opts?: ToastOptions): void {
      this.toasts.push({
        message,
        type,
        delay: opts?.delay || 8000,
        icon: opts?.icon,
      });
    },
    remove(index: number): void {
      this.toasts.splice(index, 1);
    },
  },
});
