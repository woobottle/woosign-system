import {useEffect, useState, useRef} from 'react';
import * as W from 'woosign-system';
import {Demo, descriptions, groups, names, type ComponentName} from './demos';
import catalog from './catalog.json';
import {CinematicHero} from './CinematicHero';
import {NativeGuide} from './NativeGuide';
import {
  basePath,
  pagePath,
  readRoute,
  componentRoute,
  metadata,
  origin,
} from './routes';

const url = (name: string) => pagePath(componentRoute(name));
const github = 'https://github.com/woobottle/woosign-system';
function Code({children}: {children: string}) {
  const [status, setStatus] = useState('복사');
  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setStatus('복사 완료');
    } catch {
      setStatus('코드를 선택해 복사하세요');
    }
  }
  return (
    <div className="code">
      <button onClick={copy} aria-live="polite">
        {status}
      </button>
      <pre tabIndex={0}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
function Directory({selected}: {selected?: string}) {
  const [search, setSearch] = useState('');
  const filtered = names.filter(n =>
    `${n} ${descriptions[n]}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <label className="search">
        <span>⌕</span>
        <input
          aria-label="컴포넌트 검색"
          placeholder="컴포넌트 검색…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <kbd>50</kbd>
      </label>
      {Object.entries(groups).map(([group, items]) => (
        <div className="directory-group" key={group}>
          <h3>{group}</h3>
          {items
            .filter(n => filtered.includes(n))
            .map(n => (
              <a
                key={n}
                href={url(n)}
                aria-current={selected === n ? 'page' : undefined}>
                {n}
                <span>↗</span>
              </a>
            ))}
        </div>
      ))}
      {!filtered.length && <p className="muted">검색 결과가 없습니다.</p>}
    </>
  );
}
function Home() {
  const [done, setDone] = useState(false);
  return (
    <>
      <CinematicHero />
      <section className="hero shared-api" id="shared-api">
        <div className="shared-api-copy">
          <div className="platform-badges native-badges">
            <span>React Web</span>
            <span>React Native</span>
          </div>
          <h2>
            같은 API.
            <br />
            각자의 화면.
          </h2>
          <p>
            Button, Checkbox, Card부터 디자인 토큰까지.
            <br />
            웹과 네이티브 앱에서 같은 이름, 같은 API로 사용하세요.
          </p>
          <Code>{`import {Button} from 'woosign-system';

<Button onPress={handlePress}>시작하기</Button>`}</Code>
          <a className="text-link" href="/woosign/react-native/">
            iOS · Android 사용법 보기 ↗
          </a>
          <p className="preview-disclosure">
            옆의 데모는 실제 웹 구현입니다. 네이티브 구현은 React Native 앱에서
            렌더링됩니다.
          </p>
        </div>
        <div className="hero-specimen">
          <div className="specimen-label">
            A LITTLE EVERY DAY <span>01 / LIVE PREVIEW</span>
          </div>
          <div className="specimen-content">
            <W.Eyebrow tone="brand">YOUR DAILY SPACE</W.Eyebrow>
            <h2>
              작은 걸음,
              <br />
              좋은 하루.
            </h2>
            <p className="muted">당신의 속도로 완성해 가세요.</p>
            <W.Card variant="warm">
              <W.CardHeader>
                <div className="between">
                  <W.Badge variant="gold">오늘의 루틴</W.Badge>
                  <span className="muted">{done ? '3' : '2'} / 3</span>
                </div>
              </W.CardHeader>
              <W.CardContent>
                <div className="demo-stack">
                  <W.Checkbox
                    checked
                    label="나를 위한 시간 10분"
                    onCheckedChange={() => {}}
                  />
                  <W.Checkbox
                    checked
                    label="새로운 영감 하나 모으기"
                    onCheckedChange={() => {}}
                  />
                  <W.Checkbox
                    checked={done}
                    onCheckedChange={setDone}
                    label="작은 목표 하나 끝내기"
                  />
                  <W.Progress value={done ? 100 : 66} tone="gold" />
                </div>
              </W.CardContent>
            </W.Card>
            <div className="specimen-footer">
              <W.AvatarGroup
                items={[{name: 'Woo'}, {name: 'Paper'}, {name: 'Ink'}]}
              />
              <span>좋은 경험을 함께.</span>
              <W.StatusDot tone="success" />
            </div>
          </div>
          <div className="specimen-note">
            <span>↖ 체크박스를 눌러보세요</span>
            <span>실제 컴포넌트로 만든 화면</span>
          </div>
        </div>
      </section>
      <section className="home-map">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE WOOSIGN</p>
            <h2>필요한 곳부터 시작하세요.</h2>
          </div>
          <a className="text-link" href="/woosign/sitemap/">
            전체 사이트맵 보기 ↗
          </a>
        </div>
        <div className="home-map-grid">
          {[
            [
              '/getting-started',
              '시작하기',
              '설치부터 첫 화면까지, Web·Native 예제를 따라 시작하세요.',
            ],
            [
              '/react-native',
              'React Native',
              'iOS·Android 설정과 네이티브 UI 사용법을 확인하세요.',
            ],
            [
              '/components',
              '컴포넌트',
              '50개 실제 데모를 조작하고 사용 코드를 가져가세요.',
            ],
            [
              '/tokens',
              '디자인 토큰',
              '같은 팔레트, 글자, 여백으로 화면을 연결하세요.',
            ],
          ].map(([path, title, description]) => (
            <a key={path} href={pagePath(path)}>
              <h3>
                {title}
                <span>↗</span>
              </h3>
              <p>{description}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="manifesto">
        <p className="eyebrow">ONE LANGUAGE. MANY POSSIBILITIES.</p>
        <div className="manifesto-grid">
          <h2>
            익숙한 API.
            <br />
            일관된 경험.
          </h2>
          <p>
            크림색 캔버스, 깊은 잉크, 따뜻한 엠버.
            <br />
            화면마다 같은 디자인 언어를 쓰고,
            <br />
            제품의 이야기에 집중하세요.
          </p>
          <div className="stat">
            <strong>50</strong>
            <span>컴포넌트 · 두 플랫폼</span>
          </div>
        </div>
      </section>
      <section className="home-picks">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE BUILDING BLOCKS</p>
            <h2>작은 요소에서 시작하세요.</h2>
          </div>
          <a className="text-link" href="/woosign/components/">
            전체 컴포넌트 →
          </a>
        </div>
        <div className="pick-grid">
          {(['Button', 'Card', 'Input', 'AvatarGroup'] as ComponentName[]).map(
            name => (
              <article className="pick" key={name}>
                <div className="pick-preview">
                  <Demo name={name} />
                </div>
                <a href={url(name)}>
                  <strong>{name}</strong>
                  <span>↗</span>
                </a>
                <p>{descriptions[name]}</p>
              </article>
            ),
          )}
        </div>
      </section>
      <section className="closing">
        <W.Eyebrow tone="inverse">MAKE SOMETHING GOOD.</W.Eyebrow>
        <h2>
          Your next screen
          <br />
          starts here.
        </h2>
        <a className="action light" href="/woosign/getting-started/">
          설치하고 시작하기 ↗
        </a>
      </section>
    </>
  );
}
function Gallery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const filtered = names.filter(
    n =>
      (category === '전체' ||
        (groups[category as keyof typeof groups] as readonly string[]).includes(
          n,
        )) &&
      `${n} ${descriptions[n]}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">THE COMPONENT LIBRARY</p>
        <h1>
          작은 디테일,
          <br />
          <em>50가지 가능성.</em>
        </h1>
        <p>직접 눌러보고, 조합하고, 당신의 화면으로 가져가세요.</p>
      </div>
      <div className="gallery-toolbar">
        <label className="search">
          <span>⌕</span>
          <input
            aria-label="갤러리 검색"
            placeholder="이름이나 기능으로 검색…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
        <span className="muted" aria-live="polite">
          {filtered.length}개 컴포넌트
        </span>
      </div>
      <div className="filters" aria-label="컴포넌트 분류">
        {['전체', ...Object.keys(groups)].map(c => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {filtered.map(name => (
          <article className="gallery-card" key={name}>
            <div className="gallery-preview">
              <Demo name={name} />
            </div>
            <div className="gallery-info">
              <a href={url(name)}>
                <h2>{name}</h2>
                <span>↗</span>
              </a>
              <p>{descriptions[name]}</p>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <W.EmptyState
          title="검색 결과가 없어요"
          description="다른 이름이나 기능으로 검색해 보세요."
          action={
            <W.Button
              onPress={() => {
                setQuery('');
                setCategory('전체');
              }}>
              필터 초기화
            </W.Button>
          }
        />
      )}
    </section>
  );
}
function Detail({name}: {name: ComponentName}) {
  const [disabled, setDisabled] = useState(false);
  const [variant, setVariant] = useState<'default' | 'outline' | 'secondary'>(
    'default',
  );
  const props = catalog.props[name];
  return (
    <div className="workbench">
      <aside className="desktop-directory">
        <Directory selected={name} />
      </aside>
      <main className="component-detail">
        <details className="mobile-directory">
          <summary>다른 컴포넌트 보기</summary>
          <Directory selected={name} />
        </details>
        <p className="eyebrow">
          COMPONENT /{' '}
          {
            Object.entries(groups).find(([, items]) =>
              (items as readonly string[]).includes(name),
            )?.[0]
          }
        </p>
        <h1>{name}</h1>
        <p className="detail-description">{descriptions[name]}.</p>
        <div className="preview-frame">
          <div className="preview-toolbar">
            <span>
              <span className="ember-dot" /> LIVE PREVIEW
            </span>
            <span>WEB</span>
          </div>
          <div className="detail-preview">
            <Demo name={name} disabled={disabled} variant={variant} />
          </div>
        </div>
        <div className="controls">
          <span className="eyebrow">PLAYGROUND</span>
          {[
            'Button',
            'Chip',
            'Pill',
            'Fab',
            'Input',
            'Textarea',
            'Select',
            'Checkbox',
            'Radio',
            'Switch',
            'Slider',
            'InputOTP',
            'Combobox',
            'Calendar',
            'DatePicker',
            'Pagination',
            'SegmentedControl',
            'Toggle',
            'ToggleGroup',
          ].includes(name) ? (
            <label>
              <input
                type="checkbox"
                checked={disabled}
                onChange={e => setDisabled(e.target.checked)}
              />{' '}
              Disabled
            </label>
          ) : (
            <span className="muted">
              미리보기 안의 요소를 직접 조작해 보세요.
            </span>
          )}
          {name === 'Button' && (
            <label>
              Variant{' '}
              <select
                value={variant}
                onChange={e => setVariant(e.target.value as typeof variant)}>
                <option>default</option>
                <option>outline</option>
                <option>secondary</option>
              </select>
            </label>
          )}
        </div>
        <h2 className="subheading">사용 코드</h2>
        <Code>
          {catalog.snippets[name]
            .replace('disabled={false}', `disabled={${disabled}}`)
            .replace('variant="default"', `variant="${variant}"`)}
        </Code>
        <div className="between">
          <h2 className="subheading">API</h2>
          <a
            className="text-link"
            href={`${github}/blob/main/src/components/${name}/types.ts`}
            target="_blank"
            rel="noreferrer">
            타입 정의 ↗
          </a>
        </div>
        {props.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>필수</th>
                </tr>
              </thead>
              <tbody>
                {props.map(p => (
                  <tr key={p.name}>
                    <td>
                      <code>{p.name}</code>
                    </td>
                    <td>
                      <code>{p.type}</code>
                    </td>
                    <td>{p.required ? '●' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            기본 입력 속성을 지원합니다. 전체 타입 정의에서 세부 속성을
            확인하세요.
          </p>
        )}
        <p className="api-note">
          공통 API 기준입니다. 플랫폼별 style, className 및 세부 타입은 타입
          정의에서 확인하세요.
        </p>
        <a className="text-link" href="/woosign/components/">
          ← 전체 컴포넌트로 돌아가기
        </a>
      </main>
    </div>
  );
}
function Tokens() {
  const {theme} = W.useTheme();
  const colors = theme.colorScheme === 'dark' ? W.darkColors : W.colors;
  const palettes = [
    ['Cream', W.cream],
    ['Ink', W.ink],
    ['Ember', W.ember],
    ['Forest', W.forest],
  ] as const;
  return (
    <section className="page tokens-page">
      <div className="page-heading">
        <p className="eyebrow">THE FOUNDATION</p>
        <h1>
          Paper, Ink
          <br />& <em>everything between.</em>
        </h1>
        <p>색상부터 여백까지. 같은 언어로 화면을 연결하는 디자인 토큰.</p>
      </div>
      <h2 className="subheading">팔레트</h2>
      <div className="palette-grid">
        {palettes.map(([name, palette]) => (
          <div key={name}>
            <h3>{name}</h3>
            {Object.entries(palette).map(([step, color]) => (
              <div className="swatch" key={step}>
                <span style={{background: color}} />
                <strong>{step}</strong>
                <code>{color}</code>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h2 className="subheading">
        시맨틱 컬러 <span className="muted">/ {theme.colorScheme}</span>
      </h2>
      <p className="muted">
        오른쪽 위 테마 버튼으로 실제 색상 매핑을 비교하세요.
      </p>
      <div className="semantic-grid">
        {Object.entries(colors).map(([name, color]) => (
          <div className="semantic" key={name}>
            <span style={{background: color}} />
            <div>
              <strong>{name}</strong>
              <code>{color}</code>
            </div>
          </div>
        ))}
      </div>
      <h2 className="subheading">타이포그래피</h2>
      <div className="type-scale">
        {Object.entries(W.typography.fontSize).map(([name, value]) => (
          <div key={name}>
            <code>
              {name} · {value.size}/{value.lineHeight}
            </code>
            <span
              style={{
                fontSize: value.size,
                lineHeight: `${value.lineHeight}px`,
              }}>
              Good things.
            </span>
          </div>
        ))}
      </div>
      <h2 className="subheading">여백</h2>
      <div className="spacing-scale">
        {Object.entries(W.wbSpace).map(([key, value]) => (
          <div key={key}>
            <code>wbSpace.{key}</code>
            <span style={{width: value}} />
            <code>{value}px</code>
          </div>
        ))}
      </div>
      <h2 className="subheading">모서리</h2>
      <div className="radius-grid">
        {Object.entries(W.borderRadius).map(([key, value]) => (
          <div key={key}>
            <span style={{borderRadius: value}} />
            <code>
              {key} · {value}px
            </code>
          </div>
        ))}
      </div>
      <h2 className="subheading">그림자</h2>
      <div className="shadow-grid">
        {(['card', 'navigation', 'floating', 'modal'] as const).map(key => (
          <div key={key}>
            <div style={{boxShadow: W.shadowsCss[key]}}>{key}</div>
            <code>{W.shadowsCss[key]}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
function GettingStarted() {
  return (
    <section className="page guide">
      <div className="page-heading">
        <p className="eyebrow">YOUR FIRST SCREEN</p>
        <h1>
          좋은 시작을 위한
          <br />
          <em>작은 준비.</em>
        </h1>
        <p>
          하나의 패키지, 익숙한 React API. 지금 첫 번째 화면을 만들어 보세요.
        </p>
      </div>
      <article>
        <span className="step">01</span>
        <h2>설치하기</h2>
        <p>
          React 18 이상을 사용하는 프로젝트에서 설치하세요. React Native에서는
          네이티브 구현이 자동으로 선택됩니다.
        </p>
        <Code>
          {'npm install woosign-system\n\n# 또는\npnpm add woosign-system'}
        </Code>
      </article>
      <article>
        <span className="step">02</span>
        <h2>테마 연결하기</h2>
        <p>
          ThemeProvider로 앱을 감싸면 컴포넌트에 일관된 테마가 적용됩니다.
          알림을 사용할 때는 ToastProvider를 추가하세요.
        </p>
        <Code>{`import {ThemeProvider, ToastProvider, Button} from 'woosign-system';\n\nexport default function App() {\n  return (\n    <ThemeProvider defaultColorScheme="light">\n      <ToastProvider>\n        <Button onPress={() => console.log('Hello!')}>시작하기</Button>\n      </ToastProvider>\n    </ThemeProvider>\n  );\n}`}</Code>
      </article>
      <article>
        <span className="step">03</span>
        <h2>Web과 Native에서 사용하기</h2>
        <p>
          플랫폼에 맞는 레이아웃을 사용하면서 Button, Card, Input 등에는 같은
          API를 전달합니다.
        </p>
        <h3>React / Web</h3>
        <Code>{`import {Button, Text} from 'woosign-system';\n\nexport function Welcome() {\n  return (\n    <main style={{padding: 24}}>\n      <Text variant="h2">Hello, Paper & Ink.</Text>\n      <Button onPress={() => console.log('Web')}>시작하기</Button>\n    </main>\n  );\n}`}</Code>
        <h3>React Native</h3>
        <Code>{`import {View} from 'react-native';\nimport {Button, Text} from 'woosign-system';\n\nexport function Welcome() {\n  return (\n    <View style={{padding: 24}}>\n      <Text variant="h2">Hello, Paper & Ink.</Text>\n      <Button onPress={() => console.log('Native')}>시작하기</Button>\n    </View>\n  );\n}`}</Code>
        <p>
          네이티브 폰트 등록과 환경별 설정은 저장소 README의 가이드를
          확인하세요.
        </p>
        <a
          className="text-link"
          href={`${github}#readme`}
          target="_blank"
          rel="noreferrer">
          전체 설치 가이드 ↗
        </a>
      </article>
      <article>
        <span className="step">04</span>
        <h2>나만의 화면 만들기</h2>
        <p>
          컴포넌트의 상태를 바꾸고, 사용 코드를 복사하고, 제품의 이야기를
          담아보세요.
        </p>
        <a className="action" href="/woosign/components/">
          컴포넌트 둘러보기 ↗
        </a>
      </article>
    </section>
  );
}
function SiteMap() {
  return (
    <section className="page sitemap-page">
      <div className="page-heading">
        <p className="eyebrow">FIND YOUR NEXT SCREEN</p>
        <h1>WooSign 사이트맵</h1>
        <p>
          React Web부터 React Native까지. 필요한 문서와 컴포넌트로 바로
          이동하세요.
        </p>
      </div>
      <div className="site-map-main">
        {[
          ['/', '홈'],
          ['/getting-started', '시작하기'],
          ['/react-native', 'React Native · iOS & Android'],
          ['/tokens', '디자인 토큰'],
          ['/components', '컴포넌트 갤러리'],
        ].map(([path, label]) => (
          <a key={path} href={pagePath(path)}>
            {label}
            <span>↗</span>
          </a>
        ))}
      </div>
      <h2 className="subheading">50개 컴포넌트</h2>
      <div className="site-map-groups">
        {Object.entries(groups).map(([group, items]) => (
          <section key={group}>
            <h3>{group}</h3>
            {items.map(name => (
              <a key={name} href={url(name)}>
                <strong>{name}</strong>
                <span>{descriptions[name]}</span>
              </a>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}
function initialTheme(): 'light' | 'dark' {
  try {
    return localStorage.getItem('woosign-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}
export function App({initialRoute}: {initialRoute?: string} = {}) {
  const [route, setRoute] = useState(() => initialRoute ?? readRoute());
  const routeRef = useRef(route);
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [savedScheme] = useState(initialTheme);
  useEffect(() => setScheme(savedScheme), [savedScheme]);
  const {setColorScheme} = W.useTheme();
  useEffect(() => {
    const update = () => {
      const next = readRoute();
      if (window.location.hash.startsWith('#/'))
        window.history.replaceState(null, '', pagePath(next));
      const previous = routeRef.current;
      routeRef.current = next;
      setRoute(next);
      if (previous !== next) window.scrollTo?.(0, 0);
    };
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest?.('a');
      if (!link || link.target || link.hasAttribute('download')) return;
      const target = new URL(link.href, window.location.href);
      if (
        target.origin !== window.location.origin ||
        !target.pathname.startsWith(basePath) ||
        target.hash
      )
        return;
      event.preventDefault();
      window.history.pushState(null, '', target.pathname + target.search);
      update();
    };
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    document.addEventListener('click', click);
    if (window.location.hash.startsWith('#/')) update();
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
      document.removeEventListener('click', click);
    };
  }, []);
  useEffect(() => {
    setColorScheme(scheme);
    document.documentElement.dataset.theme = scheme;
    try {
      localStorage.setItem('woosign-theme', scheme);
    } catch {
      /* Storage is optional. */
    }
  }, [scheme, setColorScheme]);
  const name = names.find(n => route === componentRoute(n));
  const page =
    route === '/'
      ? 'home'
      : route === '/components' || name
      ? 'components'
      : route === '/tokens'
      ? 'tokens'
      : route === '/getting-started'
      ? 'getting-started'
      : route === '/react-native'
      ? 'react-native'
      : route === '/sitemap'
      ? 'sitemap'
      : 'unknown';
  useEffect(() => {
    const info = metadata(route);
    document.title = info.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', info.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', info.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', info.description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', origin + pagePath(route));
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', origin + pagePath(route));
  }, [route]);
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={event => {
          event.preventDefault();
          document.getElementById('content')?.focus();
          document.getElementById('content')?.scrollIntoView();
        }}>
        본문으로 건너뛰기
      </a>
      <header
        className={`site-header ${
          page === 'home' ? 'site-header-cinema' : ''
        }`}>
        <a className="brand" href="/woosign/" aria-label="WooSign 홈">
          <span className="brand-mark">w.</span>
          <span>
            woosign<span className="brand-caption">PAPER & INK</span>
          </span>
        </a>
        <nav aria-label="주요 탐색">
          <a
            href="/woosign/react-native/"
            aria-current={page === 'react-native' ? 'page' : undefined}>
            React Native
          </a>
          <a
            href="/woosign/components/"
            aria-current={page === 'components' ? 'page' : undefined}>
            컴포넌트
          </a>
          <a
            href="/woosign/tokens/"
            aria-current={page === 'tokens' ? 'page' : undefined}>
            디자인 토큰
          </a>
          <a
            href="/woosign/getting-started/"
            aria-current={page === 'getting-started' ? 'page' : undefined}>
            시작하기
          </a>
        </nav>
        <div className="header-tools">
          <button
            className="theme-button"
            aria-label={
              scheme === 'light' ? '다크 테마로 변경' : '라이트 테마로 변경'
            }
            onClick={() => setScheme(scheme === 'light' ? 'dark' : 'light')}>
            {scheme === 'light' ? '◐' : '◑'}
          </button>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="github-link">
            GitHub ↗
          </a>
        </div>
      </header>
      <div id="content" tabIndex={-1}>
        {page === 'home' ? (
          <Home />
        ) : name ? (
          <Detail key={name} name={name} />
        ) : page === 'components' ? (
          <Gallery />
        ) : page === 'tokens' ? (
          <Tokens />
        ) : page === 'react-native' ? (
          <NativeGuide Code={Code} />
        ) : page === 'sitemap' ? (
          <SiteMap />
        ) : page === 'getting-started' ? (
          <GettingStarted />
        ) : (
          <section className="page">
            <W.EmptyState
              title="페이지를 찾을 수 없어요"
              description="아래 버튼으로 다시 시작해 보세요."
              action={
                <a className="action" href="/woosign/">
                  홈으로 돌아가기
                </a>
              }
            />
          </section>
        )}
      </div>
      <footer className="site-footer">
        <a className="brand footer-brand" href="/woosign/">
          woosign
          <span className="ember-dot" />
        </a>
        <p>작은 디테일로 만드는 좋은 경험.</p>
        <div>
          <span>v0.6.0 · Web + React Native</span>
          <a href="/woosign/sitemap/">사이트맵</a>
          <a href="https://woo-bottle.com/">WooBottle Labs ↗</a>
          <a
            href="https://www.npmjs.com/package/woosign-system"
            target="_blank"
            rel="noreferrer">
            npm ↗
          </a>
          <a href={github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </footer>
    </>
  );
}
