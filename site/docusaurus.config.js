module.exports = {
  title: 'Frictionless Repository',
  tagline: 'Github action for Frictionless data validation',
  organizationName: 'Frictionless Data',
  projectName: 'frictionless',
  baseUrl: '/',
  url: 'https://repository.frictionlessdata.io',
  favicon: 'img/logo.png',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  customFields: {
    description: 'Github action for Frictionless data validation',
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  // stylesheets: ["https://fonts.googleapis.com/css?family=Roboto&display=swap"],
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/frictionlessdata/frictionless-py/edit/master/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    sidebarCollapsible: true,
    image: 'img/docusaurus.png',
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    gtag: {
      trackingID: 'UA-141789564-1',
    },
    // googleAnalytics: {
    //   trackingID: 'UA-141789564-1',
    // },
    algolia: {
      apiKey: '0632881f114cfc50b94e4bc7b970cbce',
      indexName: 'frictionless-py',
      algoliaOptions: {
        // facetFilters: [`version:${versions[0]}`],
      },
    },
    navbar: {
      hideOnScroll: true,
      title: 'Frictionless Repository',
      logo: {
        alt: 'Frictionless Repository Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/introduction',
          label: 'Documentation',
          position: 'left',
        },
        {
          to: 'report',
          label: 'Report',
          position: 'left',
        },
        {
          href: 'https://frictionlessdata.io/',
          label: 'Back to the main site',
          position: 'right',
          className: 'header-mainsite-link',
        },
        {
          href: 'https://github.com/frictionlessdata/repository',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
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
              label: 'Guides',
              to: 'docs/guides/guides-overview',
            },
            {
              label: 'Tutorials',
              to: 'docs/tutorials/tutorials-overview',
            },
            {
              label: 'References',
              to: 'docs/references/references-overview',
            },
            {
              label: 'Development',
              to: 'docs/development/development',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Blog',
              href: 'https://frictionlessdata.io/blog/',
            },
            {
              label: 'Forum',
              to: 'https://github.com/frictionlessdata/project/discussions',
            },
            {
              label: 'Chat',
              href: 'https://discordapp.com/invite/Sewv6av',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/frictionlessdata/frictionless-py',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/frictionlessd8a',
            },
          ],
        },
      ],
      logo: {
        alt: 'Open Knowledge Foundation',
        src: 'https://a.okfn.org/img/oki/landscape-white-468x122.png',
        href: 'https://okfn.org',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Frictionless Data`,
    },
  },
}
