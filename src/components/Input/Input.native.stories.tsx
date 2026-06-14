import type {Meta, StoryObj} from '@storybook/react-native';
import React, {useState} from 'react';
import {Input} from './Input';
import {Box} from '../Box';
import {Text} from '../Text';
import type {InputSize} from './types';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {control: 'select', options: ['default', 'error']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
    disabled: {control: 'boolean'},
    readOnly: {control: 'boolean'},
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

const ControlledDemo = () => {
  const [value, setValue] = useState('');
  return (
    <Input
      placeholder="이름을 입력하세요"
      value={value}
      onChangeText={setValue}
      fullWidth
    />
  );
};

export const Default: Story = {
  render: () => <ControlledDemo />,
};

export const Error: Story = {
  args: {variant: 'error', placeholder: '오류 상태', fullWidth: true},
};

export const Sizes: Story = {
  render: () => {
    const sizes: InputSize[] = ['sm', 'default', 'lg'];
    return (
      <Box flexDirection="column" gap={12}>
        {sizes.map(size => (
          <Box key={size} gap={4}>
            <Text variant="small" muted>
              {size}
            </Text>
            <Input size={size} placeholder={size} fullWidth />
          </Box>
        ))}
      </Box>
    );
  },
};

export const Disabled: Story = {
  args: {disabled: true, placeholder: '비활성', fullWidth: true},
};

export const Multiline: Story = {
  args: {
    multiline: true,
    numberOfLines: 4,
    placeholder: '여러 줄 입력',
    fullWidth: true,
  },
};
