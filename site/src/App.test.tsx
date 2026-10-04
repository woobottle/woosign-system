import {render, screen, fireEvent, cleanup} from '@testing-library/react';
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
  window.location.hash = '#/';
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
