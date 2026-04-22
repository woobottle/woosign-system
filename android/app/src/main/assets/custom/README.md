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

- **Web (Vite/Next/etc.)**: register an `@font-face` rule pointing at this
  folder, e.g.
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
- **React Native**: copy the TTF files into the host app's native font assets
  (iOS `Info.plist` `UIAppFonts` entry, Android `assets/fonts/`), or load via
  Expo's `useFonts`. The `typography.fontFamily.display` token uses the name
  `"Woobottle"`; `typography.fontFamily.signature` uses `"Woobottle Signature"`.
