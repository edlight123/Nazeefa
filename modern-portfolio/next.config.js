/**** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nazeefaca.wordpress.com' },
      { protocol: 'https', hostname: 'nazeefaahmed.com' },
      { protocol: 'https', hostname: 's2.wp.com' },
      { protocol: 'https', hostname: 's0.wp.com' },
      { protocol: 'https', hostname: 's1.wp.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' }
    ]
  }
};

module.exports = nextConfig;
