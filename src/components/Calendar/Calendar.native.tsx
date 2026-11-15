import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useCalendar, parseDate, formatDate} from '../_shared/calendar';
import type {CalendarNativeProps} from './types';
export function Calendar({
  locale = 'ko',
  testID,
  style,
  ...props
}: CalendarNativeProps) {
  const c = useResolvedColors();
  const {month, days, selected, select, blocked, shiftMonth} =
    useCalendar(props);
  const heading = month.toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    {year: 'numeric', month: 'long'},
  );
  return (
    <View
      testID={testID}
      style={[
        styles.root,
        {
          borderColor: c.borderDefault,
          backgroundColor: c.card,
        },
        style,
      ]}>
      <View style={styles.header}>
        <Pressable
          disabled={props.disabled}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => shiftMonth(-1)}
          style={styles.navButton}>
          <Text style={{color: c.textPrimary}}>‹</Text>
        </Pressable>
        <Text
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          style={{color: c.textPrimary}}>
          {heading}
        </Text>
        <Pressable
          disabled={props.disabled}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => shiftMonth(1)}
          style={styles.navButton}>
          <Text style={{color: c.textPrimary}}>›</Text>
        </Pressable>
      </View>
      <View style={styles.weekdays}>
        {(locale === 'ko'
          ? ['일', '월', '화', '수', '목', '금', '토']
          : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        ).map(day => (
          <Text key={day} style={[styles.weekday, {color: c.textSecondary}]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.days}>
        {days.map(date => (
          <Pressable
            key={date}
            accessibilityRole="button"
            accessibilityLabel={date}
            accessibilityState={{
              selected: date === selected,
              disabled: blocked(date),
            }}
            disabled={blocked(date)}
            onPress={() => select(date)}
            style={[
              styles.day,
              date === selected
                ? {backgroundColor: c.actionPrimary}
                : styles.dayUnselected,
              blocked(date)
                ? styles.dayBlocked
                : date.slice(0, 7) === formatDate(month).slice(0, 7)
                ? styles.dayInMonth
                : styles.dayOutsideMonth,
            ]}>
            <Text
              style={{
                color: date === selected ? c.primaryForeground : c.textPrimary,
              }}>
              {parseDate(date)!.getDate()}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {width: 308, padding: 12, borderRadius: 12, borderWidth: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {padding: 10},
  weekdays: {flexDirection: 'row'},
  weekday: {width: '14.285714%', textAlign: 'center'},
  days: {flexDirection: 'row', flexWrap: 'wrap'},
  day: {
    width: '14.285714%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  dayUnselected: {backgroundColor: 'transparent'},
  dayBlocked: {opacity: 0.3},
  dayInMonth: {opacity: 1},
  dayOutsideMonth: {opacity: 0.5},
});
