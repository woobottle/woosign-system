import {createContext} from 'react';
import type {DialogContextValue} from './types';

/**
 * Dialog 표면이 생성한 aria id(titleId/descriptionId)를 서브컴포넌트
 * (DialogTitle/DialogDescription)로 전달한다. web에서만 의미가 있다.
 */
export const DialogContext = createContext<DialogContextValue | null>(null);
DialogContext.displayName = 'DialogContext';
