import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Velero UI Docs',
  tagline: 'velero backup',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://velero-ui.docs.otwld.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'otwld', // Usually your GitHub org/user name.
  projectName: 'velero-ui', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: "/",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/otwld/velero-ui/blob/main',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Velero UI Documentation',
      logo: {
        alt: 'Velero UI',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://discord.gg/U24mpqTynB',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://github.com/otwld/velero-ui',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/U24mpqTynB',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/otwld/velero-ui',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Release Note',
              to: 'https://github.com/otwld/velero-ui/releases',
            },
            {
              label: 'Velero',
              to: 'https://velero.io/',
            },
            {
              label: 'OTWLD',
              to: 'https://otwld.com/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Velero UI, Powered by <a href="https://otwld.com">OTWLD</a>. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  plugins: [require.resolve("docusaurus-lunr-search")],
};

export default config;
