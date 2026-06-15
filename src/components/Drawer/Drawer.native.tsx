/**
 * Drawer — React Native implementation.
 *
 * 투명 <Modal animationType="none">로 표시/Android back(onRequestClose)을 처리하고,
 * 패널은 Animated translateX(-width → 0)로 좌측에서 슬라이드 진입한다(RN Modal의
 * slide는 하단 전용이라 측면은 수동 Animated 사용). scrim Pressable 클릭으로 onClose,
 * 패널 Pressable이 터치 전파를 차단한다. 닫힐 때는 Modal visible=false로 언마운트한다.
 */
import type {ReactElement} from 'react';
import {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {
  DrawerNativeProps,
  DrawerHeaderProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerBodyProps,
  DrawerFooterProps,
} from './types';
import {
  getDrawerStyles,
  SCRIM_COLOR,
  DEFAULT_WIDTH,
  DRAWER_ANIM_MS,
} from './Drawer.styles';
import {shadows} from '../../core/theme/tokens';
import {useResolvedColors} from '../../core/hooks';

function DrawerBase({
  open,
  onClose,
  width = DEFAULT_WIDTH,
  closeOnScrimClick = true,
  closeOnEsc = true,
  children,
  style,
  testID,
}: DrawerNativeProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);

  const {width: windowWidth} = useWindowDimensions();
  const panelWidth = Math.min(width, windowWidth);

  const translateX = useRef(new Animated.Value(-panelWidth)).current;
  const wasOpen = useRef(false);

  // 닫힘→열림 전이에서만 좌측 밖(-panelWidth)에서 0으로 슬라이드 진입한다.
  // panelWidth는 deps에 있으나, 이미 열린 채 화면폭이 바뀌어도(회전 등)
  // wasOpen 가드로 재슬라이드를 막는다 — 닫혀 있을 때만 시작 위치를 동기화한다.
  useEffect(() => {
    if (open && !wasOpen.current) {
      translateX.setValue(-panelWidth);
      Animated.timing(translateX, {
        toValue: 0,
        duration: DRAWER_ANIM_MS,
        useNativeDriver: true,
      }).start();
    } else if (!open) {
      translateX.setValue(-panelWidth);
    }
    wasOpen.current = open;
  }, [open, panelWidth, translateX]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={closeOnEsc ? onClose : () => {}}>
      <Pressable
        testID={testID ? `${testID}-scrim` : 'drawer-scrim'}
        onPress={closeOnScrimClick ? onClose : undefined}
        style={styles.scrim}>
        <Animated.View style={{width: panelWidth, transform: [{translateX}]}}>
          <Pressable
            testID={testID}
            onPress={() => {}}
            style={[
              drawerStyles.surface as ViewStyle,
              shadows.modal,
              styles.panel,
              style,
            ]}>
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function DrawerHeader({children, style}: DrawerHeaderProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  return (
    <View style={[drawerStyles.header as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
DrawerHeader.displayName = 'DrawerHeader';

export function DrawerTitle({children, style}: DrawerTitleProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  return (
    <Text style={[drawerStyles.title as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
DrawerTitle.displayName = 'DrawerTitle';

export function DrawerDescription({children, style}: DrawerDescriptionProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  return (
    <Text style={[drawerStyles.description as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
DrawerDescription.displayName = 'DrawerDescription';

export function DrawerBody({children, style}: DrawerBodyProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  return (
    <ScrollView
      style={styles.bodyScroll}
      contentContainerStyle={[
        drawerStyles.body as ViewStyle,
        style as ViewStyle,
      ]}>
      {children}
    </ScrollView>
  );
}
DrawerBody.displayName = 'DrawerBody';

export function DrawerFooter({children, style}: DrawerFooterProps) {
  const colors = useResolvedColors();
  const drawerStyles = useMemo(() => getDrawerStyles(colors), [colors]);
  return (
    <View style={[drawerStyles.footer as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
DrawerFooter.displayName = 'DrawerFooter';

interface DrawerComponent {
  (props: DrawerNativeProps): ReactElement | null;
  displayName?: string;
  Header: typeof DrawerHeader;
  Title: typeof DrawerTitle;
  Description: typeof DrawerDescription;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
}

const Drawer = DrawerBase as unknown as DrawerComponent;
Drawer.displayName = 'Drawer';
Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

export {Drawer};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: SCRIM_COLOR,
  },
  panel: {
    flex: 1,
  },
  bodyScroll: {
    flex: 1,
  },
});
