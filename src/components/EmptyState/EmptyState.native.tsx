import {View, Text} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {EmptyStateNativeProps} from './types';
export function EmptyState({
  title,
  description,
  icon,
  action,
  testID,
  style,
}: EmptyStateNativeProps) {
  const c = useResolvedColors();
  return (
    <View
      testID={testID}
      style={[{padding: 32, alignItems: 'center', gap: 12}, style]}>
      {icon}
      <Text
        accessibilityRole="header"
        style={{color: c.textPrimary, fontWeight: '600', fontSize: 18}}>
        {title}
      </Text>
      {description && (
        <Text style={{color: c.textSecondary, textAlign: 'center'}}>
          {description}
        </Text>
      )}
      {action}
    </View>
  );
}
