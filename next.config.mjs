/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // cacheComponents: 빌드 때 페이지를 정적 틀 + 요청 시 렌더링 부분으로 나눔(PPR).
  // 켜면 prerender 중 Math.random()/new Date()를 막아서, antd의 AntdRegistry(Math.random 사용)를
  // layout.js에서 <Suspense>로 감싸야 함. 지금은 꺼 둠.
  // cacheComponents: true,
  // partialPrefetching: true,
};

export default nextConfig;
