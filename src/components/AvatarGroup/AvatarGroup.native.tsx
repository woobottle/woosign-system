import {View} from 'react-native';
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
    <View testID={testID} style={[{flexDirection: 'row'}, style]}>
      {items.slice(0, limit).map((item, i) => (
        <Avatar
          key={i}
          {...item}
          size={size}
          style={{
            marginLeft: i ? -size / 4 : 0,
            borderWidth: 2,
            borderColor: c.canvas,
          }}
        />
      ))}
      {hidden > 0 && (
        <Avatar name={`${hidden}명 더`} fallback={`+${hidden}`} size={size} />
      )}
    </View>
  );
}
