import {View, Text, Pressable} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {pageItems} from './pages';
import type {PaginationNativeProps} from './types';
export function Pagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  disabled,
  label = '페이지 이동',
  testID,
  style,
}: PaginationNativeProps) {
  const c = useResolvedColors();
  const total = Number.isFinite(totalPages)
    ? Math.max(1, Math.floor(totalPages) || 1)
    : 1;
  const [raw, setPage] = useControllableState(page, defaultPage, onPageChange);
  const current = Math.max(
    1,
    Math.min(total, Number.isFinite(raw) ? Math.floor(raw) : 1),
  );
  const button = (
    n: number,
    text: string,
    blocked: boolean,
    selected = false,
  ) => (
    <Pressable
      key={text}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{disabled: !!disabled || blocked, selected}}
      disabled={disabled || blocked}
      onPress={() => setPage(n)}
      style={{
        borderRadius: 999,
        borderWidth: 1,
        borderColor: c.borderDefault,
        padding: 10,
        backgroundColor: selected ? c.actionPrimary : c.card,
      }}>
      <Text style={{color: selected ? c.primaryForeground : c.textPrimary}}>
        {text}
      </Text>
    </Pressable>
  );
  return (
    <View
      accessibilityLabel={label}
      testID={testID}
      style={[
        {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8},
        style,
      ]}>
      {button(current - 1, '이전', current === 1)}
      {pageItems(current, total).map((n, i) =>
        n === 'gap' ? (
          <Text
            key={`gap-${i}`}
            accessible={false}
            style={{color: c.textPrimary}}>
            …
          </Text>
        ) : (
          button(n, `${n}`, false, n === current)
        ),
      )}
      {button(current + 1, '다음', current === total)}
    </View>
  );
}
