import {createContext} from 'react';
import type {RadioContextValue} from './types';

/** RadioGroup이 선택 값/콜백/disabled를 자식 Radio에 전달한다. */
export const RadioContext = createContext<RadioContextValue | null>(null);
RadioContext.displayName = 'RadioContext';
