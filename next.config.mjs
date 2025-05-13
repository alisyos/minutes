/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // pdf-parse와 같은 Node.js 모듈을 사용하는 패키지를 클라이언트 번들에서 제외
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      http: false,
      https: false,
      url: false,
    };
    
    return config;
  },
};

export default nextConfig; 