import type { NextConfig } from 'next';

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Covers are addressable by id, isbn, olid and more, all under /b/.
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        pathname: '/b/**',
      },
    ],
    // Open Library takes over a second to answer and the artwork never
    // changes, so the default 60s cache means refetching a slow origin for no
    // reason. Optimise each cover once and keep it.
    minimumCacheTTL: THIRTY_DAYS_IN_SECONDS,
  },
};

export default nextConfig;
