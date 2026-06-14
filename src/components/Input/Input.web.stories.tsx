import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Input} from './Input';
import type {InputWebProps} from './types';
import {Box} from '../Box';
import {Text} from '../Text';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {layout: 'centered'},
  argTypes: {
    variant: {control: 'select', options: ['default', 'error']},
    size: {control: 'select', options: ['sm', 'default', 'lg']},
    disabled: {control: 'boolean'},
    readOnly: {control: 'boolean'},
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

function ControlledInput(props: InputWebProps) {
  const [value, setValue] = useState('');
  return <Input {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: () => <ControlledInput placeholder="이름을 입력하세요" />,
};

export const Error: Story = {
  render: () => <ControlledInput variant="error" placeholder="잘못된 입력" />,
};

export const Sizes: Story = {
  render: () => (
    <Box
      style={{display: 'flex', flexDirection: 'column', gap: 12, width: 280}}>
      <ControlledInput size="sm" placeholder="sm" />
      <ControlledInput size="default" placeholder="default" />
      <ControlledInput size="lg" placeholder="lg" />
    </Box>
  ),
};

export const Disabled: Story = {
  render: () => <ControlledInput disabled placeholder="비활성" />,
};

export const ReadOnly: Story = {
  render: () => <Input value="읽기 전용" readOnly />,
};

export const WithIcons: Story = {
  render: () => (
    <ControlledInput
      leftIcon={<Text>🔍</Text>}
      rightIcon={<Text>✕</Text>}
      placeholder="검색"
    />
  ),
};

export const Multiline: Story = {
  render: () => (
    <ControlledInput multiline numberOfLines={4} placeholder="여러 줄 입력" />
  ),
};

export const Date: Story = {
  render: () => <ControlledInput type="date" placeholder="날짜 선택" />,
};
