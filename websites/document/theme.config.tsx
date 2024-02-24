import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  head: (
    <>
      <link rel="icon" href="/favicon.ico" sizes="any" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s',
    };
  },
  nextThemes: {
    defaultTheme: 'dark',
  },
  logo: (
    <img
      width={130}
      src="/logo.png"
    />
  ),
  project: {
    link: 'https://github.com/sys113/killua',
  },
};

export default config;
