import type {Meta, StoryObj} from '@storybook/react';

import {Carousel} from './Carousel.web';

const tones = ['#E4D8C6', '#1F1B16', '#E2572B'];
const slides = ['첫 화면', '두 번째 화면', '세 번째 화면'].map((text, i) => (
  <div
    key={text}
    style={{
      height: 220,
      display: 'grid',
      placeItems: 'center',
      background: tones[i],
      color: i === 0 ? '#1F1B16' : '#FFFFFF',
      fontSize: 22,
    }}>
    {text}
  </div>
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
