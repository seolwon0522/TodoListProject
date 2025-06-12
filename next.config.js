/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  distDir: '.next',
  // 개발 디버깅을 위한 설정
  onDemandEntries: {
    // 페이지를 메모리에 유지하는 시간(밀리 초)
    maxInactiveAge: 25 * 1000,
    // 메모리에 유지할 페이지 수
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 