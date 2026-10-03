import type {Meta, StoryObj} from '@storybook/react-native';
import {ScrollArea} from './ScrollArea.native';
import {Text} from '../Text/Text.native';
const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  args: {
    maxHeight: 180,
    children: (
      <>
        {Array.from({length: 20}, (_, i) => (
          <Text key={i}>목록 항목 {i + 1}</Text>
        ))}
      </>
    ),
  },
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;
export const Default: Story = {};
