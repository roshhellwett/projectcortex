export default function robots() {
  const baseUrl = 'https://projectcortex.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
