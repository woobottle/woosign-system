/**
 * React Native CLI config
 *
 * - `dependency.platforms` stays null/null because @woosign/ui is a pure JS
 *   library — no native modules to autolink.
 * - `assets` declares the WooBottle brand font folder. When this package is
 *   installed into a host RN app, running `npx react-native-asset` at the
 *   host will copy the TTFs into the iOS Xcode project's Copy Bundle
 *   Resources phase, register them in Info.plist's `UIAppFonts`, and copy
 *   them into `android/app/src/main/assets/fonts/`.
 */
module.exports = {
  dependency: {
    platforms: {
      ios: null,
      android: null,
    },
  },
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts'],
};
