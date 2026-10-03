import {View, Text, Pressable} from 'react-native';
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
      <View style={{flex: 1}}>
        <Text style={{color: c.textPrimary, fontWeight: '500'}}>{title}</Text>
        {description && (
          <Text style={{color: c.textSecondary, fontSize: 13}}>
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
