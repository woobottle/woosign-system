import {forwardRef} from 'react';
import {Input} from '../Input/Input.web';
import type {TextareaWebProps} from './types';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaWebProps>(
  function Textarea({numberOfLines = 3, ...props}, ref) {
    return (
      <Input {...props} ref={ref} multiline numberOfLines={numberOfLines} />
    );
  },
);
Textarea.displayName = 'Textarea';
