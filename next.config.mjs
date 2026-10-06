/** @type {import('next').NextConfig} */
// Um código, dois apps: NEXT_PUBLIC_APP escolhe qual (inari | snowbobao).
// No ar, cada um mora em /financas/<app>/ (GitHub Pages do repositório «financas»).
const app = process.env.NEXT_PUBLIC_APP === 'snowbobao' ? 'snowbobao' : 'inari';
const base = process.env.NODE_ENV === 'production' ? `/financas/${app}` : '';

const nextConfig = {
  output: 'export',
  basePath: base,
  distDir: process.env.NEXT_DIST || '.next',
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_APP: app, NEXT_PUBLIC_BASE_PATH: base },
};

export default nextConfig;
