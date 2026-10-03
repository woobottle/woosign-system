import {useState} from 'react';
import {Image, Text, View} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {AvatarNativeProps} from './types';
function Picture({
  src,
  fallback,
  size,
}: {
  src?: string;
  fallback: React.ReactNode;
  size: number;
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      source={{uri: src}}
      onError={() => setFailed(true)}
      style={{width: size, height: size}}
      resizeMode="cover"
    />
  ) : (
    <>{fallback}</>
  );
}
export function Avatar({
  src,
  name = '',
  fallback,
  size = 40,
  testID,
  style,
}: AvatarNativeProps) {
  const c = useResolvedColors();
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => Array.from(part)[0])
      .join('')
      .toUpperCase() || '?';
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={name || '아바타'}
      testID={testID}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: c.section,
        },
        style,
      ]}>
      <Picture
        key={src}
        src={src}
        size={size}
        fallback={
          typeof fallback === 'string' ||
          typeof fallback === 'number' ||
          fallback == null ? (
            <Text style={{color: c.textPrimary, fontSize: size * 0.35}}>
              {fallback ?? initials}
            </Text>
          ) : (
            fallback
          )
        }
      />
    </View>
  );
}
