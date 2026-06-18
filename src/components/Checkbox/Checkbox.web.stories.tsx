import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Checkbox} from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {size: {control: 'select', options: ['sm', 'default', 'lg']}},
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

const ControlledDemo = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
      label="이용약관에 동의합니다"
    />
  );
};

export const Default: Story = {render: () => <ControlledDemo />};
export const Checked: Story = {args: {checked: true, label: '체크됨'}};
export const Indeterminate: Story = {
  args: {indeterminate: true, label: '일부 선택'},
};
export const Disabled: Story = {
  args: {disabled: true, label: '비활성', checked: true},
};
