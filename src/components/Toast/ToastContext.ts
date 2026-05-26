import {createContext} from 'react';
import type {ToastApi} from './types';

/**
 * Cross-platform context that carries the imperative `ToastApi` from
 * `<ToastProvider>` down to consumers of `useToast()`.
 *
 * `null` means no provider in the tree — `useToast()` throws in that case.
 */
export const ToastContext = createContext<ToastApi | null>(null);
ToastContext.displayName = 'ToastContext';
