import {View, Text, Pressable} from 'react-native';
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
        {
          width: 308,
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: c.borderDefault,
          backgroundColor: c.card,
        },
        style,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          disabled={props.disabled}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => shiftMonth(-1)}
          style={{padding: 10}}>
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
          style={{padding: 10}}>
          <Text style={{color: c.textPrimary}}>›</Text>
        </Pressable>
      </View>
      <View style={{flexDirection: 'row'}}>
        {(locale === 'ko'
          ? ['일', '월', '화', '수', '목', '금', '토']
          : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        ).map(day => (
          <Text
            key={day}
            style={{
              width: '14.285714%',
              textAlign: 'center',
              color: c.textSecondary,
            }}>
            {day}
          </Text>
        ))}
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
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
            style={{
              width: '14.285714%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              backgroundColor:
                date === selected ? c.actionPrimary : 'transparent',
              opacity: blocked(date)
                ? 0.3
                : date.slice(0, 7) === formatDate(month).slice(0, 7)
                ? 1
                : 0.5,
            }}>
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
