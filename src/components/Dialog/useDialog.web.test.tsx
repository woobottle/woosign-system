/**
 * useDialog()는 Provider 밖에서 호출되면 throw한다.
 */
import {renderHook} from '@testing-library/react';
import {useDialog} from './useDialog';

describe('useDialog (web)', () => {
  it('throws a helpful error when used outside DialogProvider', () => {
    // renderHook이 콘솔에 에러를 출력하므로 일시적으로 억제
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useDialog())).toThrow(/DialogProvider/);
    spy.mockRestore();
  });
});
