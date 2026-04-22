# WooBottle brand fonts

These files back the `--font-display` / `--font-signature` stack declared in
the design system tokens (`typography.fontFamily.display` /
`typography.fontFamily.signature`).

## Included

- `Woobottle-Regular.woff2` — full Unicode (Korean + Latin)
- `Woobottle-Regular.subset.woff2` — latin-plus subset
- `Woobottle-Regular.latin.woff2` — Latin-only subset (smallest)
- `Woobottle-Regular.ttf`, `.otf` — fallbacks for runtimes without woff2
- `Woobottle-Signature.subset.woff2` — editorial accent subset used for hero
  eyebrows (`.wb-editorial` / `typography.fontFamily.signature`)
- `Woobottle-Signature.ttf` — fallback for the signature face

## Loading

### Web (Vite/Next/etc.)

Register an `@font-face` rule pointing at this folder, e.g.
```css
@font-face {
  font-family: 'Woobottle';
  src: url('@woosign/ui/assets/fonts/Woobottle-Regular.woff2') format('woff2'),
       url('@woosign/ui/assets/fonts/Woobottle-Regular.ttf') format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'Woobottle Signature';
  src: url('@woosign/ui/assets/fonts/Woobottle-Signature.subset.woff2') format('woff2'),
       url('@woosign/ui/assets/fonts/Woobottle-Signature.ttf') format('truetype');
  font-display: swap;
}
```

### React Native

This package's `react-native.config.js` declares `./src/assets/fonts` under
`assets`. Host apps only need to run **once** after install:
```
npx react-native-asset
```
which will:
- Copy TTFs into `android/app/src/main/assets/fonts/`
- Add the TTFs to Xcode's Copy Bundle Resources phase
- Register them in `ios/<App>/Info.plist` under `UIAppFonts`

Then in code:
```ts
import {resolveFontFamily} from '@woosign/ui';

<Text style={{fontFamily: resolveFontFamily('display')}}>
  A warmer kind of morning.
</Text>
```

`resolveFontFamily('sans' | 'sansAlt')` returns `undefined` on native
(intentional — system sans renders Korean via Apple SD Gothic Neo on iOS
and Noto Sans CJK on Android). Use `'display'` / `'signature'` for the
brand faces.

### Expo

Load via `expo-font`:
```ts
import {useFonts} from 'expo-font';

const [loaded] = useFonts({
  Woobottle: require('@woosign/ui/src/assets/fonts/Woobottle-Regular.ttf'),
  'Woobottle Signature': require('@woosign/ui/src/assets/fonts/Woobottle-Signature.ttf'),
});
```
