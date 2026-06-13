# React Native 테스트 하니스 설계

> @woosign/ui — 네이티브(`.native.tsx`) 컴포넌트 동작을 jest로 검증하는 세 번째 테스트
> 프로젝트를 추가한다. 기존 `tokens`(node) / `web`(jsdom) 프로젝트는 무손상으로 둔다.

## 목표

`@testing-library/react-native` + RN jest 프리셋으로 네이티브 컴포넌트의 **동작**을
단위 테스트한다. 첫 대상은 오버레이 2종(BottomSheet, Dialog) — 로직이 가장 많아
투자 대비 효과가 크다.

## 비목표 (이번 범위 제외 — 의도적 한계)

- **실제 스크롤/레이아웃 검증 불가.** RN 프리셋은 `Modal`·`ScrollView`를 자식만
  렌더하는 `View`로 목킹한다(`react-native/jest/mockModal.js`,
  `mockScrollView.js`). 따라서 "긴 콘텐츠가 maxHeight 안에서 스크롤되는지" 같은
  Yoga 레이아웃 거동은 단위 테스트로 잡을 수 없다. 검증 가능한 것은 동작(콜백,
  조건부 렌더, props 배선)이다. 실기기 확인은 별개로 남는다.
- 제스처 시뮬레이션(PanResponder 실제 드래그) — RTL은 제스처 좌표 흐름을
  재현하지 않는다. `shouldDismiss` 자체는 이미 node 단위 테스트가 있으므로
  네이티브에서는 "핸들이 PanResponder 핸들러를 부착했는지"까지만 검증한다.
- 나머지 17개 컴포넌트의 네이티브 테스트 — 추후 점진 확대.
- 스냅샷 테스트 — 회귀 노이즈가 커서 채택하지 않는다. 명시적 동작 단언만 쓴다.

## 아키텍처

### 세 번째 jest 프로젝트 `native`

`jest.config.js`의 `projects: []` 배열에 추가. 기존 두 프로젝트는 ts-jest를
쓰지만, `native`는 **babel-jest**를 쓴다 — RN 소스가 flow 타입 미트랜스파일
상태로 배포되므로 ts-jest로는 변환 불가, RN 프리셋의 babel 변환 + transformIgnore가
필요하기 때문이다.

```js
{
  displayName: 'native',
  preset: 'react-native',           // babel-jest + transformIgnorePatterns + Modal/ScrollView 목 + haste
  setupFilesAfterEnv: ['<rootDir>/jest.native.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.native.test.tsx'],
  moduleFileExtensions: [           // native.tsx 우선 (web 프로젝트의 거울)
    'native.tsx', 'native.ts',
    'tsx', 'ts', 'jsx', 'js', 'json',
  ],
}
```

- `preset: 'react-native'`는 `transform`(babel-jest), `transformIgnorePatterns`,
  `setupFiles`(react-native-env.js), `haste`, `testEnvironment: 'node'`을 한 번에
  설정한다. 프로젝트 단위 `preset`은 jest 29에서 지원된다.
- babel 변환은 루트 `babel.config.js`를 사용한다(이미 `@react-native/babel-preset`
  + reanimated plugin 포함, reanimated 3.19.5 설치됨). 별도 babel 설정 불필요.
- `web` 프로젝트가 `jest.setup.ts`(jest-dom, PointerEvent 폴리필)를 쓰는 것과 분리
  — `native`는 자체 `jest.native.setup.ts`만 쓴다(jest-dom은 DOM 전용이라 native에
  로드하면 안 됨).

### jest.native.setup.ts (신규)

```ts
// @testing-library/react-native의 jest 매처(toBeOnTheScreen 등) 등록.
import '@testing-library/react-native/extend-expect';
```

## 패키지 변경

- `package.json` devDependencies에 `@testing-library/react-native@13.3.3` 추가.
  - v13.3.3 선택 이유: peer가 `react-test-renderer >=18.2.0`(설치된 19.0.0과
    호환) + React 19 + RN 0.78 + jest 29를 만족한다. v14는 jest 30 의존성과 새
    `test-renderer@^1.0.0` peer를 요구해 현재 jest 29 환경과 충돌하므로 제외.
  - `react-test-renderer@19.0.0`는 이미 설치되어 있어 추가 불필요.
- `files` 배열은 이미 `*.test.tsx`와 `jest.setup.ts`를 tarball에서 제외한다.
  `jest.native.setup.ts`도 동일 패턴으로 제외되도록 `!jest.native.setup.ts`를
  추가한다(누락 시 게시물에 setup 파일이 섞일 수 있음 — CI tarball 검증과 일치).

## 테스트 커버리지

### `src/components/BottomSheet/BottomSheet.native.test.tsx` (신규)

`@testing-library/react-native`의 `render`/`screen`/`fireEvent` 사용. 컴포넌트는
`./BottomSheet.native`에서 직접 import(플랫폼 명시, facade 해석 의존 제거).

1. `open={false}`이면 콘텐츠 미렌더.
2. `open`이면 Title/Body 텍스트 렌더.
3. scrim press → `onClose` 호출 (testID `${testID}-scrim`).
4. `closeOnScrimClick={false}`이면 scrim press해도 `onClose` 미호출.
5. Android back(`Modal`의 `onRequestClose`) → `onClose` 호출.
   `closeOnEsc={false}`이면 미호출. (Modal 목이 `onRequestClose`를 prop으로
   노출하는지에 의존 — 노출 안 하면 이 두 케이스는 표면 prop 단언으로 대체.)
6. `dragToClose={true}`(기본)이면 핸들(testID `${testID}-handle`) 렌더,
   `false`이면 미렌더.
7. 표면 press → `onClose` 미호출(전파 차단 확인).
8. 서브컴포넌트(Header/Title/Description/Body/Footer) 텍스트 렌더 +
   Body가 `flexShrink:1`을 포함한 스타일을 받는지 확인(스크롤 회귀 방지의
   prop-레벨 대체 검증).

### `src/components/Dialog/Dialog.native.test.tsx` (신규)

Dialog 웹 테스트(9개)를 네이티브로 미러링: open/close 렌더, scrim press→onClose,
`closeOnScrimClick=false`, `onRequestClose`(back)→onClose & `closeOnEsc=false`,
표면 press 전파 차단, 서브컴포넌트 렌더 + standalone named export 존재 확인.
(aria 관련 테스트는 web 전용이므로 제외 — native는 aria 미사용.)

## CI

기존 `pnpm test`가 `jest`를 호출하고 jest가 세 프로젝트를 모두 실행하므로 CI의
"Smoke tests" 스텝에 자동 포함된다. 별도 스크립트·워크플로 수정 불필요.

## 검증 (이 작업의 완료 기준)

- `pnpm test` — 세 프로젝트 모두 그린(`native` 프로젝트가 새로 잡혀야 함).
- `pnpm test -- --selectProjects native` — 네이티브 테스트만 실행해 통과.
- `pnpm typecheck` — 클린(테스트 파일 포함).
- `pnpm build` — 영향 없음(테스트 파일은 빌드 제외).

## 리스크와 완화

- **RN 프리셋 + ts-jest 프로젝트 혼재.** 세 번째 프로젝트만 babel-jest를 쓰고
  나머지는 ts-jest 그대로 — jest `projects`는 프로젝트별 transform을 독립
  적용하므로 충돌 없음. 첫 실행에서 transformIgnorePatterns로 인한 RN 모듈 변환
  에러가 나면 프리셋 기본값을 신뢰하고(이미 RN이 제공) 테스트 파일 import 경로만
  점검한다.
- **Modal 목의 `onRequestClose` 노출 여부 불확실.** `react-native/jest/mockModal.js`가
  back 핸들러를 어떻게 노출하는지에 따라 케이스 5의 단언 방식이 갈린다. 구현 시
  목의 실제 동작을 확인해 (a) 핸들러 직접 호출 또는 (b) Modal에 전달된 prop 단언
  중 동작하는 쪽을 택한다. 플랜에 이 분기를 명시한다.
