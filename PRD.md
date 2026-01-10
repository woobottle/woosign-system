# WooSign Design System (WDS) - PRD (v1.1)

## 1. 개요 (Overview)
**WooSign Design System**은 웹(React)과 모바일(React Native) 환경 모두에서 일관된 사용자 경험(UX)과 브랜드 아이덴티티를 제공하기 위한 크로스 플랫폼 디자인 시스템 **라이브러리**입니다.
단일 코드베이스(`Single Source of Truth`)를 지향하되, 플랫폼별 최적화된 UX를 제공하기 위해 **Facade Pattern**과 **File Extension Resolution** 기술을 사용합니다.

## 2. 목표 (Goals)
1.  **일관성 (Consistency):** 웹과 앱에서 동일한 디자인 토큰(Color, Typo, Spacing)을 공유하여 시각적 통일성을 보장한다.
2.  **생산성 (Productivity):** 개발자는 플랫폼 분기를 신경 쓰지 않고 `<Button />` 하나만 사용하여 비즈니스 로직에 집중한다.
3.  **확장성 (Scalability):** 새로운 컴포넌트 추가 시 정해진 패턴(Web/Native 분리)을 따르면 기존 시스템에 영향을 주지 않는다.
4.  **배포 자동화 (Distribution):** NPM 배포 및 디자인 검수 프로세스(Chromatic/Expo)를 자동화하여 협업 비용을 최소화한다.

## 3. 상세 요구사항 (Detailed Requirements)

### 3.1. 아키텍처 및 구현 패턴
*   **빌드 타임 분기 (Build-time Resolution):** 런타임(`Platform.OS`) 체크를 지양하고, 파일 확장자(`.web.tsx`, `.native.tsx`)를 통해 번들러가 빌드 시점에 적절한 코드를 선택하게 한다.
*   **Facade Component:**
    *   `Component.tsx` (또는 `index.ts`): 외부로 노출되는 인터페이스. 실제 구현은 없고 타입 정의와 플랫폼별 파일로의 연결만 담당한다.
    *   `Component.web.tsx`: `div`, `span`, `CSS` 등을 사용한 DOM 기반 구현.
    *   `Component.native.tsx`: `View`, `Text`, `StyleSheet` 등을 사용한 Native View 기반 구현.
*   **공통 인터페이스 (Common Interface):**
    *   모든 컴포넌트는 `ComponentProps` 인터페이스를 `types.ts`에 정의해야 한다.
    *   이벤트 핸들러 명명 규칙: Web의 `onClick` 대신 RN 친화적인 **`onPress`**를 표준으로 사용한다. (Web 구현체에서 `onClick`으로 매핑)

### 3.2. 디자인 시스템 토큰 (Design Tokens)
모든 스타일 값은 하드코딩하지 않고 `core/theme.ts`에 정의된 토큰을 참조한다.

*   **Colors:** Semantic Naming 사용 (e.g., `primary.main`, `text.secondary`, `background.paper`)
*   **Typography:** `fontSize`, `fontWeight`, `lineHeight`가 조합된 프리셋 사용 (e.g., `H1`, `Body1`, `Caption`)
*   **Spacing:** 4px 또는 8px 그리드 시스템 (e.g., `space.xs=4`, `space.md=16`)
*   **Radius:** 컴포넌트 둥글기 (e.g., `radius.sm=4`, `radius.round=999`)

### 3.3. 웹 구현 전략 (Web Strategy)
*   **No React Native Web:** `react-native-web` 라이브러리에 의존하지 않고, 순수 React + CSS(또는 Styled-components)로 커스텀 구현한다.
*   **Styling:** Class name 충돌 방지를 위해 **CSS Modules** 또는 **Styled-components**를 사용한다.

## 4. 기술 스택 및 구조 (Tech Stack & Structure)

### 4.1. 기술 스택
*   **Core:** React 18+, React Native 0.70+
*   **Language:** TypeScript 5.0+ (Strict Mode)
*   **Build Tool:** react-native-builder-bob
*   **Testing:** Jest, React Testing Library, Detox (E2E)
*   **Documentation/Dev:** Storybook v7+

### 4.2. 폴더 구조 (Directory Structure)
```
woosign/
├── package.json          # Exports 설정 (Web/Native 진입점 분리)
├── src/
│   ├── core/             # 디자인 토큰 및 공통 유틸리티
│   │   ├── theme/        # colors, spacing, typography
│   │   ├── hooks/        # 공통 Hooks (e.g., useTheme)
│   │   └── types.ts      # 전역 타입 정의
│   ├── components/       # UI 컴포넌트
│   │   ├── Button/
│   │   │   ├── Button.web.tsx    # Web 구현
│   │   │   ├── Button.native.tsx # Native 구현
│   │   │   ├── Button.stories.tsx# Storybook (공통 사용 가능시 통합, 불가시 분리)
│   │   │   └── types.ts          # Props 정의
│   │   └── index.ts      # 컴포넌트 export
│   └── index.ts          # 메인 진입점
├── example/              # 테스트 및 검수용 Expo 앱
│   ├── .storybook/       # Storybook 설정
│   ├── src/              # 예제 스크린
│   └── App.tsx           # Storybook UI 렌더링
└── lib/                  # 빌드 결과물 (npm publish 대상)
```

## 5. 협업 및 검수 워크플로우 (Workflow)

### 5.1. 개발자 (Developer)
1.  **Feature Branch 생성:** `feature/button-component`
2.  **구현:** `src/components`에 Web/Native 구현체 작성
3.  **로컬 테스트:** `example` 앱 실행 (`yarn example start`) -> Storybook에서 컴포넌트 확인
    *   Web 확인: `w` 키를 눌러 브라우저에서 확인
    *   App 확인: `i` (iOS) 또는 `a` (Android) 키를 눌러 시뮬레이터에서 확인

### 5.2. 디자이너 (Designer) - 개발 환경 없이 검수
1.  **PR 생성 시 자동 배포:** GitHub Actions가 Trigger됨.
2.  **웹 검수 (Chromatic):**
    *   Bot이 PR 코멘트로 **Storybook URL**을 남김.
    *   디자이너는 브라우저에서 레이아웃, 색상, 인터랙션(Hover 등) 검수.
3.  **앱 검수 (Expo Go):**
    *   Bot이 PR 코멘트로 **Expo Preview QR Code**를 남김.
    *   디자이너는 스마트폰 카메라로 QR을 스캔하여 실제 기기에서 터치감, 네이티브 UI 검수.
4.  **피드백:** GitHub PR 또는 Figma Comment로 피드백 전달.

## 6. 개발 로드맵 (Roadmap)

### Phase 1: Foundation (기반 및 구조)
- [ ] `create-react-native-library`로 Monorepo 구조 세팅
- [ ] ESLint, Prettier, TypeScript 설정
- [ ] GitHub Actions: CI/CD (Test, Lint, Storybook Deploy, EAS Update) 구성
- [ ] `core/theme`: Color, Typography, Spacing 토큰 설계 및 구현

### Phase 2: Core Components (핵심 컴포넌트)
- [ ] **Primitive:** `Box`, `Text`, `Flex` (Layout용)
- [ ] **Action:** `Button`, `IconButton`, `Link`
- [ ] **Input:** `TextInput`, `Checkbox`, `Radio`

### Phase 3: Advanced Components & Polish
- [ ] **Feedback:** `Modal`, `Toast`, `Spinner`
- [ ] **Navigation:** `Tabs` (UI만), `Header`
- [ ] 웹 접근성(A11y) 및 다크 모드 완벽 지원

## 7. 컨벤션 (Conventions)
*   **파일 명명:** PascalCase (`Button.tsx`, `ThemeContext.ts`)
*   **컴포넌트:** 함수형 컴포넌트(`FC`) + Hooks 사용 권장
*   **Style:**
    *   Native: `StyleSheet.create` 사용
    *   Web: CSS Modules (`.module.css`) 또는 Styled-components 사용
*   **Commit Message:** Conventional Commits 준수 (e.g., `feat: add Button component`, `fix: resolve spacing issue`)
