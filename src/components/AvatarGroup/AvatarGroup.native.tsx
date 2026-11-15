import {View, StyleSheet} from 'react-native';
import {Avatar} from '../Avatar/Avatar.native';
import {useResolvedColors} from '../../core/hooks';
import type {AvatarGroupNativeProps} from './types';
export function AvatarGroup({
  items,
  max = 4,
  size = 40,
  testID,
  style,
}: AvatarGroupNativeProps) {
  const c = useResolvedColors();
  const limit = Math.max(0, Math.floor(max));
  const hidden = items.length - limit;
  return (
    <View testID={testID} style={[styles.root, style]}>
      {items.slice(0, limit).map((item, i) => {
        const marginLeft = i ? -size / 4 : 0;
        return (
          <Avatar
            key={i}
            {...item}
            size={size}
            style={{...styles.avatar, marginLeft, borderColor: c.canvas}}
          />
        );
      })}
      {hidden > 0 && (
        <Avatar name={`${hidden}명 더`} fallback={`+${hidden}`} size={size} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'row'},
  avatar: {borderWidth: 2},
});
