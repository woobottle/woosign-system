import {hydrateRoot} from 'react-dom/client';
import {StrictMode} from 'react';
import {render as prerender} from './prerender';
import {render, screen, fireEvent, cleanup, act} from '@testing-library/react';
import {ThemeProvider, ToastProvider} from 'woosign-system';
import {App} from './App';
import {Demo, names} from './demos';
import catalog from './catalog.json';
function mount(children: React.ReactNode) {
  return render(
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>,
  );
}
beforeEach(() => {
  window.history.replaceState(null, '', '/woosign/');
  window.matchMedia = jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
  localStorage.clear();
  window.scrollTo = jest.fn();
});
afterEach(cleanup);
it.each(names)('renders %s with a corresponding code sample', name => {
  mount(<Demo name={name} />);
  expect(catalog.snippets[name]).toContain('export function Example');
});
it('contains 50 unique component demos', () => {
  expect(new Set(names).size).toBe(50);
  expect(Object.keys(catalog.snippets).length).toBe(50);
});
it('filters the gallery and resets empty results', () => {
  window.location.hash = '#/components';
  mount(<App />);
  fireEvent.change(screen.getByLabelText('갤러리 검색'), {
    target: {value: 'zzzz'},
  });
  expect(screen.getByText('검색 결과가 없어요')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: '필터 초기화'}));
  expect(screen.getByText('50개 컴포넌트')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('갤러리 검색'), {
    target: {value: 'Button'},
  });
  expect(screen.getByText('1개 컴포넌트')).toBeInTheDocument();
});
it('opens the detail route and changes the disabled state', () => {
  window.location.hash = '#/components/button';
  mount(<App />);
  const button = screen.getByRole('button', {name: '시작하기 ↗'});
  expect(button).toBeEnabled();
  fireEvent.click(screen.getByLabelText('Disabled'));
  expect(button).toBeDisabled();
  expect(screen.getByText(/disabled=\{true\}/)).toBeInTheDocument();
});
it('persists theme selection', () => {
  mount(<App />);
  fireEvent.click(screen.getByRole('button', {name: '다크 테마로 변경'}));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(localStorage.getItem('woosign-theme')).toBe('dark');
});
it('allows the home routine to be completed', () => {
  mount(<App />);
  fireEvent.click(
    screen.getByRole('checkbox', {name: '작은 목표 하나 끝내기'}),
  );
  expect(screen.getByText('3 / 3')).toBeInTheDocument();
});
it('handles unknown routes', () => {
  window.location.hash = '#/missing';
  mount(<App />);
  expect(screen.getByText('페이지를 찾을 수 없어요')).toBeInTheDocument();
});

it('opens the native guide from the homepage without losing navigation', () => {
  mount(<App />);
  fireEvent.click(
    screen.getByRole('link', {name: 'React Native로 시작하기 ↗'}),
  );
  expect(window.location.pathname).toBe('/woosign/react-native/');
  expect(
    screen.getByRole('heading', {name: '앱에서도, WooSign.'}),
  ).toBeInTheDocument();
  expect(document.title).toContain('React Native');
});
it('preserves old hash links as clean URLs', () => {
  window.location.hash = '#/components/button';
  mount(<App />);
  expect(window.location.pathname).toBe('/woosign/components/button/');
  expect(window.location.hash).toBe('');
  expect(screen.getByRole('button', {name: '시작하기 ↗'})).toBeEnabled();
});
it('opens a detail page directly by pathname', () => {
  window.history.replaceState(null, '', '/woosign/components/slider/');
  mount(<App />);
  expect(screen.getByRole('slider', {name: '볼륨'})).toBeInTheDocument();
});
it('groups all components in a navigable sitemap', () => {
  window.history.replaceState(null, '', '/woosign/sitemap/');
  mount(<App />);
  for (const name of names)
    expect(
      screen.getByRole('link', {name: new RegExp('^' + name + ' ')}),
    ).toHaveAttribute(
      'href',
      '/woosign/components/' + name.toLowerCase() + '/',
    );
});
it('does not load the film when reduced motion is requested', () => {
  window.matchMedia = jest.fn().mockReturnValue({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
  const {container} = mount(<App />);
  expect(container.querySelector('video')).not.toBeInTheDocument();
  expect(container.querySelector('.cinema-atmosphere')).toHaveStyle({
    backgroundImage: 'url(/woosign/media/woosign-paper-ink-poster.png)',
  });
});
it('keeps the custom poster visible when video loading fails', () => {
  const {container} = mount(<App />);
  const video = container.querySelector('video')!;
  expect(video).toHaveAttribute('src', '/woosign/media/woosign-paper-ink-hero.mp4');
  expect(video).toHaveAttribute('poster', '/woosign/media/woosign-paper-ink-poster.png');
  fireEvent.error(video);
  expect(container.querySelector('video')).not.toBeInTheDocument();
  expect(container.querySelector('.cinema-atmosphere')).toHaveStyle({
    backgroundImage: 'url(/woosign/media/woosign-paper-ink-poster.png)',
  });
});
it('updates route when browser back navigation fires', () => {
  mount(<App />);
  fireEvent.click(
    screen.getByRole('link', {name: 'React Native로 시작하기 ↗'}),
  );
  window.history.replaceState(null, '', '/woosign/tokens/');
  fireEvent(window, new PopStateEvent('popstate'));
  expect(screen.getByRole('heading', {name: '팔레트'})).toBeInTheDocument();
});
it('restores saved dark theme on mount', () => {
  localStorage.setItem('woosign-theme', 'dark');
  mount(<App />);
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(localStorage.getItem('woosign-theme')).toBe('dark');
});

it.each(['/', '/react-native', '/components/button', '/components/calendar'])(
  'hydrates prerendered %s without replacing the page',
  async route => {
    window.history.replaceState(
      null,
      '',
      '/woosign' + (route === '/' ? '/' : route + '/'),
    );
    const container = document.createElement('div');
    container.innerHTML = prerender(route);
    document.body.appendChild(container);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(
        container,
        <StrictMode>
          <ThemeProvider>
            <ToastProvider>
              <App initialRoute={route} />
            </ToastProvider>
          </ThemeProvider>
        </StrictMode>,
        {onRecoverableError: error => errors.push(error)},
      );
    });
    expect(errors).toEqual([]);
    await act(async () => root!.unmount());
    container.remove();
  },
);
it('does not override in-page anchor scrolling', () => {
  mount(<App />);
  (window.scrollTo as jest.Mock).mockClear();
  window.history.replaceState(null, '', '/woosign/#shared-api');
  fireEvent(window, new HashChangeEvent('hashchange'));
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(
    screen.getByRole('heading', {name: 'One language. Web & Native.'}),
  ).toBeInTheDocument();
});
