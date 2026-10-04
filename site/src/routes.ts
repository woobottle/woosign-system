import {names, descriptions} from './demos';
export const basePath = '/woosign/';
export const origin = 'https://woo-bottle.com';
export const pagePath = (route: string) =>
  basePath +
  route.replace(/^\//, '').replace(/\/$/, '') +
  (route === '/' ? '' : '/');
export function normalizeRoute(route: string) {
  const path = route.replace(/^#/, '').replace(/\/$/, '');
  return path || '/';
}
export function readRoute() {
  if (typeof window === 'undefined') return '/';
  if (window.location.hash.startsWith('#/'))
    return normalizeRoute(window.location.hash);
  const path = window.location.pathname;
  return normalizeRoute(
    path.startsWith(basePath)
      ? '/' + path.slice(basePath.length)
      : path === '/woosign'
      ? '/'
      : path,
  );
}
export const componentRoute = (name: string) =>
  `/components/${name.toLowerCase()}`;
export const pages = [
  {
    route: '/',
    title: 'WooSign — React & React Native 디자인 시스템',
    description:
      'React와 React Native를 위한 Paper & Ink 디자인 시스템. Web, iOS, Android에서 사용하는 50개 컴포넌트와 디자인 토큰.',
  },
  {
    route: '/components',
    title: '50개 컴포넌트 — WooSign',
    description:
      '검색과 분류로 탐색하는 React·React Native 컴포넌트. 실제 웹 데모, 사용 코드와 공통 API를 확인하세요.',
  },
  {
    route: '/react-native',
    title: 'React Native · iOS & Android — WooSign',
    description:
      'WooSign을 React Native에서 사용하는 방법. ThemeProvider, 네이티브 폰트 설정과 공유 API 예제로 iOS·Android 화면을 만드세요.',
  },
  {
    route: '/tokens',
    title: '디자인 토큰 — WooSign',
    description:
      'Web과 React Native에서 공유하는 Paper & Ink 색상, 타이포그래피, 여백, 모서리와 그림자.',
  },
  {
    route: '/getting-started',
    title: '설치와 시작하기 — WooSign',
    description:
      'woosign-system 설치와 ThemeProvider 설정. React Web과 React Native의 첫 화면을 만들어 보세요.',
  },
  {
    route: '/sitemap',
    title: '사이트맵 — WooSign',
    description:
      'WooSign의 시작하기, React Native, 디자인 토큰과 50개 컴포넌트를 한눈에 탐색하세요.',
  },
  ...names.map(name => ({
    route: componentRoute(name),
    title: `${name} · React & React Native — WooSign`,
    description: `${descriptions[name]}. WooSign ${name}의 실제 웹 데모, 사용 예제와 React·React Native 공통 API를 확인하세요.`,
  })),
];
export function metadata(route: string) {
  return (
    pages.find(p => p.route === route) || {
      route,
      title: '페이지를 찾을 수 없습니다 — WooSign',
      description: 'WooSign 사이트맵에서 필요한 페이지를 찾아보세요.',
    }
  );
}
