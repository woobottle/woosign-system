import type {Meta, StoryObj} from '@storybook/react-native';
import {Text, View} from 'react-native';
import {Carousel} from './Carousel.native';

const tones = ['#E4D8C6', '#1F1B16', '#E2572B'];
const slides = ['첫 화면', '두 번째 화면', '세 번째 화면'].map((text, i) => (
  <View
    key={text}
    style={{
      height: 180,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tones[i],
    }}>
    <Text style={{color: i === 0 ? '#1F1B16' : '#FFFFFF', fontSize: 20}}>
      {text}
    </Text>
  </View>
));

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: {label: '온보딩', children: slides},
};
export default meta;
type Story = StoryObj<typeof Carousel>;
export const Default: Story = {};
export const IndicatorsOnly: Story = {args: {showControls: false}};
