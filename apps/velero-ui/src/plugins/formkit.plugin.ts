import type { App } from 'vue';
import { defaultConfig, type DefaultConfigOptions, plugin } from '@formkit/vue';
import { en, fr } from '@formkit/i18n';
import { default as Cron } from 'cron-validate';
import { REGEX } from '@velero-ui/shared-types';
import { getDefaultLocal } from "@velero-ui-app/utils/config.utils";

const config: DefaultConfigOptions = {
  rules: {
    k8s_name: (node) => REGEX.k8sResourceName.test(node.value as string),
    k8s_resource: (node) => {
      return (
        REGEX.k8sSimpleResource.test(node.value as string) ||
        REGEX.k8sGroupedResource.test(node.value as string) ||
        node.value === '*'
      );
    },
    k8s_label: (node) => {
      return REGEX.k8sLabel.test(node.value as string);
    },
    cron: (node) => Cron(node.value as string).isValid(),
    bucket: (node) => REGEX.s3Bucket.test(node.value as string),
    field: (node) => REGEX.field.test(node.value as string),
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
  locale: getDefaultLocal(),
};

export const FormKit = {
  install(app: App) {
    app.use(plugin, defaultConfig(config));
  },
};
