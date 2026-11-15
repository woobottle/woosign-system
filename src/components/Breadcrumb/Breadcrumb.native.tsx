import {View, Text, Pressable, Linking, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {BreadcrumbNativeProps} from './types';
export function Breadcrumb({
  items,
  label = '현재 경로',
  testID,
  style,
}: BreadcrumbNativeProps) {
  const c = useResolvedColors();
  return (
    <View
      accessibilityLabel={label}
      testID={testID}
      style={[styles.root, style]}>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          {i > 0 && (
            <Text accessible={false} style={{color: c.textTertiary}}>
              /
            </Text>
          )}
          {i < items.length - 1 && (item.onPress || item.href) ? (
            <Pressable
              accessibilityRole="link"
              onPress={() => {
                if (item.onPress) {
                  item.onPress();
                } else if (item.href) {
                  // Fire-and-forget: navigation result is intentionally not awaited.
                  // eslint-disable-next-line no-void
                  void Linking.openURL(item.href);
                }
              }}>
              <Text style={{color: c.textSecondary}}>{item.label}</Text>
            </Pressable>
          ) : (
            <Text
              accessibilityLabel={
                i === items.length - 1
                  ? `${item.label}, 현재 페이지`
                  : item.label
              }
              style={{
                color: i === items.length - 1 ? c.textPrimary : c.textSecondary,
              }}>
              {item.label}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  item: {flexDirection: 'row', gap: 8},
});
