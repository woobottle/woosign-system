import {forwardRef} from 'react';
import type {TextInput} from 'react-native';
import {Input} from '../Input/Input.native';
import type {TextareaNativeProps} from './types';

export const Textarea = forwardRef<TextInput, TextareaNativeProps>(
  function Textarea({numberOfLines = 3, ...props}, ref) {
    return (
      <Input {...props} ref={ref} multiline numberOfLines={numberOfLines} />
    );
  },
);
Textarea.displayName = 'Textarea';
