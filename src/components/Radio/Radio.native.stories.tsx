import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {RadioGroup, Radio} from './index';
import {Box} from '../Box';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

function GroupDemo({disabled}: {disabled?: boolean}) {
  const [value, setValue] = useState('standard');
  return (
    <Box flexDirection="column" gap={12}>
      <RadioGroup value={value} onValueChange={setValue} disabled={disabled}>
        <Box flexDirection="column" gap={12}>
          <Radio value="standard" label="일반 배송" />
          <Radio value="express" label="빠른 배송" />
          <Radio value="pickup" label="매장 픽업" />
        </Box>
      </RadioGroup>
    </Box>
  );
}

export const Default: Story = {render: () => <GroupDemo />};
export const Disabled: Story = {render: () => <GroupDemo disabled />};
