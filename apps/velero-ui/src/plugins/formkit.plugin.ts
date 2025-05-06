import type { App } from 'vue';
import { defaultConfig, type DefaultConfigOptions, plugin } from '@formkit/vue';
import { en, fr } from '@formkit/i18n';
import { default as Cron } from 'cron-validate';

const config: DefaultConfigOptions = {
  rules: {
    k8s_name: (node) =>
      /^[A-Za-z0-9]([A-Za-z0-9_.-]{0,61}[A-Za-z0-9])?$/.test(
        node.value as string,
      ),
    k8s_resource: (node) => {
      const simpleResourceRegex = /^[a-z]+$/;
      const groupedResourceRegex = /^([a-z0-9.-]+\.[a-z]{2,})\/[a-z]+$/;

      return (
        simpleResourceRegex.test(node.value as string) ||
        groupedResourceRegex.test(node.value as string) ||
        node.value === '*'
      );
    },
    k8s_label: (node) => {
      const prefixSegment = '(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?\\.)*[a-z]{2,}';
      const nameSegment = '[A-Za-z0-9]([A-Za-z0-9_.-]{0,61}[A-Za-z0-9])?';
      const fullKeyRegex = new RegExp(`^((${prefixSegment}/)?${nameSegment})$`);
      return fullKeyRegex.test(node.value as string);
    },
    cron: (node) => Cron(node.value as string).isValid(),
    bucket: (node) =>
      /^(?!^\d+\.\d+\.\d+\.\d+$)(?!-)[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(
        node.value as string,
      ),
    field: (node) => /^[a-zA-Z0-9_-]+$/.test(node.value as string),
  },
  locales: { en, fr },
  messages: {
    en: {
      validation: {
        k8s_name: ({ name }) => `${name} is not a valid Kubernetes name.`,
        k8s_resource: ({ name }) =>
          `${name} is not a valid Kubernetes resource.`,
        k8s_label: ({ name }) => `${name} is not a valid Kubernetes label.`,
        bucket: ({ name }) => `${name} is not a valid bucket format.`,
        field: ({ name }) => `${name} can contain a-Z, 0-9 and "-_.".`,
      },
    },
  },
  config: {
    classes: {
      outer: '',
      input:
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm p-2.5 w-full focus:ring-blue-500 focus:border-blue-50 rounded-lg block dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
      message: 'mt-1 text-sm text-red-600 dark:text-red-500',
      label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
      help: 'mt-1 text-sm text-gray-600 dark:text-gray-500',
    },
  },
  inputs: {},
  locale: localStorage.getItem('language') || 'en',
};

export const FormKit = {
  install(app: App) {
    app.use(plugin, defaultConfig(config));
  },
};
