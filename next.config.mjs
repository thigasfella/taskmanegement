/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://api-taskmanage.vercel.app/api/:path*', // Atualize a URL conforme necessário
        },
      ];
    },
  };
  
  export default nextConfig;
  