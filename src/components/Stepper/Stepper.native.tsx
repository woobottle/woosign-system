import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {
  INDICATOR_SIZE,
  currentIndexOf,
  getStepColors,
  statusOf,
  statusText,
} from './Stepper.styles';
import type {StepperNativeProps} from './types';

export function Stepper({
  steps,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  navigable = false,
  label,
  testID,
  style,
}: StepperNativeProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue ?? steps[0]?.value ?? '',
    onValueChange,
  );
  const current = currentIndexOf(steps, selected);
  const vertical = orientation === 'vertical';
  return (
    <View
      accessibilityLabel={label}
      testID={testID}
      style={[vertical ? styles.rootVertical : styles.rootHorizontal, style]}>
      {steps.map((step, i) => {
        const status = statusOf(i, current);
        const colors = getStepColors(c, status);
        const last = i === steps.length - 1;
        const clickable = navigable && status === 'complete' && !step.disabled;
        return (
          <View
            key={step.value}
            style={[
              vertical ? styles.stepVertical : styles.stepHorizontal,
              !last && !vertical && styles.grow,
            ]}>
            <Pressable
              accessible
              accessibilityRole={clickable ? 'button' : undefined}
              accessibilityLabel={`${step.label}, ${i + 1}/${steps.length}, ${
                statusText[status]
              }`}
              accessibilityState={{
                selected: status === 'current',
                disabled: !!step.disabled,
              }}
              disabled={!clickable}
              onPress={() => setSelected(step.value)}
              style={[
                styles.content,
                vertical && styles.contentVertical,
                step.disabled && styles.disabled,
              ]}>
              <View
                style={[
                  styles.indicator,
                  {
                    borderColor: colors.indicatorBorder,
                    backgroundColor: colors.indicatorBackground,
                  },
                ]}>
                <Text
                  style={[styles.indicatorText, {color: colors.indicatorText}]}>
                  {status === 'complete' ? '✓' : String(i + 1)}
                </Text>
              </View>
              <View style={styles.text}>
                <Text style={[styles.label, {color: colors.label}]}>
                  {step.label}
                </Text>
                {step.description ? (
                  <Text style={[styles.description, {color: c.textSecondary}]}>
                    {step.description}
                  </Text>
                ) : null}
              </View>
            </Pressable>
            {last ? null : (
              <View
                style={[
                  vertical
                    ? styles.connectorVertical
                    : styles.connectorHorizontal,
                  {backgroundColor: colors.connector},
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rootHorizontal: {flexDirection: 'row', alignItems: 'center'},
  rootVertical: {flexDirection: 'column'},
  stepHorizontal: {flexDirection: 'row', alignItems: 'center', gap: 8},
  stepVertical: {flexDirection: 'column', gap: 8},
  grow: {flexGrow: 1, flexShrink: 1},
  content: {flexDirection: 'row', alignItems: 'center', gap: 8},
  contentVertical: {alignItems: 'flex-start'},
  disabled: {opacity: 0.5},
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {fontWeight: '600', fontSize: 14},
  text: {gap: 2, flexShrink: 1},
  label: {fontWeight: '600'},
  description: {fontSize: 13},
  connectorHorizontal: {flex: 1, height: 2, minWidth: 16},
  connectorVertical: {
    width: 2,
    minHeight: 24,
    marginLeft: INDICATOR_SIZE / 2 - 1,
  },
});
