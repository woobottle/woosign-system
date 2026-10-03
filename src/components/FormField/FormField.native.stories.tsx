import type {Meta, StoryObj} from '@storybook/react-native';
import {FormField} from './FormField.native';
import {Input} from '../Input/Input.native';
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
        disabled={props.disabled}
        textInputProps={{
          accessibilityLabel: props.accessibilityLabel,
          accessibilityHint: props.accessibilityHint,
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
