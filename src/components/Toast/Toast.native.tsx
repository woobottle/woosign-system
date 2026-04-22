import {forwardRef} from 'react';
import {View, Text} from 'react-native';
import type {ToastNativeProps} from './types';
import {getToastStyles, getDefaultGlyph} from './Toast.styles';
import {StatusDot} from '../StatusDot';

export const Toast = forwardRef<View, ToastNativeProps>(function Toast(
  {
    tone = 'neutral',
    title,
    description,
    glyph,
    hideIcon = false,
    style,
    titleStyle,
    descriptionStyle,
    testID,
  },
  ref,
) {
  const s = getToastStyles();
  return (
    <View ref={ref} testID={testID} style={[s.container, style]}>
      {!hideIcon ? (
        <StatusDot tone={tone} size="default">
          {glyph ?? getDefaultGlyph(tone)}
        </StatusDot>
      ) : null}
      <View>
        {typeof title === 'string' ? (
          <Text style={[s.title, titleStyle]}>{title}</Text>
        ) : (
          title
        )}
        {description ? (
          typeof description === 'string' ? (
            <Text style={[s.description, descriptionStyle]}>
              {description}
            </Text>
          ) : (
            description
          )
        ) : null}
      </View>
    </View>
  );
});

Toast.displayName = 'Toast';
