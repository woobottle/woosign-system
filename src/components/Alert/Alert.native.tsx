import {View, Text, Pressable} from 'react-native';
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
        {
          padding: 16,
          borderRadius: 12,
          backgroundColor:
            tone === 'danger'
              ? c.errorTint
              : tone === 'success'
              ? c.successTint
              : c.section,
          flexDirection: 'row',
          gap: 12,
        },
        style,
      ]}>
      <View style={{flex: 1}}>
        {title && (
          <Text style={{color: c.textPrimary, fontWeight: '600'}}>{title}</Text>
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
