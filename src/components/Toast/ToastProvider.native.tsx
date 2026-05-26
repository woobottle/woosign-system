/**
 * ToastProvider — React Native implementation.
 *
 * RN has no Portal, so the toast stack is rendered as an absolutely
 * positioned overlay sibling of children. The wrapper takes `flex: 1`
 * so the host tree still controls its own layout. `pointerEvents="box-none"`
 * on the overlay lets touches pass through the gaps between toasts.
 */

import {View, StyleSheet} from 'react-native';
import {Toast} from './Toast.native';
import {ToastContext} from './ToastContext';
import {useToastState} from './useToastState';
import type {ToastProviderProps} from './types';

export function ToastProvider({
  children,
  duration,
  position = 'bottom',
  max,
  offset = 24,
}: ToastProviderProps) {
  const {api, toasts} = useToastState({defaultDuration: duration, max});

  const overlayStyle =
    position === 'top'
      ? [styles.overlay, {top: offset}]
      : [styles.overlay, {bottom: offset}];

  return (
    <ToastContext.Provider value={api}>
      <View style={styles.root}>
        {children}
        <View pointerEvents="box-none" style={overlayStyle}>
          {toasts.map(t => (
            <View key={t.id} style={styles.item} pointerEvents="auto">
              <Toast
                tone={t.tone ?? 'neutral'}
                title={t.title}
                description={t.description}
                glyph={t.glyph}
                hideIcon={t.hideIcon}
              />
            </View>
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  item: {
    maxWidth: 420,
    width: '90%',
  },
});
