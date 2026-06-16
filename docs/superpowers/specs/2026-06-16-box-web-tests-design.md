# Box 웹 테스트 설계

**날짜:** 2026-06-16
**범위:** `Box` 컴포넌트의 web 구현(`Box.web.tsx`)에 대한 단위 테스트를 추가한다.

## 목표

Box는 현재 web 테스트가 없는 유일한 레이아웃 프리미티브다. props → CSS 스타일 변환의 분기/정밀 로직을 jsdom 단위 테스트로 고정해 회귀를 막는다. Card/Input의 web 테스트(`*.web.test.tsx`) 규약을 미러한다.

## 비목표 (YAGNI)

- `Box.native` 테스트.
- 스토리 변경, Box 구현 변경.
- 순수 passthrough prop 전수 검증(개별 flex/size prop 각각) — 저가치. 로직 있는 동작만 검증한다.

## 대상 동작 (Box.web.tsx)

`Box.web.tsx`는 `BoxWebProps`를 받아 단일 `boxStyle` 객체를 만들고, undefined 값을 제거한 뒤 `as`(기본 `div`) 엘리먼트로 렌더한다. 검증할 로직:

- 기본값: `display:'flex'`, `flexDirection: flexDirection || 'column'`.
- 패딩 shorthand: `paddingLeft ?? paddingX`, `paddingRight ?? paddingX`, `paddingTop ?? paddingY`, `paddingBottom ?? paddingY`.
- 마진 shorthand: 동일 패턴(`marginLeft ?? marginX` 등).
- `borderRadius`: 프리셋(`'md'` 등)은 `resolveBorderRadius`로 토큰 숫자 변환, 숫자는 passthrough.
- `borderStyle`: `borderWidth`가 있으면 `'solid'`, 없으면 미설정.
- `as`: 지정 시 해당 HTML 엘리먼트, 기본 `div`.
- 커스텀 `style`: `...style`이 마지막에 병합되어 기본 스타일을 덮을 수 있음.
- undefined 정리: 미지정 prop은 최종 스타일에 키가 없음.

## 테스트 (`src/components/Box/Box.web.test.tsx`, ~11개)

jsdom + `@testing-library/react`. 스타일 검증은 `toHaveStyle`, 엘리먼트 태그 검증은 `element.tagName`, testID는 `getByTestId`.

1. children + `data-testid` 렌더 + 기본 `display:flex` / `flexDirection:column`.
2. `flexDirection="row"` → `flexDirection:row`.
3. `paddingX={16}` → `paddingLeft:16px` + `paddingRight:16px`.
4. `paddingY={8}` → `paddingTop:8px` + `paddingBottom:8px`.
5. 명시 `paddingLeft={4}` + `paddingX={16}` → `paddingLeft:4px`(명시 우선), `paddingRight:16px`.
6. `marginX={12}` → `marginLeft:12px` + `marginRight:12px`.
7. `borderRadius="md"` → 토큰 숫자(예: `borderRadius: ${radiusTokens.md}px`). 토큰 값은 `../../core/theme/tokens`의 `borderRadius`에서 가져와 비교.
8. `borderRadius={20}` → `borderRadius:20px`.
9. `borderWidth={2}` → `borderStyle:solid` + `borderWidth:2px`; `borderWidth` 미지정 시 `borderStyle`이 없음(`getByTestId(...).style.borderStyle === ''`).
10. `as="section"` → `tagName === 'SECTION'`; 기본은 `DIV`.
11. 커스텀 `style={{backgroundColor:'rgb(255,0,0)'}}` → 적용; 그리고 사이즈 `width={200}` → `width:200px`, `width="50%"` → `width:50%`.

(테스트 수는 가독성에 따라 11±1개로 조정 가능. 위 동작을 모두 커버하면 됨.)

## 검증

- `pnpm jest --selectProjects web src/components/Box/Box.web.test.tsx` — 그린.
- `pnpm typecheck` — PASS.
- CI-스코프 lint(`eslint "src/components/**/!(*.stories).tsx"`)는 *.test 포함 → prettier-clean 유지.

## 파일 구조

```
src/components/Box/Box.web.test.tsx   (신규)
```

기존 파일 수정 없음.
