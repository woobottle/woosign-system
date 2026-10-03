import type {InputProps, InputWebProps, InputNativeProps} from '../Input/types';

type Excluded = 'multiline' | 'type' | 'secureTextEntry';
export type TextareaProps = Omit<InputProps, Excluded>;
export type TextareaWebProps = Omit<InputWebProps, Excluded>;
export type TextareaNativeProps = Omit<InputNativeProps, Excluded>;
