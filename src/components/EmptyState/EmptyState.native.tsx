import {View, Text, StyleSheet} from 'react-native';
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
    <View testID={testID} style={[styles.container, style]}>
      {icon}
      <Text
        accessibilityRole="header"
        style={[styles.title, {color: c.textPrimary}]}>
        {title}
      </Text>
      {description && (
        <Text style={[styles.description, {color: c.textSecondary}]}>
          {description}
        </Text>
      )}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 32, alignItems: 'center', gap: 12},
  title: {fontWeight: '600', fontSize: 18},
  description: {textAlign: 'center'},
});
