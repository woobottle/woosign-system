import {Children, useEffect, useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {carouselText, clampIndex, indexFromOffset} from './Carousel.shared';
import type {CarouselNativeProps} from './types';

export function Carousel({
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  showControls = true,
  showIndicators = true,
  label,
  testID,
  style,
}: CarouselNativeProps) {
  const c = useResolvedColors();
  const slides = Children.toArray(children);
  const count = slides.length;
  const [rawCurrent, setCurrent] = useControllableState(
    index,
    defaultIndex,
    onIndexChange,
  );
  const current = clampIndex(rawCurrent, count);
  const scroll = useRef<ScrollView>(null);
  const offset = useRef(0);
  const [width, setWidth] = useState(0);

  // Scroll to the index when it changes from outside (buttons, dots or a
  // controlled prop), and after the first layout.
  useEffect(() => {
    if (width <= 0) {
      return;
    }
    if (indexFromOffset(offset.current, width, count) !== current) {
      offset.current = current * width;
      scroll.current?.scrollTo({x: current * width, animated: true});
    }
  }, [current, count, width]);

  const go = (next: number) => {
    const target = clampIndex(next, count);
    if (target !== current) {
      setCurrent(target);
    }
  };

  const atStart = current === 0;
  const atEnd = current === count - 1;

  return (
    <View testID={testID} style={style}>
      <View
        style={styles.viewport}
        onLayout={event => setWidth(event.nativeEvent.layout.width)}>
        <ScrollView
          ref={scroll}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          accessibilityLabel={label}
          onMomentumScrollEnd={event => {
            const x = event.nativeEvent.contentOffset.x;
            offset.current = x;
            const visible = indexFromOffset(x, width, count);
            if (visible !== null && visible !== current) {
              setCurrent(visible);
            }
          }}>
          {slides.map((slide, i) => (
            <View
              key={i}
              accessibilityElementsHidden={i !== current}
              importantForAccessibility={
                i === current ? 'auto' : 'no-hide-descendants'
              }
              style={{width}}>
              {slide}
            </View>
          ))}
        </ScrollView>
        {showControls && count > 1 ? (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={carouselText.previous}
              accessibilityState={{disabled: atStart}}
              disabled={atStart}
              onPress={() => go(current - 1)}
              style={[
                styles.control,
                styles.previous,
                {borderColor: c.borderDefault, backgroundColor: c.card},
                atStart && styles.controlDisabled,
              ]}>
              <Text style={[styles.controlText, {color: c.textPrimary}]}>
                ‹
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={carouselText.next}
              accessibilityState={{disabled: atEnd}}
              disabled={atEnd}
              onPress={() => go(current + 1)}
              style={[
                styles.control,
                styles.next,
                {borderColor: c.borderDefault, backgroundColor: c.card},
                atEnd && styles.controlDisabled,
              ]}>
              <Text style={[styles.controlText, {color: c.textPrimary}]}>
                ›
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>
      {showIndicators && count > 1 ? (
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={carouselText.goTo(i + 1)}
              accessibilityState={{selected: i === current}}
              hitSlop={8}
              onPress={() => go(i)}
              style={[
                styles.dot,
                i === current
                  ? [styles.dotActive, {backgroundColor: c.actionPrimary}]
                  : {backgroundColor: c.borderDefault},
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {overflow: 'hidden', borderRadius: 16},
  control: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previous: {left: 12},
  next: {right: 12},
  controlDisabled: {opacity: 0.4},
  controlText: {fontSize: 20, lineHeight: 22},
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  dot: {width: 8, height: 8, borderRadius: 999},
  dotActive: {width: 20},
});
