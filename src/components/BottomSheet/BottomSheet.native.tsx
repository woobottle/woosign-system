/**
 * BottomSheet — React Native implementation.
 *
 * RN 내장 <Modal transparent animationType="slide">가 진입/퇴장 슬라이드와
 * Android back(onRequestClose)을 처리한다. 핸들 영역 PanResponder 드래그로
 * 디스미스하며(판정: shouldDismiss 공유 함수), 닫힘 판정 시 translateY를
 * 리셋하지 않아 Modal slide-out이 현재 위치에서 이어진다. scrim Pressable
 * 클릭으로 onClose, 표면 Pressable이 터치 전파를 차단한다.
 */
import type {ReactElement} from 'react';
import {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {
  BottomSheetNativeProps,
  BottomSheetHeaderProps,
  BottomSheetTitleProps,
  BottomSheetDescriptionProps,
  BottomSheetBodyProps,
  BottomSheetFooterProps,
} from './types';
import {
  getBottomSheetStyles,
  SCRIM_COLOR,
  DEFAULT_MAX_HEIGHT_RATIO,
} from './BottomSheet.styles';
import {shouldDismiss} from './dismiss';
import {shadows} from '../../core/theme/tokens';

const sheetStyles = getBottomSheetStyles();

function BottomSheetBase({
  open,
  onClose,
  closeOnScrimClick = true,
  closeOnEsc = true,
  dragToClose = true,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  children,
  style,
  testID,
}: BottomSheetNativeProps) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const translateY = useRef(new Animated.Value(0)).current;
  const sheetHeightRef = useRef(0);

  // 재오픈 시 직전 드래그 잔여 위치 초기화
  useEffect(() => {
    if (open) {
      translateY.setValue(0);
    }
  }, [open, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, g) => {
        translateY.setValue(Math.max(0, g.dy));
      },
      onPanResponderRelease: (_evt, g) => {
        const dy = Math.max(0, g.dy);
        if (shouldDismiss(dy, Math.max(0, g.vy), sheetHeightRef.current)) {
          onCloseRef.current();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        // 제스처가 시스템에 뺏기면 디스미스 판정 없이 복귀만 한다 (web pointercancel과 동일)
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const maxHeight = Dimensions.get('window').height * maxHeightRatio;

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={closeOnEsc ? onClose : () => {}}>
      <Pressable
        testID={testID ? `${testID}-scrim` : 'bottomsheet-scrim'}
        onPress={closeOnScrimClick ? onClose : undefined}
        style={styles.scrim}>
        <Animated.View
          style={[styles.sheetWrap, {transform: [{translateY}]}]}
          onLayout={e => {
            sheetHeightRef.current = e.nativeEvent.layout.height;
          }}>
          <Pressable
            testID={testID}
            onPress={() => {}}
            style={[
              sheetStyles.surface as ViewStyle,
              shadows.modal,
              {maxHeight},
              style,
            ]}>
            {dragToClose && (
              <View
                testID={testID ? `${testID}-handle` : 'bottomsheet-handle'}
                {...panResponder.panHandlers}
                style={sheetStyles.handleArea as ViewStyle}>
                <View style={sheetStyles.handle as ViewStyle} />
              </View>
            )}
            <SafeAreaView style={styles.content}>{children}</SafeAreaView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function BottomSheetHeader({children, style}: BottomSheetHeaderProps) {
  return (
    <View style={[sheetStyles.header as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
BottomSheetHeader.displayName = 'BottomSheetHeader';

export function BottomSheetTitle({children, style}: BottomSheetTitleProps) {
  return (
    <Text style={[sheetStyles.title as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
BottomSheetTitle.displayName = 'BottomSheetTitle';

export function BottomSheetDescription({
  children,
  style,
}: BottomSheetDescriptionProps) {
  return (
    <Text style={[sheetStyles.description as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
BottomSheetDescription.displayName = 'BottomSheetDescription';

export function BottomSheetBody({children, style}: BottomSheetBodyProps) {
  return (
    <ScrollView
      style={styles.bodyScroll}
      contentContainerStyle={[
        sheetStyles.body as ViewStyle,
        style as ViewStyle,
      ]}>
      {children}
    </ScrollView>
  );
}
BottomSheetBody.displayName = 'BottomSheetBody';

export function BottomSheetFooter({children, style}: BottomSheetFooterProps) {
  return (
    <View style={[sheetStyles.footer as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
BottomSheetFooter.displayName = 'BottomSheetFooter';

interface BottomSheetComponent {
  (props: BottomSheetNativeProps): ReactElement | null;
  displayName?: string;
  Header: typeof BottomSheetHeader;
  Title: typeof BottomSheetTitle;
  Description: typeof BottomSheetDescription;
  Body: typeof BottomSheetBody;
  Footer: typeof BottomSheetFooter;
}

const BottomSheet = BottomSheetBase as unknown as BottomSheetComponent;
BottomSheet.displayName = 'BottomSheet';
BottomSheet.Header = BottomSheetHeader;
BottomSheet.Title = BottomSheetTitle;
BottomSheet.Description = BottomSheetDescription;
BottomSheet.Body = BottomSheetBody;
BottomSheet.Footer = BottomSheetFooter;

export {BottomSheet};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: SCRIM_COLOR,
  },
  sheetWrap: {
    width: '100%',
  },
  content: {
    flexShrink: 1,
  },
  bodyScroll: {
    flexGrow: 0,
  },
});
