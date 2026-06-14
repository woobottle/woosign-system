import type {Meta, StoryObj} from '@storybook/react-native';
import React from 'react';
import {Card} from './Card';
import {Box} from '../Box';
import {Text} from '../Text';
import {Button} from '../Button';
import type {CardVariant} from './types';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'warm', 'ceramic', 'inverse', 'forest'],
    },
    fullWidth: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {variant: 'default'},
};
export default meta;
type Story = StoryObj<typeof Card>;

const SampleCard = ({variant}: {variant?: CardVariant}) => (
  <Card variant={variant}>
    <Card.Header>
      <Card.Title>오늘의 추천</Card.Title>
      <Card.Description>따뜻한 한 잔으로 시작하세요.</Card.Description>
    </Card.Header>
    <Card.Content>
      <Text>아메리카노, 라떼, 콜드브루를 준비했어요.</Text>
    </Card.Content>
    <Card.Footer>
      <Button>주문하기</Button>
    </Card.Footer>
  </Card>
);

export const Default: Story = {
  render: () => <SampleCard />,
};

export const AllVariants: Story = {
  render: () => {
    const variants: CardVariant[] = [
      'default',
      'outline',
      'ghost',
      'warm',
      'ceramic',
      'inverse',
      'forest',
    ];
    return (
      <Box flexDirection="column" gap={16}>
        {variants.map(variant => (
          <SampleCard key={variant} variant={variant} />
        ))}
      </Box>
    );
  },
};

export const Interactive: Story = {
  render: () => (
    <Card onPress={() => {}}>
      <Card.Header>
        <Card.Title>눌러보세요</Card.Title>
        <Card.Description>onPress가 있는 인터랙티브 카드입니다.</Card.Description>
      </Card.Header>
    </Card>
  ),
};
