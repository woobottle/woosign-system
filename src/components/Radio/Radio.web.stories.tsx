import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {RadioGroup, Radio} from './index';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  parameters: {layout: 'centered'},
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

function GroupDemo({disabled}: {disabled?: boolean}) {
  const [value, setValue] = useState('standard');
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <Radio value="standard" label="일반 배송" />
      <Radio value="express" label="빠른 배송" />
      <Radio value="pickup" label="매장 픽업" />
    </RadioGroup>
  );
}

export const Default: Story = {render: () => <GroupDemo />};
export const Disabled: Story = {render: () => <GroupDemo disabled />};
