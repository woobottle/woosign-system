import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {AlertNativeProps} from './types';
export function Alert({
  title,
  children,
  tone = 'info',
  onClose,
  testID,
  style,
}: AlertNativeProps) {
  const c = useResolvedColors();
  return (
    <View
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      testID={testID}
      style={[
        styles.root,
        {
          backgroundColor:
            tone === 'danger'
              ? c.errorTint
              : tone === 'success'
              ? c.successTint
              : c.section,
        },
        style,
      ]}>
      <View style={styles.body}>
        {title && (
          <Text style={[styles.title, {color: c.textPrimary}]}>{title}</Text>
        )}
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text style={{color: c.textPrimary}}>{children}</Text>
        ) : (
          children
        )}
      </View>
      {onClose && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="알림 닫기"
          onPress={onClose}
          hitSlop={8}>
          <Text style={{color: c.textPrimary}}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {padding: 16, borderRadius: 12, flexDirection: 'row', gap: 12},
  body: {flex: 1},
  title: {fontWeight: '600'},
});
