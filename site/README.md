# WooSign showcase

Paper & Ink 스타일의 React + Vite 사이트입니다. 실제 라이브러리 소스를 가져와 50개 컴포넌트를 보여줍니다.

```sh
pnpm site:dev        # http://127.0.0.1:5173
pnpm site:typecheck
pnpm site:test
pnpm site:build      # site/dist
pnpm site:preview
```

홈, 검색·분류 갤러리, 컴포넌트 상세(데모·코드·API), 디자인 토큰, 시작하기 페이지를 제공합니다. 해시 라우팅을 사용하므로 정적 호스팅에서도 상세 URL을 직접 열 수 있습니다. 라이트·다크 설정은 로컬에 저장합니다.

데모는 `src/demos.tsx`에서 관리합니다. 데모나 라이브러리 타입을 수정하면 `node site/scripts/generate-catalog.cjs`로 코드와 API 데이터를 갱신하세요.

배포 설정: 저장소 루트에서 의존성을 설치하고 `pnpm site:build`를 실행한 뒤 `site/dist`를 정적 호스팅에 업로드합니다. Vercel에서도 같은 빌드 명령과 출력 디렉터리를 지정할 수 있습니다. 별도 환경 변수는 필요하지 않습니다.

사이트는 npm 패키지 배포 파일에 포함되지 않습니다.

## woo-bottle.com 연결

공개 경로는 `https://woo-bottle.com/woosign/`입니다. 기존 `growth/woobottle-labs`의 `public/woosign/`에 빌드 결과물을 넣고 그 저장소의 S3 배포 워크플로우를 실행합니다.

```sh
pnpm site:build
node site/scripts/install-into-labs.cjs /path/to/woobottle-labs
```

기존 CloudFront의 trailing slash 처리와 S3 웹사이트 index 문서 설정을 재사용합니다. JS·CSS·폰트 경로는 상대 경로이고, 상세 화면은 `#/components/button` 형식으로 이동하므로 별도 DNS와 SPA rewrite 설정이 필요하지 않습니다. 데모 변경 후에는 위 명령으로 정적 결과물을 갱신하고 WooBottle 사이트를 다시 배포하세요.
