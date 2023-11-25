/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr', 'nl'],
    defaultLocale: 'en-US',
    localeDetection: false,
  }
}

module.exports = nextConfig
