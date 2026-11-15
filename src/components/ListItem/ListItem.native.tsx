import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {ListItemNativeProps} from './types';
export function ListItem({
  title,
  description,
  leading,
  trailing,
  onPress,
  disabled,
  testID,
  style,
}: ListItemNativeProps) {
  const c = useResolvedColors();
  const content = (
    <>
      {leading}
      <View style={styles.content}>
        <Text style={[styles.title, {color: c.textPrimary}]}>{title}</Text>
        {description && (
          <Text style={[styles.description, {color: c.textSecondary}]}>
            {description}
          </Text>
        )}
      </View>
      {trailing}
    </>
  );
  const s = [
    {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
      padding: 16,
      backgroundColor: c.card,
      borderBottomWidth: 1,
      borderBottomColor: c.borderDefault,
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      accessibilityState={{disabled}}
      onPress={onPress}
      testID={testID}
      style={s}>
      {content}
    </Pressable>
  ) : (
    <View testID={testID} style={s}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {flex: 1},
  title: {fontWeight: '500'},
  description: {fontSize: 13},
});
