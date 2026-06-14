/**
 * Dialog — React Native implementation.
 *
 * RN 내장 <Modal>이 Android back 버튼(onRequestClose), 상태바, 전체화면
 * 오버레이를 처리한다. scrim Pressable 클릭으로 onClose, 표면 Pressable이
 * 터치 전파를 차단한다. closeOnEsc는 native에서 Android back 처리에 매핑된다.
 */
import type {ReactElement} from 'react';
import {useMemo} from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {
  DialogNativeProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
} from './types';
import {getDialogStyles, SIZE_MAX_WIDTH, SCRIM_COLOR} from './Dialog.styles';
import {shadows} from '../../core/theme/tokens';
import {useResolvedColors} from '../../core/hooks';

function DialogBase({
  open,
  onClose,
  size = 'md',
  closeOnScrimClick = true,
  closeOnEsc = true,
  children,
  style,
  testID,
}: DialogNativeProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={closeOnEsc ? onClose : () => {}}>
      <Pressable
        testID={testID ? `${testID}-scrim` : 'dialog-scrim'}
        onPress={closeOnScrimClick ? onClose : undefined}
        style={[styles.scrim, {backgroundColor: SCRIM_COLOR}]}>
        <Pressable
          testID={testID}
          onPress={() => {}}
          style={[
            dialogStyles.surface as ViewStyle,
            shadows.modal,
            {maxWidth: SIZE_MAX_WIDTH[size]},
            styles.surface,
            style,
          ]}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DialogHeader({children, style}: DialogHeaderProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  return (
    <View style={[dialogStyles.header as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
DialogHeader.displayName = 'DialogHeader';

export function DialogTitle({children, style}: DialogTitleProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  return (
    <Text style={[dialogStyles.title as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
DialogTitle.displayName = 'DialogTitle';

export function DialogDescription({children, style}: DialogDescriptionProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  return (
    <Text style={[dialogStyles.description as TextStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}
DialogDescription.displayName = 'DialogDescription';

export function DialogBody({children, style}: DialogBodyProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  return (
    <View style={[dialogStyles.body as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
DialogBody.displayName = 'DialogBody';

export function DialogFooter({children, style}: DialogFooterProps) {
  const colors = useResolvedColors();
  const dialogStyles = useMemo(() => getDialogStyles(colors), [colors]);
  return (
    <View style={[dialogStyles.footer as ViewStyle, style as ViewStyle]}>
      {children}
    </View>
  );
}
DialogFooter.displayName = 'DialogFooter';

interface DialogComponent {
  (props: DialogNativeProps): ReactElement | null;
  displayName?: string;
  Header: typeof DialogHeader;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
}

const Dialog = DialogBase as unknown as DialogComponent;
Dialog.displayName = 'Dialog';
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;

export {Dialog};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  surface: {
    width: '90%',
  },
});
