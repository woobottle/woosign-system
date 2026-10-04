import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import {ThemeProvider, ToastProvider} from 'woosign-system';
import {App} from './App';
import {pages, pagePath, origin} from './routes';
export const routes = pages.map(page => ({
  ...page,
  path: pagePath(page.route),
  canonical: origin + pagePath(page.route),
}));
export function render(route: string) {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <ToastProvider>
          <App initialRoute={route} />
        </ToastProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
