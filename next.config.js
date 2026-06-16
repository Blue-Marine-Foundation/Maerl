/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['mapbox-gl'],
  async redirects() {
    return [
      {
        source: '/impact',
        destination: '/impactindicators',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
