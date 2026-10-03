import type {Meta, StoryObj} from '@storybook/react';
import {FormField} from './FormField.web';
import {Input} from '../Input/Input.web';
const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: {
    id: 'email-demo',
    label: '이메일',
    description: '업무 이메일을 입력하세요',
    children: props => (
      <Input
        id={props.id}
        required={props.required}
        disabled={props.disabled}
        inputProps={{
          'aria-invalid': props['aria-invalid'],
          'aria-describedby': props['aria-describedby'],
        }}
      />
    ),
  },
};
export default meta;
type Story = StoryObj<typeof FormField>;
export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true}};
export const Error: Story = {args: {error: '이메일을 확인해주세요'}};
