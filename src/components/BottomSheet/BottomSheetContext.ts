import {createContext} from 'react';
import type {BottomSheetContextValue} from './types';

/**
 * BottomSheet 표면이 생성한 aria id(titleId/descriptionId)를 서브컴포넌트
 * (BottomSheetTitle/BottomSheetDescription)로 전달한다. web에서만 의미가 있다.
 */
export const BottomSheetContext = createContext<BottomSheetContextValue | null>(
  null,
);
BottomSheetContext.displayName = 'BottomSheetContext';
