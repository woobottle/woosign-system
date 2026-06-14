import {createContext} from 'react';
import type {DialogApi} from './types';

/**
 * `<DialogProvider>`가 노출하는 임퍼러티브 DialogApi를 useDialog() 소비자에게
 * 전달한다. `null`이면 Provider가 트리에 없는 것 — useDialog()가 throw한다.
 *
 * 주의: 기존 DialogContext(aria id 전달, web 내부용)와 역할이 다르므로 별도 파일.
 */
export const DialogImperativeContext = createContext<DialogApi | null>(null);
DialogImperativeContext.displayName = 'DialogImperativeContext';
