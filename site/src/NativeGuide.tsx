import {pagePath} from './routes';
export const nativeExample = `import {useState} from 'react';
import {View} from 'react-native';
import {ThemeProvider, Button, Checkbox, Text} from 'woosign-system';

function DailyRoutine() {
  const [done, setDone] = useState(false);
  return (
    <View style={{padding: 24, gap: 16}}>
      <Text variant="h2">오늘의 작은 목표</Text>
      <Checkbox checked={done} onCheckedChange={setDone}
        label="작은 목표 하나 끝내기" />
      <Button onPress={() => setDone(true)}>완료하기</Button>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultColorScheme="light">
      <DailyRoutine />
    </ThemeProvider>
  );
}`;
export function NativeGuide({
  Code,
}: {
  Code: (props: {children: string}) => React.ReactNode;
}) {
  return (
    <section className="page guide native-guide">
      <div className="page-heading">
        <div className="platform-badges native-badges">
          <span>React Native</span>
          <span>iOS</span>
          <span>Android</span>
        </div>
        <h1>
          앱에서도,
          <br />
          WooSign.
        </h1>
        <p>
          React Native를 위한 네이티브 구현을 제공합니다. 같은 컴포넌트 이름과
          공통 API로 Web·iOS·Android 화면을 연결하세요.
        </p>
      </div>
      <div className="native-intro">
        <div>
          <h2>웹 뷰를 감싸지 않습니다.</h2>
          <p>
            웹에서는 DOM, React Native에서는 View·Text·Pressable 같은 네이티브
            요소로 렌더링합니다. Metro가 네이티브 구현을 선택합니다.
          </p>
        </div>
        <div>
          <h2>API는 함께, 화면은 각자.</h2>
          <p>
            onPress, checked, onCheckedChange 같은 공통 API를 공유하고, 플랫폼에
            맞는 레이아웃과 style을 사용합니다.
          </p>
        </div>
      </div>
      <article>
        <span className="step">01</span>
        <h2>패키지 설치</h2>
        <p>React Native 0.78 이상 프로젝트에서 시작하세요.</p>
        <Code>{'npm install woosign-system'}</Code>
        <p>
          기존 React Native 프로젝트의 네이티브 빌드 설정을 사용합니다. 앱의
          실행 환경별 설정은 설치 가이드에서 확인하세요.
        </p>
        <a
          className="text-link"
          href="https://github.com/woobottle/woosign-system#readme"
          target="_blank"
          rel="noreferrer">
          네이티브 설치 가이드 ↗
        </a>
      </article>
      <article>
        <span className="step">02</span>
        <h2>네이티브 화면 만들기</h2>
        <p>ThemeProvider와 실제 React Native 레이아웃을 함께 사용합니다.</p>
        <Code>{nativeExample}</Code>
      </article>
      <article>
        <span className="step">03</span>
        <h2>폰트와 테마 연결</h2>
        <p>
          Web 폰트 CSS는 네이티브 앱에 적용되지 않습니다. 번들에 포함된
          Woobottle TTF를 Expo font loader 또는 iOS·Android 프로젝트에
          등록하세요. 기본 한국어 본문은 시스템 글꼴을 사용합니다.
        </p>
        <Code>{`import {useTheme, Button} from 'woosign-system';

export function ThemeSwitch() {
  const {toggleColorScheme} = useTheme();
  return <Button onPress={toggleColorScheme}>테마 전환</Button>;
}`}</Code>
        <a
          className="text-link"
          href="https://github.com/woobottle/woosign-system/tree/main/src/assets/fonts"
          target="_blank"
          rel="noreferrer">
          번들 폰트와 등록 안내 ↗
        </a>
      </article>
      <article>
        <h2>플랫폼별로 확인하세요.</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>영역</th>
                <th>Web</th>
                <th>React Native</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>렌더링</td>
                <td>DOM 요소</td>
                <td>네이티브 UI 요소</td>
              </tr>
              <tr>
                <td>레이아웃</td>
                <td>CSS / HTML</td>
                <td>View / StyleSheet</td>
              </tr>
              <tr>
                <td>스타일</td>
                <td>style, className</td>
                <td>style</td>
              </tr>
              <tr>
                <td>인터랙션</td>
                <td>마우스·키보드</td>
                <td>터치·네이티브 접근성</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          이 사이트의 플레이그라운드는 웹 구현을 실행합니다. 네이티브 동작과
          레이아웃은 iOS·Android 앱에서 확인하세요.
        </p>
        <a className="action" href={pagePath('/components')}>
          공통 컴포넌트 둘러보기 ↗
        </a>
      </article>
    </section>
  );
}
