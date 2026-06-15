import {createContext} from 'react';
import type {DrawerContextValue} from './types';

/**
 * Drawer 패널이 생성한 aria id(titleId/descriptionId)를 서브컴포넌트
 * (DrawerTitle/DrawerDescription)로 전달한다. web에서만 의미가 있다.
 */
export const DrawerContext = createContext<DrawerContextValue | null>(null);
DrawerContext.displayName = 'DrawerContext';
