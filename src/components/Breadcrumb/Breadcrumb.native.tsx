import {View, Text, Pressable, Linking} from 'react-native';
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
      style={[{flexDirection: 'row', flexWrap: 'wrap', gap: 8}, style]}>
      {items.map((item, i) => (
        <View key={i} style={{flexDirection: 'row', gap: 8}}>
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
